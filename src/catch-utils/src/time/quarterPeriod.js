/**
 * The IRS uses a different quarter system for filing taxes, as self-employed
 * as taxpayers are expected to pay taxes quarterly
 *
 * https://www.irs.gov/faqs/estimated-tax/individuals/individuals-2
 */

/**
 * Key: the current month
 * Value: the begining of the quarter based on the month
 */
const IRS_QUARTERS = {
  1: 1,
  2: 1,
  3: 1,
  4: 4,
  5: 4,
  6: 6,
  7: 6,
  8: 6,
  9: 9,
  10: 9,
  11: 9,
  12: 9,
};

// Relative quarter date text
const QUARTER_TEXT = {
  1: '1/1 - 3/31',
  4: '4/1 - 5/31',
  6: '6/1 - 8/31',
  9: '9/1 - 12/31',
};

const quarterPeriod = date => {
  const currentMonth = date.getMonth() + 1; // 12 months are represented with values 0-11, thus adding 1

  return QUARTER_TEXT[IRS_QUARTERS[currentMonth]];
};

export default quarterPeriod;
