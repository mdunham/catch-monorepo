import taxTables from './taxTables';
import { stateToFileName } from './stateAbbrev';
import isInteger from 'lodash.isinteger';
import { createLogger } from '../../logger';
import { precisionRound } from '../../format';

const Log = createLogger('tax calculator');

// ----------------------
// Defaults and Constants
// ----------------------
const currentYear = `${new Date().getFullYear()}`;
// gqlFilingStatuses are the enum's that GQL returns.  For convenience we
// normalize those before starting to make calculations.
export const gqlFilingStatuses = [
  'HEAD',
  'SINGLE',
  'MARRIED',
  'MARRIED_SEPARATELY',
];

// filingStatus is the key used in the JSON tax tables to determine which
// metrics to use.  All calculations depend on having a status of one of the
// below:
const filingStatuses = [
  'single',
  'head_of_household',
  'married',
  'married_separately',
];

// ----------------------
// Utility
// ----------------------
function addBy(array, keyName) {
  return array.reduce((acc, el) => acc + el[keyName], 0);
}

function calculageAGI({ grossIncome, taxDeferredContributions }) {
  return grossIncome - taxDeferredContributions;
}

function normalizeGQLFilingStatus(status) {
  if (filingStatuses.includes(status)) return status;
  if (status === 'HEAD') return 'head_of_household';
  return status.toLowerCase();
}

function calculateTaxableIncome({
  adjustedGrossIncome,
  taxTable,
  numExemptions,
}) {
  const exemptionMult = addBy(taxTable.exemptions, 'exemption_amount');
  const standardDeduction = addBy(taxTable.deductions, 'deduction_amount');
  const totalExemptions = exemptionMult * numExemptions;

  // For now, we will always subtract the standard deduction.  In the future, we
  // may want to allow users to override this value.
  const total = adjustedGrossIncome - totalExemptions - standardDeduction;
  return total > 0 ? total : 0;
}

function calculateFederalLiability({ taxTable, taxableIncome, childCredit }) {
  // sort brackets by highest first.  Example bracket:
  /*
      {
        "bracket": 500000,
        "marginal_rate": 37,
        "marginal_capital_gain_rate": 20,
        "amount": 150689.5
      }
  */
  const brackets = taxTable.income_tax_brackets.sort(
    (a, b) => b.bracket - a.bracket,
  );

  // since they're sorted by highest first, the first time their income is
  // greater than a bracket we can calculate their liability and return
  for (let i = 0; i < brackets.length; i++) {
    const { bracket, amount, marginal_rate } = brackets[i];
    if (taxableIncome > bracket) {
      const taxesOwed =
        amount + (taxableIncome - bracket) * (marginal_rate / 100);
      // Subtract any child credits the user gets for taking care of kids
      return taxesOwed - childCredit;
    }
  }
  return 0;
}

function calculateFicaLiability({
  taxTable,
  taxableIncome,
  filingStatus,
  shareOfIncomeTaxes,
  spouseIncome,
}) {
  // We use a smaller number than taxable income to make all social security and
  // medicare calculations.  This is because the IRS allows you to deduct half
  // of your self employment tax when calculating your net earnings.
  const actualTaxableIncome = taxableIncome * (taxTable.taxableFicaRate / 100);
  const ssRate = taxTable.socialSecurityRate / 100;

  let socialSecurityLiability;
  if (actualTaxableIncome >= taxTable.socialSecurityMax) {
    socialSecurityLiability = taxTable.socialSecurityMax * ssRate;
  } else {
    socialSecurityLiability = actualTaxableIncome * ssRate;
  }

  // Medicare
  const brackets = taxTable.medicare_brackets.sort(
    (a, b) => a.bracket - b.bracket,
  );

  const threshold = brackets[1].bracket;
  const baseMarginalRate = brackets[0].marginal_rate;
  const extraMarginalRate =
    brackets[1].marginal_rate - brackets[0].marginal_rate;

  let medicareLiabilityBase = 0;
  let medicareLiabilityExtra = 0;
  let medicareLiabilityExtraSpouse = 0;

  medicareLiabilityBase = actualTaxableIncome * (baseMarginalRate / 100);

  // once we have the base, now we need determine
  // if there's Medicare Extra and/or Spouse (Extra)
  // (in 2018, this is the 0.9% extra for exceeding $250k as married couple)

  // user earns less than Medicare threshold
  if (actualTaxableIncome <= threshold) {
    // but spouse causes household income to exceed Medicare threshold
    if (actualTaxableIncome + spouseIncome > threshold) {
      medicareLiabilityExtraSpouse =
        (actualTaxableIncome + spouseIncome - threshold) *
        (extraMarginalRate / 100);
    }
  } else {
    // user already earns more than Medicare threshold
    medicareLiabilityExtra =
      (actualTaxableIncome - threshold) * (extraMarginalRate / 100);
    medicareLiabilityExtraSpouse = spouseIncome * (extraMarginalRate / 100);
  }

  return {
    socialSecurityLiability, // only socialSecurityLiability and medicareLiabilityBase
    medicareLiabilityBase, // used to calculate 1/2 FICA deduction
    medicareLiabilityExtra:
      medicareLiabilityExtra < 0.01 ? 0 : medicareLiabilityExtra, // excluded from deduction
    medicareLiabilityExtraSpouse, // excluded from deduction
  };
}

