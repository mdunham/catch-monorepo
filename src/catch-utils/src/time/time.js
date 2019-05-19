const second = 1000;
const minute = second * 60;
const hour = minute * 60;

export function seconds(amount = 1) {
  return second * amount;
}

export function mins(amount = 1) {
  return minute * amount;
}

export function hours(amount = 1) {
  return hour * amount;
}
