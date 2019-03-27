import isFinite from 'lodash.isfinite';
import { toGQLDate, addYears } from '@catch/utils';

// working days is the number of weekdays we use in a given year to make
// earnings calculations.
const WORKING_DAYS = 260;

const precisionRound = precision => number => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

const fourDecimals = precisionRound(4);
const twoDecimals = precisionRound(2);

function calcPaycheckPercentage(numberOfDays) {
  // Subtract total working days in the year by the number they want to take
  // off.  Divide the number they want to take off by how many they will be
  // working in order to determine the rate (percentage) of each paycheck to be
  // saving for the user.
  const paycheckPercentage = numberOfDays / (WORKING_DAYS - numberOfDays);

  return twoDecimals(paycheckPercentage);
}

function calcMonthlyPayment(percentage, income) {
  // percentage of monthly income
  const monthlyPayment = income / 12 * percentage;
  return twoDecimals(monthlyPayment);
}

export function calculatePTOResults({ numberOfDays, income }) {
  if (!isFinite(numberOfDays)) {
    throw new Error(
      `Must provide positive integer for number of days. Received: ${
        numberOfDays
      }`,
    );
  }
  const paycheckPercentage = calcPaycheckPercentage(numberOfDays);
  const monthlyPayment = calcMonthlyPayment(paycheckPercentage, income);
  return {
    paycheckPercentage,
    monthlyPayment,
    numberOfDays,
  };
}
