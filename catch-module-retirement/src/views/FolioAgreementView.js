import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { View, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import {
  Box,
  SplitLayout,
  colors,
  Checkbox,
  Text,
  Spinner,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import {
  FlowLayout,
  AgreementHeaderView,
  FolioFooter,
  UpdateUser,
} from '@catch/common';
import { goTo, navigationPropTypes, createLogger } from '@catch/utils';
import { Markdown } from '@catch/disclosures';

import { RetirementFlow, UploadSignature } from '../containers';
import { FolioSignatureForm } from '../forms';

const Log = createLogger('folio-agreement-view');

const PREFIX = 'catch.module.retirement.FolioAgreementView';
export const COPY = {
  backup: values => (
    <FormattedMessage id={`${PREFIX}.backup`} values={values} />
  ),
  only: <FormattedMessage id={`${PREFIX}.only`} />,
};

const localStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

export class FolioAgreementView extends React.PureComponent {
  static propTypes = {
    folioSignature: PropTypes.string,
    ...navigationPropTypes,
  };

  constructor() {
    super();
    this.goTo = goTo.bind(this);
    this.state = {
      disclosurePartOne: '',
      disclosurePartTwo: '',
      error: null,
      isSubject: false,
    };
  }

  componentWillMount() {
    const disclosurePathOne = `https://s.catch.co/legal/folio-account-opening-summary-part1.md`;
    const disclosurePathTwo = `https://s.catch.co/legal/folio-account-opening-summary-part2.md`;
    try {
      fetch(disclosurePathOne)
        .then(res => res.text())
        .then(text =>
          this.setState({
            disclosurePartOne: text,
          }),
        );

      fetch(disclosurePathTwo)
        .then(res => res.text())
        .then(text =>
          this.setState({
            disclosurePartTwo: text,
          }),
        );
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  toggleBackup = () => {
    this.setState({ isSubject: !this.state.isSubject });
  };

  handleNext = async ({ uploadSignature, updateUser }) => {
    try {
      await updateUser({
        variables: {
          input: {
            subjectBackupWithholding: this.state.isSubject,
          },
        },
      });

      await uploadSignature();
    } catch (e) {
      Log.error(e);
    }
  };

  render() {
    const { folioSignature, viewport } = this.props;

    return (
      <View style={localStyles.base}>
        <RetirementFlow>
          {({ loading, legalName }) => {
            const canClickNext =
              !!folioSignature &&
              folioSignature.toLowerCase() === legalName.toLowerCase();

            return loading ? (
              <Box align="center" mt={3}>
                <Spinner large />
              </Box>
            ) : (
              <UploadSignature
                signature={folioSignature}
                onCompleted={() => this.goTo(['/plan/retirement', '/confirm'])}
              >
                {({ uploadSignature, loading: uploading }) => (
                  <UpdateUser>
                    {({ updateUser, loading: updatingUser }) => (
                      <FlowLayout
                        footer={<FolioFooter />}
                        onBack={() =>
                          this.goTo(['/plan/retirement', '/agreement'])
                        }
                        onNext={() =>
                          this.handleNext({
                            uploadSignature,
                            updateUser,
                          })
                        }
                        canClickNext={canClickNext}
                        isLoading={updatingUser || uploading}
                      >
                        <AgreementHeaderView
                          viewport={viewport}
                          accountType="retirement account"
                          agreementNumber={2}
                          totalAgreements={2}
                          retirement
                        />
                        <View
                          style={styles.get(
                            ['Margins', 'PageWrapper'],
                            viewport,
                          )}
                        >
                          <SplitLayout>
                            <Box>
                              <Markdown
                                height={950}
                                source={this.state.disclosurePartOne}
                              />
                              <Checkbox
                                name="backupWithholding"
                                qaName="backupWithholding"
                                checked={this.state.isSubject}
                                onChange={this.toggleBackup}
                              >
                                <Text size="small" color="charcoal--light1">
                                  {COPY['backup']({
                                    only: (
                                      <Text
                                        size="small"
                                        weight="bold"
                                        color="charcoal--light1"
                                      >
                                        {COPY['only']}
                                      </Text>
                                    ),
                                  })}
                                </Text>
                              </Checkbox>
                              <Markdown
                                height={1300}
                                source={this.state.disclosurePartTwo}
                              />
                            </Box>
                            <Box my={22}>
                              <FolioSignatureForm legalName={legalName} />
                            </Box>
                          </SplitLayout>
                        </View>
                      </FlowLayout>
                    )}
                  </UpdateUser>
                )}
              </UploadSignature>
            );
          }}
        </RetirementFlow>
      </View>
    );
  }
}

const selector = formValueSelector('folioSignatureForm');

const withRedux = connect(state => ({
  folioSignature: selector(state, 'folioSignature'),
}));

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(FolioAgreementView);
