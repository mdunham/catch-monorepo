import { stateItems } from '../format';
import { createLogger } from '../logger';

const Log = createLogger('test-user');

const STATUSES = ['SINGLE', 'MARRIED', 'MARRIED_SEPARATELY', 'HEAD'];

const PEOPLE = {
  andrew: 'Ambrosino',
  kristen: 'Tyrrell',
  cat: 'Turner',
  zack: 'Labadie',
  alvin: 'Ohlenbusch',
  misha: 'Bove',
  sam: 'Baccam',
  stefan: 'VanBuren',
  steve: 'Watkins',
  dan: 'Tenner',
  thomas: 'Chardin',
  rhan: 'Kim',
  edward: 'Ma',
};

const workTypes = {
  W2: 'WORK_TYPE_W2',
  '1099': 'WORK_TYPE_1099',
  MIXED: 'WORK_TYPE_DIVERSIFIED',
};

// Utils
export const generateEmail = name => {
  const timeStamp = Math.floor(Date.now() / 1000);
  return `${name}+${timeStamp}@catch.co`;
};
export const generateNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
export const pickRandom = values => {
  return values[Math.floor(Math.random() * values.length)];
};
export const firstCap = word => word.replace(/^\w/, c => c.toUpperCase());
const selectIncomes = workType => {
  switch (workType) {
    case 'WORK_TYPE_W2':
      return {
        estimatedW2Income: generateNumber(80000, 200000),
      };
    case 'WORK_TYPE_1099':
      return {
        estimated1099Income: generateNumber(80000, 200000),
      };
    case 'WORK_TYPE_DIVERSIFIED':
    default:
      return {
        estimatedW2Income: generateNumber(10000, 200000),
        estimated1099Income: generateNumber(5000, 200000),
      };
  }
};

export const generateRandomUser = ({ email, password }) => {
  if (!email) return {};
  const name = email.split('@')[0];
  const state = pickRandom(stateItems).value;
  const credentials = {
    email: generateEmail(name),
    password: workTypes[password] ? 'password' : password,
    givenName: firstCap(name),
    familyName: PEOPLE[name] || 'Testy',
    dob: '07/27/1997',
    spouseIncome: generateNumber(80000, 200000),
    residenceState: state,
    workState: state,
    filingStatus: pickRandom(STATUSES),
    employerName: 'Catch',
    workType: workTypes[password] || 'WORK_TYPE_1099',
    ...selectIncomes(workTypes[password]),
  };
  Log.info(credentials);
  return credentials;
};
