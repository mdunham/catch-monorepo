import React from 'react';
import { Linking, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';

import { goTo, STATES } from '@catch/utils';
import { withDimensions } from '@catch/rio-ui-kit';

import { Page, StateSupportMessage } from '../components';
import { ZipcodeForm } from '../forms';
import {
  CountiesByZipcode,
  CheckStateSupport,
  UserZipcode,
  SaveExitStage,
} from '../containers';

const PREFIX = 'catch.health.HealthZipcodeView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  'specialEnrollment.title': (
    <FormattedMessage id={`${PREFIX}.specialEnrollment.title`} />
  ),
  'specialEnrollment.button': (
    <FormattedMessage id={`${PREFIX}.specialEnrollment.button`} />
  ),
  'specialEnrollment.p': (
    <FormattedMessage id={`${PREFIX}.specialEnrollment.p`} />
  ),
  'stateExchange.title': values => (
    <FormattedMessage id={`${PREFIX}.stateExchange.title`} values={values} />
  ),
  'stateExchange.button': (
    <FormattedMessage id={`${PREFIX}.stateExchange.button`} />
  ),
  'stateExchange.p1': <FormattedMessage id={`${PREFIX}.stateExchange.p1`} />,
  'stateExchange.p2': <FormattedMessage id={`${PREFIX}.stateExchange.p2`} />,
};

function isButtonDisabled(counties, isZipValid, isMultiple, multiSelection) {
  return (
    !Array.isArray(counties) ||
    (!isZipValid ||
      (isMultiple ? typeof multiSelection !== 'number' : counties.length !== 1))
  );
}

function showTitle(isStateSupported, stateExchangeUrl) {
  return !isStateSupported && !stateExchangeUrl;
}

function validateZipcode(zipcode) {
  return typeof zipcode === 'string' && zipcode.length === 5;
}

const newWindowIcon = {
  name: 'new-window',
  fill: '#fff',
  dynamicRules: { paths: { fill: '#fff' } },
  size: 11,
  style: { marginLeft: 8 },
};

export class HealthSupportView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleExit = () => {
    this.goTo('/plan/health/exit');
  };
  handleNext = () => {
    this.goTo('/plan/health/life-events');
  };
  handleExchangeLink = (url, cb) => {
    if (Platform.OS !== 'web') {
      Linking.openURL(url);
    }
    cb();
  };
  render() {
    const { viewport, zipcode, multiSelection } = this.props;
    const isZipValid = validateZipcode(zipcode);
    const countyIdx = multiSelection || 0;
    const exitStage = 'STATE_EXCHANGE';

    return (
      <UserZipcode>
        {({ savedZipcode }) => (
          <CountiesByZipcode skip={!isZipValid} zipcode={zipcode}>
            {({ loading, counties, matchMultiple, countyName, stateName }) => (
              <CheckStateSupport
                counties={counties}
                countyIdx={multiSelection || 0}
              >
                {({
                  loading: checking,
                  checkStateSupport,
                  isStateSupported,
                  stateExchangeUrl,
                }) => (
                  <SaveExitStage
                    stage={exitStage}
                    onCompleted={this.handleExit}
                  >
                    {({ saveExitStage }) => (
                      <Page
                        title={
                          showTitle(isStateSupported, stateExchangeUrl) &&
                          COPY['title']
                        }
                        topSpace={
                          !showTitle(isStateSupported, stateExchangeUrl)
                        }
                        actions={[
                          // Mostly for mobile actions
                          isStateSupported
                            ? {
                                onClick: this.handleNext,
                                children: COPY['specialEnrollment.button'],
                              }
                            : stateExchangeUrl
                              ? {
                                  onClick: () =>
                                    this.handleExchangeLink(
                                      stateExchangeUrl,
                                      saveExitStage,
                                    ),
                                  href: stateExchangeUrl,
                                  children: COPY['stateExchange.button'],
                                  icon: newWindowIcon,
                                }
                              : {
                                  // Required to prevent from passing the
                                  // native event to the mutate function
                                  onClick: () => checkStateSupport(),
                                  children: COPY['submitButton'],
                                  disabled: isButtonDisabled(
                                    counties,
                                    isZipValid,
                                    matchMultiple,
                                    multiSelection,
                                  ),
                                },
                        ]}
                        centerBody
                        centerTitle
                        viewport={viewport}
                        renderFooter={
                          showTitle(isStateSupported, stateExchangeUrl) ||
                          viewport === 'PhoneOnly'
                        }
                      >
                        {isStateSupported ? (
                          <StateSupportMessage
                            viewport={viewport}
                            title={COPY['specialEnrollment.title']}
                            paragraphs={[COPY['specialEnrollment.p']]}
                            buttonText={COPY['specialEnrollment.button']}
                            onNext={this.handleNext}
                            icon={{
                              name: 'clipboard-highlight',
                              height: 104,
                              width: 74,
                            }}
                          />
                        ) : stateExchangeUrl ? (
                          <StateSupportMessage
                            viewport={viewport}
                            state={counties[countyIdx].state}
                            title={COPY['stateExchange.title']({
                              state: STATES[counties[countyIdx].state],
                            })}
                            paragraphs={[
                              COPY['stateExchange.p1'],
                              COPY['stateExchange.p2'],
                            ]}
                            buttonText={COPY['stateExchange.button']}
                            buttonIcon={newWindowIcon}
                            url={stateExchangeUrl}
                            onNext={() =>
                              this.handleExchangeLink(
                                stateExchangeUrl,
                                saveExitStage,
                              )
                            }
                          />
                        ) : (
                          <ZipcodeForm
                            zipcodeInvalid={
                              !loading && counties.length === 0 && isZipValid
                            }
                            initialValues={{
                              zipcode: savedZipcode,
                            }}
                            matchMultiple={matchMultiple}
                            countyName={countyName}
                            stateName={stateName}
                            counties={counties}
                            viewport={viewport}
                          />
                        )}
                      </Page>
                    )}
                  </SaveExitStage>
                )}
              </CheckStateSupport>
            )}
          </CountiesByZipcode>
        )}
      </UserZipcode>
    );
  }
}

const selector = formValueSelector('zipcodeForm');

const withRedux = connect(state => ({
  zipcode: selector(state, 'zipcode'),
  multiSelection: selector(state, 'county'),
}));

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(HealthSupportView);
