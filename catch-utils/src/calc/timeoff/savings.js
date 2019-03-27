import {
  differenceInCalendarMonths,
  isValid,
  isDate,
  addMonths,
  format,
  isFuture,
} from '../../time';
import { precisionRound } from '../../format';
import { createLogger } from '../../logger';

const Log = createLogger('util-goals');

export function calculateEndDateMetrics({
  externalSavings = 0,
  annualIncome,
  target,
  endDate,
}) {
  if (endDate === null) {
    throw new Error('must provide a valid endDate');
  }
  if (!isDate(endDate)) {
    endDate = new Date(endDate);
  }
  if (!(annualIncome > 0)) {
    throw new Error('annual income must be a number greater than 0');
  }
  if (!(target > 0)) {
    throw new Error('target must be greater than 0');
  }
  if (!isValid(endDate)) {
    throw new Error('must provide a valid endDate');
  }
  if (!isFuture(endDate)) {
    throw new Error('must provide an endDate in the future');
  }
  Log.debug({ externalSavings, annualIncome, target, endDate });

  // Perform Calculations - round 0 since it's cents
  const derivedTarget = target - externalSavings;
  const monthlyIncome = precisionRound(annualIncome / 12, 0);
  const monthsAway = differenceInCalendarMonths(endDate, Date.now());
  const monthlyPayment = precisionRound(derivedTarget / monthsAway, 0);
  const paycheckPercentage = precisionRound(monthlyPayment / monthlyIncome, 4);
  Log.debug({ monthlyIncome, monthsAway, monthlyPayment });

  // Do error/warning checking
  const errors = [];
  if (paycheckPercentage > 1) {
    errors.push('Cannot take more than 100% of your paycheck for this goal');
  }

  // Return our calculated results
  const results = {
    annualIncome,
    endDate: format(endDate, 'M/DD/YYYY'),
    errors,
    externalSavings,
    hasEndDate: true,
    monthlyPayment,
    paycheckPercentage,
    target,
  };
  Log.debug(results);
  return results;
}

export function calculateMonthlyAmountMetrics({
  annualIncome,
  target,
  monthlyAmount,
  externalSavings = 0,
}) {
  const derivedTarget = target - externalSavings;
  // dealing with cents so round to nearest digit.
  const monthlyIncome = precisionRound(annualIncome / 12, 0);
  const paycheckPercentage = precisionRound(monthlyAmount / monthlyIncome, 4);
  const numberOfMonths = precisionRound(derivedTarget / monthlyAmount, 0);
  const endDate = format(addMonths(Date.now(), numberOfMonths), 'M/DD/YYYY');
  Log.debug({
    derivedTarget,
    monthlyIncome,
    paycheckPercentage,
    numberOfMonths,
    endDate,
  });

  const errors = [];
  if (paycheckPercentage > 1) {
    errors.push('Cannot take more than 100% of your paycheck for this goal');
  }

  const results = {
    annualIncome,
    endDate,
    errors,
    externalSavings,
    hasEndDate: false,
    monthlyPayment: monthlyAmount,
    paycheckPercentage,
    target,
  };
  Log.debug(results);
  return results;
}

function isEmpty(str) {
  return str === '';
}

function toInt(val) {
  return isEmpty(val) ? 0 : parseInt(val, 10);
}

export function canCalcMonthly({ target, hasTimeFrame, monthlyAmount }) {
  return hasTimeFrame === 'no' && target > 0 && monthlyAmount > 0;
}

export function canCalcEndDate({ target, hasTimeFrame, endDate }) {
  return (
    hasTimeFrame === 'yes' &&
    target > 0 &&
    !isEmpty(endDate) &&
    isFuture(endDate)
  );
}

// parseFormValues takes the stringified version of the redux form values and
// converts them into the form we need for doing calculations.  This is required
// because we want to have nice looking forms with $ 1,000 but need int's do to
// calculations.
export function parseFormValues({
  target,
  externalSavings,
  hasTimeFrame,
  endDate,
  monthlyAmount,
}) {
  return {
    target: toInt(target),
    externalSavings: toInt(externalSavings),
    hasTimeFrame,
    endDate,
    monthlyAmount: toInt(monthlyAmount),
  };
}
