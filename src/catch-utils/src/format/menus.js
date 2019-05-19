import { STATES, COUNTRIES, RELATIONSHIPS } from '../const';
import { capitalize } from './strings';
import reduce from 'lodash.reduce';

import { filingStatusCopy } from './filingStatus';

export const stateItems = reduce(
  STATES,
  (acc, value, key) => {
    acc.push({ label: value, value: key });
    return acc;
  },
  [],
);

export const countryItems = reduce(
  COUNTRIES,
  (acc, value, key) => {
    acc.push({ label: COUNTRIES[key].name, value: COUNTRIES[key]['alpha-3'] });
    return acc;
  },
  [],
);

// Weirdness going on with imports
export const IDENTIFICATION_TYPES = {
  PASSPORT: 'Passport',
  DRIVERS_LICENSE: "Driver's License",
  STATE_ID: 'State ID',
  ALIEN_REGISTRATION_CARD: 'Alien Registration Card',
  EMPLOYEE_AUTHORIZATION: 'Employee Authorization',
};

export const identificationItems = reduce(
  IDENTIFICATION_TYPES,
  (acc, value, key) => {
    acc.push({ label: value, value: key });
    return acc;
  },
  [],
);

const occupations = [
  'agriculture',
  'clergy_ministry_staff',
  'construction_industrial',
  'education',
  'finance_accounting_tax',
  'fire_first_responders',
  'healthcare',
  'homemaker',
  'labor_general',
  'labor_skilled',
  'law_enforcement_security',
  'legal_services',
  'military',
  'notary_registrar',
  'private_investor',
  'professional_administrative',
  'professional_management',
  'professional_other',
  'professional_technical',
  'retired',
  'sales',
  'self_employed',
  'student',
  'transportation',
  'unemployed',
];

export const occupationItems = occupations.reduce((acc, occ) => {
  acc.push({
    label: occ
      .split('_')
      .map(w => capitalize(w))
      .join(' '),
    value: occ,
  });
  return acc;
}, []);

export const filingStatusItems = {
  items: ['SINGLE', 'MARRIED', 'MARRIED_SEPARATELY', 'HEAD'],
  PREFIX: 'catch.util.format.filingStatuses',
};

export const relationshipItems = reduce(
  RELATIONSHIPS,
  (acc, value, key) => {
    acc.push({ label: value, value: key });
    return acc;
  },
  [],
);
