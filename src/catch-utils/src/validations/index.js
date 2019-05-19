import React from 'react';
// Wrap redux-form-validators
import Validators, {
  date,
  length,
  confirmation,
  format,
  acceptance,
  inclusion,
  exclusion,
  absence,
  url,
  required,
  presence,
  email,
  numericality,
} from 'redux-form-validators';
import { isFuture } from '../time';
import { parse, isBefore } from 'date-fns';
import { FormattedMessage } from 'react-intl';

// Reusable validation logic
import createValidator from './createValidator';

import Env from '../env';
import { COPY } from './copy';

import PasswordValidation, { isValidPassword } from './PasswordValidation';
import requiresIDV from './requiresIDV';

Validators.formatMessage = function(msg) {
  const props = msg.props || msg;
  return <FormattedMessage {...props} />;
};

// primitives
const baseRequire = required({ msg: COPY['baseRequire'] });
const matches = (otherKey, msg) => (value, values) =>
  value !== values[otherKey] ? msg : null;

// Could be moved in rio-util-time
const eighteenYearsAgo = () => {
  let curYear = new Date().getFullYear();
  let firstDay = new Date(curYear, 1, 1);
  let d = firstDay.setFullYear(firstDay.getFullYear() - 18);
  return d;
};
const currentYear = () => new Date().getFullYear();
const tooYoung = value =>
  !isBefore(parse(value), eighteenYearsAgo())
    ? COPY['tooYoung']({ currentYear: currentYear() })
    : undefined;

export const phoneNumber = value =>
  value && !/^[2-9]\d{2}-\d{3}-\d{4,10000}$/i.test(value)
    ? 'Must be 10 digits'
    : undefined;

export const common = {
  // complex
  required: [baseRequire],
  email: [baseRequire, email({ msg: COPY['email'] })],
  dob: [
    baseRequire,
    date({
      format: 'mm/dd/yyyy',
      msg: COPY['date'],
    }),
    tooYoung,
  ],
  date: [
    baseRequire,
    date({
      format: 'mm/dd/yyyy',
      msg: COPY['date'],
    }),
  ],
  password: [
    baseRequire,
    format({
      with: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
      message: COPY['passwordRequirements'],
    }),
  ],
  phoneNumber: [baseRequire, phoneNumber],
};

const passwordValidation =
  Env.isProd || Env.isStage
    ? [...common.password, length({ min: 8 })]
    : [...common.required, length({ min: 6 })];

// Forms
// TODO: Move these to a separate file
export const bankLinkForm = {
  userName: [required({ msg: COPY['baseRequire'] })],
  password: common.required,
};

export const signInForm = {
  email: common.email,
  password: common.required,
};

export const workInfoForm = {
  workState: common.required,
  filingStatus: common.required,
  estimated1099Income: common.required,
  estimatedW2Income: common.required,
  employerName: common.required,
  spouseIncome: common.required,
};

export const workTypeForm = {
  workType: common.required,
};

export const registerForm = {
  email: common.email,
  password: passwordValidation,
};

export const createUserForm = {
  givenName: common.required,
  familyName: common.required,
  dob: common.dob,
  residenceState: common.required,
  isUsCitizen: [baseRequire, val => (val === false ? 'invalid' : undefined)],
  agreeEsign: [baseRequire, val => (val === false ? 'invalid' : undefined)],
};

export const updateFilingStatusForm = {
  filingStatus: common.required,
};

export const updateIncomeForm = {
  estimatedIncome: common.required,
};

export const updateSpouseIncomeForm = {
  spouseIncome: common.required,
};

export const createSavingsAccount = {
  firstName: common.required,
  lastName: common.required,
  // TODO - ensure proper format
  phoneNumber: common.required,
  dob: common.required,
  homeAddress: common.required,
  ssn: common.required,
};

export const bankLinkMFA = { answer: common.required };
export const passwordReset = { email: common.email };
export const customSavingsGoal = { name: common.required };
export const annualIncome = { income: common.required };
export const pto = { target: common.required };
export const genericSavings = {
  target: common.required,
  endDate: [
    (value, values) => {
      if (values.hasTimeFrame === 'yes') {
        return required({ msg: COPY['endDate.required'] })(value);
      }
    },
    value => {
      if (!isFuture(value)) {
        return COPY['endDate.isFuture'];
      }
    },
  ],
  monthlyAmount: [
    (value, values) => {
      if (values.hasTimeFrame === 'no') {
        return required({ msg: COPY['monthlyAmount'] })(value);
      }
    },
  ],
};
export const taxGoal = {
  filingStatus: common.required,
  spouseIncome: [
    (value, values) => {
      if (values.filingStatus === 'MARRIED') {
        return common.required;
      }
    },
  ],
};

export const identityVerification = {
  identificationType: common.required,
  issuingCountry: common.required,
  issuingState: common.required,
  documentNumber: common.required,
  issuedDate: common.date,
  expirationDate: common.date,
};

export const userBeneficiary = {
  givenName: common.required,
  familyName: common.required,
  relationship: common.required,
  dob: common.dob,
  ssn: common.required,
  street1: common.required,
  city: common.required,
  state: common.required,
  zip: common.required,
};

export const confirmationCode = {
  code: [...common.required, length({ is: 6 })],
};
export const passwordResetConfirmation = {
  code: common.required,
  newPassword: passwordValidation,
  // @NOTE in case we decide to bring it back?
  // newPasswordConfirmation: [
  //   baseRequire,
  //   matches('newPassword', COPY['passwordConfirmation']),
  // ],
};
export const legalAccount = {
  street1: common.required,
  city: common.required,
  state: common.required,
  zip: common.required,
  phoneNumber: common.required,
};

export const socialOccupation = {
  givenName: common.required,
  familyName: common.required,
  occupation: common.required,
  dob: [...common.date],
  ssn: common.required,
};

export const changePassword = {
  oldPassword: common.required,
  newPassword: passwordValidation,
};

export const changeEmail = {
  email: common.email,
};

export const trustedContact = {
  tcName: common.required,
  tcEmail: common.email,
};

export const householdIncomeForm = {
  totalHouseholdIncome: [baseRequire, numericality({ '>': 0 })],
};

export const householdPeopleForm = {
  totalPeopleHousehold: [baseRequire, numericality({ '>': 0 })],
};

export const userContact = {
  givenName: common.required,
  familyName: common.required,
  relation: common.required,
  email: [email({ msg: COPY['email'] })],
};

export const addTaxDependent = {
  givenName: common.required,
  familyName: common.required,
  relation: common.required,
};

export const walletInput = {
  carrier: common.required,
  planName: common.required,
  phoneNumber: [phoneNumber],
};

export const doctorInput = {
  name: common.required,
  type: common.required,
  phoneNumber: [phoneNumber],
};

export {
  // Lib Proxies
  date,
  length,
  confirmation,
  format,
  acceptance,
  inclusion,
  exclusion,
  absence,
  url,
  required,
  presence,
  email,
  numericality,
  // Internal
  createValidator,
  isValidPassword,
  requiresIDV,
  // Components
  PasswordValidation,
};
