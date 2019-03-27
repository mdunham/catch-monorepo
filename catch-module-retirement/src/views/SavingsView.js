import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Platform, View, StyleSheet } from 'react-native';

import {
  Box,
  H3,
  withDimensions,
  CenterFrame,
  Spinner,
  Text,
  styles,
} from '@catch/rio-ui-kit';

import { goTo, navigationPropTypes, createLogger } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { FlowLayout, FolioFooter } from '@catch/common';

import { RetirementFlow } from '../containers';
import { ExternalSavingsForm } from '../forms';

const Log = createLogger('retirement-savings-view');

const PREFIX = 'catch.module.retirement.SavingsView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

const localStyles = StyleSheet.create({
  base: {
    height: '100%',
  },
});

export class SavingsView extends React.PureComponent {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleBack = () => {
    this.goTo('/plan/retirement/intro');
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = this.props.viewport === 'PhoneOnly';

    return (
      <ErrorBoundary Component={ErrorMessage}>
        <RetirementFlow
          onCompleted={() => this.goTo(['/plan/retirement', '/risk-comfort'])}
        >
          {({ loading, formValues, externalSavings, onUpsert }) =>
            loading ? (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            ) : (
              <FlowLayout
                canClickNext={true}
                onNext={onUpsert}
                footer={<FolioFooter />}
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
                    <H3 mt={isMobile ? 3 : 0} weight="bold" mb={2}>
                      {COPY['title']}
                    </H3>
                    <Text mb={4}>{COPY['description']}</Text>
                    <ExternalSavingsForm
                      currentValue={formValues && formValues.externalSavings}
                      initialValues={{
                        externalSavings: externalSavings || 0,
                      }}
                    />
                  </Box>
                </View>
              </FlowLayout>
            )
          }
        </RetirementFlow>
      </ErrorBoundary>
    );
  }
}

export default withDimensions(SavingsView);
