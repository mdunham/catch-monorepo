import React from 'react';
import { FormattedMessage } from 'react-intl';

export const NUMBER_OF_LIMITS = {
  ROTH_IRA: 8,
  IRA: 7,
  SEP_IRA: 4,
};

export const accountTypes = {
  ROTH_IRA: {
    label: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.label`}
      />
    ),
    subtitle: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.subtitle`}
      />
    ),
    description: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.description`}
      />
    ),
    why: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.why`}
      />
    ),
    limit1: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit1`}
      />
    ),
    limit2: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit2`}
      />
    ),
    limit3: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit3`}
      />
    ),
    limit4: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit4`}
      />
    ),
    limit5: values => (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit5`}
        values={values}
      />
    ),
    limit6: values => (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit6`}
        values={values}
      />
    ),
    limit7: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit7`}
      />
    ),
    limit8: values => (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.roth-ira.limit8`}
        values={values}
      />
    ),
  },
  IRA: {
    label: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.label`}
      />
    ),
    subtitle: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.subtitle`}
      />
    ),
    description: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.description`}
      />
    ),
    why: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.why`}
      />
    ),
    limit1: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit1`}
      />
    ),
    limit2: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit2`}
      />
    ),
    limit3: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit3`}
      />
    ),
    limit4: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit4`}
      />
    ),
    limit5: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit5`}
      />
    ),
    limit6: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit6`}
      />
    ),
    limit7: values => (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.ira.limit7`}
        values={values}
      />
    ),
  },
  SEP_IRA: {
    label: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.label`}
      />
    ),
    subtitle: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.subtitle`}
      />
    ),
    description: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.description`}
      />
    ),
    why: (
      <FormattedMessage
        id={'catch.module.retirement.AccountSelectionView.sep-ira.why'}
      />
    ),
    limit1: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.limit1`}
      />
    ),
    limit2: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.limit2`}
      />
    ),
    limit3: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.limit3`}
      />
    ),
    limit4: (
      <FormattedMessage
        id={`catch.module.retirement.AccountSelectionView.sep-ira.limit4`}
      />
    ),
  },
};

export default accountTypes;
