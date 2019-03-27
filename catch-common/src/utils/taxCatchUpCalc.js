/**
 * This util calculates the amount of taxes a given user would owe at a given week within an IRS quarter
 */

import { differenceInCalendarWeeks, isBefore } from 'date-fns';
import { precisionRound } from '@catch/utils';

const WEEKS_PER_YEAR = 52;

const currentYear = new Date().getFullYear();

const today = new Date();

const WEEKS_PER_IRS_QUARTER = {
  1: 13,
  2: 9,
  3: 13,
  4: 17,
};

const QUARTER_STARTS_MAP = {
  1: new Date(currentYear, 0, 1),
  2: new Date(currentYear, 3, 1),
  3: new Date(currentYear, 5, 1),
  4: new Date(currentYear, 8, 1),
};

const QUARTER_STARTS = [
  new Date(currentYear, 0, 1),
  new Date(currentYear, 3, 1),
  new Date(currentYear, 5, 1),
  new Date(currentYear, 8, 1),
];

/**
 * getEstimatedTaxCalcs is used for tax catch up
 * All below calculations are based on calculating how many weeks "today" is into the IRS quarter
 *
 * @param {Number} formValue - the formValue used to dynamically calculate amountOwedNow
 * @param {Number} income - the annual income amount for a user
 * @param {Number} percentage - the percentage of income to be contributed towards tax
 */
export const getEstimatedTaxCalcs = (formValue, income, percentage) => {
  let quarterStartDate = QUARTER_STARTS.filter(
    quarter => !isBefore(today, quarter),
  );

  // the date the quarter strarts
  quarterStartDate = quarterStartDate[quarterStartDate.length - 1];

  // the amount of calendar weeks between the start of the IRS quarter and today
  const weeksDifference =
    differenceInCalendarWeeks(today, quarterStartDate) || 1; // hard code 1 for the first week of the quarter (0 === false)

  // which quarter (1, 2, 3, 4) this is
  const thisQuarter = Object.keys(QUARTER_STARTS_MAP).find(
    key => QUARTER_STARTS_MAP[key].getTime() === quarterStartDate.getTime(),
  );

  // the amount of weeks in this current IRS quarter
  const weeksThisQuarter = WEEKS_PER_IRS_QUARTER[thisQuarter];

  const expectedIncomeThisQuarter =
    income * (weeksThisQuarter / WEEKS_PER_YEAR);

  // the estimated amount of income a user would owe this IRS quarter
  const amountOwedThisQuarter =
    income * percentage * (weeksThisQuarter / WEEKS_PER_YEAR);

  // the estimated amonut of income a user should have earned thus far this quarter
  const projectedAmountEarned =
    expectedIncomeThisQuarter * (weeksDifference / weeksThisQuarter);

  // the estimated amount of income a user should have saved
  const amountOwedNow = precisionRound(
    (formValue || projectedAmountEarned) * percentage,
    2,
  );

  return {
    expectedIncomeThisQuarter,
    amountOwedNow,
    amountOwedThisQuarter,
    projectedAmountEarned,
    quarterStartDate,
    thisQuarter,
  };
};

export default getEstimatedTaxCalcs;