// Currently state taxes don't take into consideration deductions or exemptions.
// We just take a base AGI and apply the marginal rates.
function calculateStateLiability({ taxTable, adjustedGrossIncome }) {
  // State does not have income tax
  if (taxTable.type === 'none') {
    return 0;
  }

  // sorts brackets lowest to highest.  Example bracket:
  // { "bracket": 0, "marginal_rate": 2 },
  // { "bracket": 500, "marginal_rate": 4 },
  const brackets = taxTable.income_tax_brackets.sort(
    (a, b) => a.bracket - b.bracket,
  );

  // only go through the brackets we care about
  let filteredBrackets = [];

  for (let i = 0; i < brackets.length; i++) {
    if (brackets[i].bracket <= adjustedGrossIncome) {
      filteredBrackets.push(brackets[i]);
    }
  }
  let total = 0;

  for (let i = 0; i < filteredBrackets.length; i++) {
    const { bracket, marginal_rate } = filteredBrackets[i];
    const nextBracket = filteredBrackets[i + 1];
    const prevBracket = filteredBrackets[i - 1];

    if (nextBracket) {
      const toAccumulate = nextBracket.bracket - bracket;
      total += toAccumulate * (marginal_rate / 100);
    } else {
      total += (adjustedGrossIncome - bracket) * (marginal_rate / 100);
    }
  }

  return total > 0 ? total : 0;
}

// If the estimated liability is 10,000 and they have a 1,500
// child credit then the user would owe 8,500 in taxes.
function calculateChildCredit({
  taxTable,
  numDependents,
  adjustedGrossIncome,
}) {
  // no kids and therefore no debit
  if (numDependents <= 0) {
    return 0;
  }

  // if AGI is below phase out this is the accounting debit user receives
  const baseCredit = taxTable.childCredit * numDependents;
  let finalCredit;

  if (adjustedGrossIncome > taxTable.childPhaseOut) {
    const phaseOutReduction =
      (adjustedGrossIncome - taxTable.childPhaseOut) /
      1000 *
      taxTable.childReduction;
    finalCredit = baseCredit - phaseOutReduction;
  } else {
    finalCredit = baseCredit;
  }

  // don't want to give a negative debit if that's how thing work out
  return finalCredit > 0 ? finalCredit : 0;
}

