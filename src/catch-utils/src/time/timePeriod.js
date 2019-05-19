/**
 * Small utility function returns the time period
 * as a string e.g.
 * @param { number } currentHour
 * @return { 'morning' | 'afternoon' | 'evening' }
 */

function timePeriod(currentHour) {
  if (currentHour < 12) {
    return 'morning';
  }
  if (currentHour < 18) {
    return 'afternoon';
  }
  return 'evening';
}

export default timePeriod;
