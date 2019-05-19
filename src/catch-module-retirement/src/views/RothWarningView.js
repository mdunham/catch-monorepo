import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Text, H3 } from '@catch/rio-ui-kit';
import { UpdateInfoModal } from '@catch/common';
import { formatCurrency } from '@catch/utils';

const ROTH_LIMITS = {
  DEFAULT: 120000,
  MARRIED_FILING_JOINTLY: 199000,
  MARRIED_FILING_SEPARATELY: 10000,
};

const ROTH_WARNING_LEVELS = {
  DEFAULT: 115000,
  MARRIED_FILING_JOINTLY: 180000,
  MARRIED_FILING_SEPARATELY: 5000,
};

const ACCOUNT_LIMITS = {
  SINGLE: ROTH_LIMITS['DEFAULT'],
  MARRIED: ROTH_LIMITS['MARRIED_FILING_JOINTLY'],
  MARRIED_SEPARATELY: ROTH_LIMITS['MARRIED_FILING_SEPARATELY'],
  HEAD: ROTH_LIMITS['DEFAULT'],
};

const PREFIX = 'catch.module.retirement.RothWarningView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  defaultParagraphOne: values => (
    <FormattedMessage id={`${PREFIX}.defaultParagraphOne`} values={values} />
  ),
  marriedParagraphOne: values => (
    <FormattedMessage id={`${PREFIX}.marriedParagraphOne`} values={values} />
  ),
  defaultParagraphTwo: values => (
    <FormattedMessage id={`${PREFIX}.defaultParagraphTwo`} values={values} />
  ),
  marriedParagraphTwo: values => (
    <FormattedMessage id={`${PREFIX}.marriedParagraphTwo`} values={values} />
  ),
  button: <FormattedMessage id={`${PREFIX}.button`} />,
  combined: <FormattedMessage id={`${PREFIX}.combined`} />,
};

class RothWarningView extends React.PureComponent {
  state = {
    showModal: false,
  };

  componentDidMount() {
    const { filingStatus, householdIncome } = this.props;

    if (filingStatus === 'MARRIED') {
      if (householdIncome >= ROTH_WARNING_LEVELS['MARRIED_FILING_JOINTLY']) {
        this.toggleModal();
      }
    } else if (filingStatus === 'MARRIED_SEPARATELY') {
      if (householdIncome >= ROTH_WARNING_LEVELS['MARRIED_FILING_SEPARATELY']) {
        this.toggleModal();
      }
    } else {
      if (householdIncome >= ROTH_WARNING_LEVELS['DEFAULT']) {
        this.toggleModal();
      }
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  toggleRelatedModal = modal => {
    this.props.openRelatedModal(modal);
  };

  toggleIncomeModal = async () => {
    await this.toggleModal();
    await this.props.toggleIncomeModal();
  };

  render() {
    const { filingStatus, householdIncome, openRelatedModal } = this.props;
    return !this.state.showModal ? null : (
      <UpdateInfoModal
        showDescription={false}
        title={COPY['title']}
        cancelButtonText={false}
        onSave={this.toggleModal}
        saveButtonText={COPY['button']}
      >
        <Box mb={2}>
          <Text>
            {filingStatus === 'SINGLE' || filingStatus === 'HEAD'
              ? COPY['defaultParagraphOne']({
                  income: (
                    <Text
                      onClick={() => this.toggleIncomeModal()}
                      color="link"
                      weight="medium"
                    >
                      {formatCurrency(householdIncome)}
                    </Text>
                  ),
                })
              : COPY['marriedParagraphOne']({
                  income: (
                    <Text
                      onClick={() => this.toggleIncomeModal()}
                      color="link"
                      weight="medium"
                    >
                      {formatCurrency(householdIncome)}
                    </Text>
                  ),
                })}
          </Text>
        </Box>

        <Text>
          {filingStatus === 'SINGLE' ||
          filingStatus === 'HEAD' ||
          filingStatus === 'MARRIED_SEPARATELY'
            ? COPY['defaultParagraphTwo']({
                limit: (
                  <Text weight="medium">
                    {formatCurrency(ACCOUNT_LIMITS[filingStatus])}
                  </Text>
                ),
              })
            : COPY['marriedParagraphTwo']({
                limit: (
                  <Text weight="medium">
                    {formatCurrency(ACCOUNT_LIMITS[filingStatus])}{' '}
                    {COPY['combined']}
                  </Text>
                ),
              })}
        </Text>
      </UpdateInfoModal>
    );
  }
}

export default RothWarningView;
