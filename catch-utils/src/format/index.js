import isNaN from 'lodash.isnan';
// import { stateItems } from './states';

export { capitalize } from './strings';
export {
  occupationItems,
  stateItems,
  countryItems,
  identificationItems,
  filingStatusItems,
  relationshipItems,
} from './menus';
export { filingStatusCopy, filingStatusesLowerCase } from './filingStatus';
export {
  insuranceSourcesCopy,
  insuranceSourcesCopyUppercase,
} from './insuranceSources';
export { default as getAccount } from './getAccount';

// TODO: separate these out into different files for the different formatting
// purposes.

function onlyNums(value = '') {
  return value.replace(/[^\d]/g, '');
}

function noSpaces(value = '') {
  return value.replace(/[\s]/, '');
}

// allows only letters and - (hyphenated names)
function legalName(value = '') {
  return value.replace(/[^A-Za-z-' ]+/g, '');
}

export function formatLegalName(value) {
  if (!value) {
    return value;
  }
  return legalName(value);
}

export function formatPhone(value) {
  if (!value) {
    return value;
  }

  const nums = onlyNums(value);

  if (nums.length <= 3) {
    return nums;
  }

  if (nums.length <= 7) {
    return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  }

  return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6, 10)}`;
}

export function formatNoSpaces(value) {
  if (!value) {
    return value;
  }

  return noSpaces(value);
}

export function formatDate(value, isDeleting = false) {
  if (!value) return value;

  let output = value
    .replace(/^(\d\d)(\d)$/g, '$1/$2')
    .replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2')
    .replace(/[^\d\/]/g, '');

  return output.substr(0, 10);
}

export function formatSSN(value) {
  if (!value) {
    return value;
  }
  const nums = onlyNums(value);

  if (nums.length <= 3) {
    return nums;
  }
  if (nums.length <= 5) {
    return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  }
  return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5, 9)}`;
}

// formatCurrency takes a value and ensures it's properly formatted to appear
// like currency by including the $ sign and not allowing multiple periods in
// the number.  In its current state it does not handle internationalization and
// if we want to format currencies for other countries we'll have to look into
// this further.
export const formatCurrency = value => {
  if (typeof value === 'undefined') {
    return value;
  }
  value = value.toString();

  value = value.replace(/[^0-9.]/g, ''); // Remove all chars except numbers and .
  const sections = value.split('.');

  // Remove any leading 0s apart from single 0
  if (sections[0] !== '0' && sections[0] !== '00') {
    sections[0] = sections[0].replace(/^0+/, '');
  } else {
    sections[0] = '0';
  }

  const addCommas = num => num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // If numbers exist after first .
  if (sections[1]) {
    // Join first two sections and truncate end section to length 2
    return '$' + addCommas(sections[0]) + '.' + sections[1].slice(0, 2);
    // If original value had a decimal place at the end, add it back
  } else if (value.indexOf('.') !== -1) {
    return '$' + addCommas(sections[0]) + '.';
    // Otherwise, return only section
  } else {
    return '$' + addCommas(sections[0]);
  }
};

// normalizeCurrency removes all '$' characters so the values that get saved in
// the redux store can be in a more usable form i.e. '12.34' vs. '$ 12.34'
export function normalizeCurrency(value) {
  if (!value) return value;
  return value.replace(/[^0-9.]/g, '');
}

// toCents takes a floating point dollar value and converts it to pennies to be
// sent accross the wire via GraphQL.
export function toCents(value) {
  if (typeof value === 'undefined') {
    return 0;
  }
  const rounded = precisionRound(parseFloat(value), 2);
  return parseInt((rounded * 100).toFixed(), 10);
}

// toDollars takes a cents representation of a number and converts it to the
// floating point dollar representation
export function toDollars(value) {
  if (!value) return 0;
  return value / 100;
}

// preceisionRound allows you to round a number to a specific decimal place.
export function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

export function ensureZero(value) {
  return isNaN(value) ? 0 : value;
}

// Helpful to format a reference to a specific bank account
export function accountRef({
  bankName,
  accountName = 'Account',
  accountNumber = '0000000',
}) {
  const lastFour = accountNumber.slice(accountNumber.length - 4);
  if (bankName) return `${bankName} ${accountName} - ${lastFour}`;
  return `${accountName} - ${lastFour}`;
}
