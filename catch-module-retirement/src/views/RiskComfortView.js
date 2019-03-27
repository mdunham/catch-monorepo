import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, StyleSheet } from 'react-native';

import {
  Box,
  Flex,
  H3,
  withDimensions,
  CenterFrame,
  Spinner,
  styles,
} from '@catch/rio-ui-kit';
import { goTo, navigationPropTypes } from '@catch/utils';
import { FlowLayout, FolioFooter } from '@catch/common';

import { RiskComfortForm } from '../forms';
import { RetirementFlow } from '../containers';

const PREFIX = 'catch.module.retirement.RiskComfortView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
};

export class RiskComfortView extends Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleBack = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/current-savings']);
  };
  handleNext = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/risk-level']);
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = this.props.viewport === 'PhoneOnly';

    return (
      <RetirementFlow>
        {({ loading, onUpsert, riskComfort, formValues }) =>
          loading ? (
            <CenterFrame>
              <Spinner large />
            </CenterFrame>
          ) : (
            <FlowLayout
              footer={<FolioFooter />}
              canClickNext={formValues && !!formValues.riskComfort}
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
                  <RiskComfortForm
                    initialValues={{ riskComfort }}
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

export default withDimensions(RiskComfortView);
