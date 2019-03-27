import isFinite from 'lodash.isfinite';
import { precisionRound } from '../../format';
import { toGQLDate, addYears } from '../../time';

// working days is the number of weekdays we use in a given year to make
// earnings calculations.
const WORKING_DAYS = 260;

export function calculatePTOMetrics({
  numberOfDays,
  plannedTarget,
  unplannedTarget,
  round = 2,
}) {
  if (!isFinite(plannedTarget)) {
    throw new Error(
      `Must provide positive integer for planned target. Received: ${plannedTarget}`,
    );
  }

  if (!isFinite(unplannedTarget)) {
    throw new Error(
      `Must provide positive integer for unplanned target. Received: ${unplannedTarget}`,
    );
  }

  // Subtract total working days in the year by the number they want to take
  // off.  Divide the number they want to take off by how many they will be
  // working in order to determine the rate (percentage) of each paycheck to be
  // saving for the user.

  const unplannedPaycheckPercentage = precisionRound(
    unplannedTarget / (WORKING_DAYS - unplannedTarget),
    round,
  );

  const plannedPaycheckPercentage = precisionRound(
    plannedTarget / (WORKING_DAYS - plannedTarget),
    round,
  );

  const paycheckPercentage = precisionRound(
    plannedPaycheckPercentage + unplannedPaycheckPercentage,
    round,
  );

  return {
    // endDate has no real meaning right now.  Adding since the field is
    // available in the GQL Type.
    endDate: toGQLDate(addYears(Date.now(), 1)),
    paycheckPercentage,
    unplannedPaycheckPercentage,
    plannedPaycheckPercentage,
    target: numberOfDays,
  };
}