// ----------------------
// Business Logic
// ----------------------
export default function calculateTaxes({
  // required
  grossIncome,
  filingStatus,
  state,

  // optional
  spouseIncome = 0,
  taxDeferredContributions = 0,
  numExemptions = 0,
  numDependents = 0,
  year = currentYear,
}) {
  // Protect our API from the evil type insanities of JavaScript
  const originalFilingStatus = filingStatus;
  filingStatus = normalizeGQLFilingStatus(filingStatus);
  if (!filingStatuses.includes(filingStatus)) {
    throw new Error(`Filing status not supported: ${filingStatus}`);
  }

  const taxTable = taxTables[year];
  if (!taxTable) {
    throw new Error(`No tax table configured for the year: ${year}`);
  }

  const stateTaxTable = taxTable[stateToFileName(state)][filingStatus];
  const federalTaxTable = taxTable.federal[filingStatus];
  if (!stateTaxTable) {
    throw new Error(`Could not find tax table for state: ${state}`);
  }

  // These need to be whole numbers.  You can't have half a kid :-)
  // GIncome & TDC come in as cents and should also be whole numbers.
  [
    { name: 'Number of Exemptions', value: numExemptions },
    { name: 'Number of Dependents', value: numDependents },
    { name: 'Tax Deferred Contributions', value: taxDeferredContributions },
  ].forEach(({ name, value }) => {
    if (!isInteger(value)) {
      throw new Error(
        `Expected an int for ${name} but received ${typeof value}: ${value}`,
      );
    }
  });

  spouseIncome = parseFloat(spouseIncome) || 0;
  const shareOfIncomeTaxes =
    filingStatus === 'married' ? grossIncome / (grossIncome + spouseIncome) : 1;

  // -------------------------
  // Intermediate Calculations
  // -------------------------

  const {
    socialSecurityLiability,
    medicareLiabilityBase,
    medicareLiabilityExtra,
    medicareLiabilityExtraSpouse,
  } = calculateFicaLiability({
    taxTable: federalTaxTable,
    taxableIncome: grossIncome,
    filingStatus,
    spouseIncome,
    shareOfIncomeTaxes,
  });

  const selfEmploymentDeduction =
    (socialSecurityLiability + medicareLiabilityBase) / 2;

  const defaultAdjustedGrossIncome = calculageAGI({
    grossIncome: grossIncome - selfEmploymentDeduction,
    taxDeferredContributions,
  });

  const marriedAdjustedGrossIncome =
    spouseIncome > 0
      ? calculageAGI({
          grossIncome:
            filingStatus === 'married'
              ? grossIncome + spouseIncome - selfEmploymentDeduction
              : grossIncome - selfEmploymentDeduction,
          taxDeferredContributions,
        })
      : calculageAGI({
          grossIncome: grossIncome - selfEmploymentDeduction,
          taxDeferredContributions,
        });

  const defaultTaxableIncome = calculateTaxableIncome({
    taxTable: federalTaxTable,
    adjustedGrossIncome: defaultAdjustedGrossIncome, // just the user's income
    numExemptions,
  });

  const marriedTaxableIncome = calculateTaxableIncome({
    taxTable: federalTaxTable,
    adjustedGrossIncome: marriedAdjustedGrossIncome, // combined income
    numExemptions,
  });

  const childCredit = calculateChildCredit({
    taxTable: federalTaxTable,
    adjustedGrossIncome:
      filingStatus === 'married'
        ? marriedAdjustedGrossIncome
        : defaultAdjustedGrossIncome,
    numDependents,
  });

  const federalLiability = calculateFederalLiability({
    taxTable: federalTaxTable,
    taxableIncome:
      filingStatus === 'married' ? marriedTaxableIncome : defaultTaxableIncome,
    childCredit,
  });
  const stateLiability = calculateStateLiability({
    taxTable: stateTaxTable,
    adjustedGrossIncome:
      filingStatus === 'married'
        ? marriedAdjustedGrossIncome
        : defaultAdjustedGrossIncome,
  });

  const totalLiability =
    (federalLiability + stateLiability + medicareLiabilityExtraSpouse) *
      shareOfIncomeTaxes +
    socialSecurityLiability +
    medicareLiabilityBase +
    medicareLiabilityExtra;

  let estimatedPaycheckPercentage;
  if (totalLiability > 0 && grossIncome > 0) {
    estimatedPaycheckPercentage = totalLiability / grossIncome;
  } else {
    estimatedPaycheckPercentage = 0;
  }

  return {
    // total they will owe for the year
    totalLiability: totalLiability > 0 ? totalLiability : 0,
    // what we believe they should be setting aside per paycheck
    estimatedPaycheckPercentage,
    roundedPaycheckPercentage: precisionRound(estimatedPaycheckPercentage, 2),
    inputs: {
      // single, head_of_household, married, married_separately
      originalFilingStatus,
      grossIncome,
      spouseIncome,
      numDependents,
      numExemptions,
      taxDeferredContributions,
      // '2017', '2018', etc.
      year,
      // MA, CA, etc.
      state,
    },
    userResponsibilities: {
      federalLiability: federalLiability * shareOfIncomeTaxes,
      stateLiability: stateLiability * shareOfIncomeTaxes,
      medicareLiability:
        medicareLiabilityExtraSpouse * shareOfIncomeTaxes +
        medicareLiabilityBase +
        medicareLiabilityExtra,
      socialSecurityLiability,
    },
    calculations: {
      // liabilities
      socialSecurityLiability,
      medicareLiabilityBase,
      medicareLiabilityExtra,
      medicareLiabilityExtraSpouse,
      totalFicaLiability:
        socialSecurityLiability +
        medicareLiabilityBase +
        medicareLiabilityExtra,
      selfEmploymentDeduction,
      federalLiability,
      stateLiability,
      shareOfIncomeTaxes,

      // intermediate
      adjustedGrossIncome:
        filingStatus === 'married'
          ? marriedAdjustedGrossIncome
          : defaultAdjustedGrossIncome,
      childCredit,
      taxableIncome:
        filingStatus === 'married'
          ? marriedTaxableIncome
          : defaultTaxableIncome,
    },
  };
}
