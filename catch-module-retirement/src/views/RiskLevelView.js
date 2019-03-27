import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, StyleSheet } from 'react-native';

import {
  Box,
  Flex,
  H3,
  withDimensions,
  ResponsiveContainer,
  SplitLayout,
  CenterFrame,
  Spinner,
  styles,
} from '@catch/rio-ui-kit';
import { goTo, navigationPropTypes } from '@catch/utils';
import { FlowLayout, FolioFooter } from '@catch/common';

import { RiskLevelForm } from '../forms';
import { RetirementFlow } from '../containers';

const PREFIX = 'catch.module.retirement.RiskLevelView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
};

export class RiskLevelView extends Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleBack = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/risk-comfort']);
  };
  handleNext = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/portfolio']);
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = this.props.viewport === 'PhoneOnly';
    return (
      <RetirementFlow>
        {({ loading, onUpsert, riskLevel, formValues }) =>
          loading ? (
            <CenterFrame>
              <Spinner large />
            </CenterFrame>
          ) : (
            <FlowLayout
              footer={<FolioFooter />}
              canClickNext={
                formValues &&
                !!formValues.riskLevel &&
                formValues.riskLevel !== 'UNKNOWN_RISK'
              }
              onBack={() => this.handleBack({ onUpsert })}
              onNext={() => this.handleNext({ onUpsert })}
            >
              <View
                style={styles.get(
                  [
                    'FullWidth',
                    'TopSpace',
                    'FormMax',
                    { height: size.window.height },
                  ],
                  viewport,
                )}
              >
                <Box w={isMobile ? 1 : 425} px={isMobile ? 2 : 0}>
                  <H3 weight="normal" mt={isMobile ? 3 : 0} mb={4}>
                    {COPY['title']}
                  </H3>
                  <RiskLevelForm
                    initialValues={{ riskLevel }}
                    onNext={() => this.handleNext({ onUpsert })}
                  />
                </Box>
              </View>
            </FlowLayout>
          )
        }
      </RetirementFlow>
    );
  }
}

export default withDimensions(RiskLevelView);
