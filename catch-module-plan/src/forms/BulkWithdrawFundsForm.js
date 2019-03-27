import React, { Component } from 'react';
import { bool, number, oneOfType, shape } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  ReduxInput,
  Box,
  Text,
  Button,
  Divider,
  Link,
  colors,
  fonts,
} from '@catch/rio-ui-kit';
import { ensureZero, normalizeCurrency, formatCurrency } from '@catch/utils';

import { formName } from '../containers/BulkWithdrawFunds';

const PREFIX = 'catch.module.plan.BulkWithdrawFundsForm';
export const COPY = {
  retirementDisclosure: values => (
    <FormattedMessage id={`${PREFIX}.retirementDisclosure`} values={values} />
  ),
  retirementDisclosureLink: (
    <FormattedMessage id={`${PREFIX}.retirementDisclosureLink`} />
  ),
  amountInvested: values => (
    <FormattedMessage id={`${PREFIX}.amountInvested`} values={values} />
  ),
  availableFunds: values => (
    <FormattedMessage id={`${PREFIX}.availableFunds`} values={values} />
  ),
};

const formStyles = {
  textAlign: 'right',
  fontWeight: fonts.medium,
  width: 135,
  fontSize: 18,
  letterSpacing: 1,
  paddingTop: 5,
  paddingBottom: 5,
  marginTop: 7,
};

class BulkWithdrawFundsForm extends Component {
  static propTypes = {
    availableBalances: shape({
      taxBalance: oneOfType([bool, number]).isRequired,
      ptoBalance: oneOfType([bool, number]).isRequired,
      retirementBalance: oneOfType([bool, number]).isRequired,
    }),
  };
  render() {
    const { availableBalances, formValues } = this.props;

    const isTaxFieldValid =
      !!availableBalances.taxBalance &&
      !!formValues &&
      formValues.taxBalance <= availableBalances.taxBalance;

    const isPtoFieldValid =
      !!availableBalances.ptoBalance &&
      !!formValues &&
      formValues.ptoBalance <= availableBalances.ptoBalance;

    return (
      <Box>
        {!!availableBalances.taxBalance && (
          <Box mb={2} row justify="space-between">
            <Box>
              <Text weight="medium">Taxes</Text>
              <Text color={colors.gray3} weight="medium">
                {COPY['availableFunds']({
                  amount: formatCurrency(availableBalances.taxBalance),
                })}
              </Text>
            </Box>
            <Field
              name="taxBalance"
              component={ReduxInput}
              format={val => formatCurrency(val)}
              parse={val => ensureZero(normalizeCurrency(val))}
              confirmable={false}
              style={{
                color: !!isTaxFieldValid ? colors.charcoal : colors.emphasis,
                ...formStyles,
              }}
              grouped
            />
          </Box>
        )}

        {!!availableBalances.taxBalance &&
          !!availableBalances.ptoBalance && <Divider />}

        {!!availableBalances.ptoBalance && (
          <Box my={2} row justify="space-between">
            <Box>
              <Text weight="medium">Time Off</Text>
              <Text color={colors.gray3} weight="medium">
                {COPY['availableFunds']({
                  amount: formatCurrency(availableBalances.ptoBalance),
                })}
              </Text>
            </Box>
            <Field
              name="ptoBalance"
              component={ReduxInput}
              format={val => formatCurrency(val)}
              parse={val => ensureZero(normalizeCurrency(val))}
              confirmable={false}
              style={{
                color: !!isPtoFieldValid ? colors.charcoal : colors.emphasis,
                ...formStyles,
              }}
              grouped
            />
          </Box>
        )}

        {!!availableBalances.ptoBalance &&
          !!availableBalances.retirementBalance && <Divider />}

        {!!availableBalances.retirementBalance && (
          <Box my={2} row justify="space-between">
            <Box>
              <Text weight="medium">Retirement</Text>
              <Text color={colors.gray3} weight="medium">
                {COPY['amountInvested']({
                  amount: formatCurrency(availableBalances.retirementBalance),
                })}
              </Text>
            </Box>
            <Field
              name="retirementBalance"
              component={ReduxInput}
              format={val => formatCurrency(val)}
              parse={val => ensureZero(normalizeCurrency(val))}
              confirmable={false}
              style={{
                color: colors.gray4,
                ...formStyles,
              }}
              disabled
              white
            />
          </Box>
        )}

        {!!availableBalances.retirementBalance && (
          <Text color="subtle" mb={2}>
            {COPY['retirementDisclosure']({
              link: (
                <Link weight="medium" to="#" size={12}>
                  {/* @TODO: add link to customer support */}
                  {COPY['retirementDisclosureLink']}
                </Link>
              ),
            })}
          </Text>
        )}
      </Box>
    );
  }
}

export default reduxForm({
  form: formName,
  enableReinitailize: true,
  destroyOnUnmount: false,
})(BulkWithdrawFundsForm);
