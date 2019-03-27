import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, Linking } from 'react-native';

import {
  Box,
  H1,
  H2,
  Text,
  SplitLayout,
  Button,
  Icon,
  colors,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import {
  goTo,
  navigationPropTypes,
  getRouteState,
  createLogger,
} from '@catch/utils';
import { FailCone } from '@catch/errors';
import { UserInfo } from '../containers';
import { FlowLayout } from '../components';

const Log = createLogger('plan-ineligible-user-view');

const DISCLOSURE_PREFIX = 'catch.util.forms.DisclosuresForm';
const PREFIX = 'catch.plans.PlanIneligibleUserView';

export const COPY = {
  isControlPerson: (
    <FormattedMessage id={`${DISCLOSURE_PREFIX}.isControlPerson`} />
  ),
  isFirmAffiliated: (
    <FormattedMessage id={`${DISCLOSURE_PREFIX}.isFirmAffiliated`} />
  ),
  isPoliticallyExposed: (
    <FormattedMessage id={`${DISCLOSURE_PREFIX}.isPoliticallyExposed`} />
  ),
  headline: <FormattedMessage id={`${PREFIX}.headline`} />,
  standardHeadline: <FormattedMessage id={`${PREFIX}.standardHeadline`} />,
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  supportText: <FormattedMessage id={`${PREFIX}.supportText`} />,
  supportButton: <FormattedMessage id={`${PREFIX}.supportButton`} />,
  nextButton: <FormattedMessage id={`${PREFIX}.nextButton`} />,
};

export const Template = ({ copy, qaName }) => (
  <Box my={1} row>
    <Box mt={1}>
      <Icon
        name="check"
        fill={colors.wave}
        stroke={colors.wave}
        strokeWidth={1}
        dynamicRules={{ paths: { fill: colors.wave } }}
        size={14}
      />
    </Box>
    <Text ml={1} italic qaName={qaName}>
      {copy}
    </Text>
  </Box>
);

/**
 * This view is concerned with handling cases where a user sets
 * isControlPerson, isFirmAffiliated, or isPoliticallyExposed to true
 * the route is /plan/{module}/ineligible
 */
export class PlanIneligibleUserView extends PureComponent {
  constructor() {
    super();
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
  }

  handleBack = () => {
    const { prevPath } = this.getRouteState();
    this.goTo(prevPath, { nextPath: prevPath });
  };

  handleSupport = () => {
    Linking.openURL(
      'https://help.catch.co/staying-legal-and-compliant/what-is-kyc',
    );
  };

  render() {
    const { viewport } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    const coneProps = isMobile ? { width: 200, height: 160 } : {};
    return (
      <UserInfo>
        {({
          isFirmAffiliated,
          isPoliticallyExposed,
          isControlPerson,
          loading,
          kycStatus,
        }) => {
          if (loading) return null;

          const isRisky =
            isControlPerson || isFirmAffiliated || isPoliticallyExposed;

          return (
            <FlowLayout
              onBack={this.handleBack}
              onNext={() => this.goTo('/')}
              canClickNext={true}
              nextButtonText={COPY['nextButton']}
            >
              <View style={styles.get(['PageWrapper', 'TopSpace'], viewport)}>
                <SplitLayout>
                  <View
                    style={styles.get([
                      'LgMargins',
                      'LgBottomGutter',
                      'CenterColumn',
                    ])}
                  >
                    <FailCone {...coneProps} />
                  </View>
                  <View
                    style={styles.get(
                      ['LgMargins', 'LgBottomGutter'],
                      viewport,
                    )}
                  >
                    <H1>{COPY['title']}</H1>

                    <Text mt={3} mb={1} size="large">
                      {isRisky ? COPY['headline'] : COPY['standardHeadline']}
                    </Text>

                    {isRisky && (
                      <Box mt={2}>
                        {isControlPerson && (
                          <Template
                            copy={COPY['isControlPerson']}
                            qaName="isControlPerson"
                          />
                        )}
                        {isFirmAffiliated && (
                          <Template
                            copy={COPY['isFirmAffiliated']}
                            qaName="isFirmAffiliated"
                          />
                        )}
                        {isPoliticallyExposed && (
                          <Template
                            copy={COPY['isPoliticallyExposed']}
                            qaName="isPoliticallyExposed"
                          />
                        )}
                      </Box>
                    )}

                    <Box my={3}>
                      <Text size="large">{COPY['supportText']}</Text>
                    </Box>
                    <Box mt={1} row>
                      <Button tertiary onClick={this.handleSupport}>
                        {COPY['supportButton']}
                      </Button>
                    </Box>
                  </View>
                </SplitLayout>
              </View>
            </FlowLayout>
          );
        }}
      </UserInfo>
    );
  }
}

export default withDimensions(PlanIneligibleUserView);
