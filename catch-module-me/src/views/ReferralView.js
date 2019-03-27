import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, Platform, Clipboard, TouchableOpacity } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import access from 'safe-access';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import {
  Box,
  Text,
  H2,
  Icon,
  NakedInput,
  Input,
  Label,
  colors,
  Link,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import {
  Currency,
  goTo,
  navigationPropTypes,
  Log,
  Segment,
} from '@catch/utils';
import { ReferralCode } from '../containers';

const VIEWER = gql`
  query ReferralView($pagination: Pagination!) {
    viewer {
      transfers(pagination: $pagination, direction: DEPOSIT) {
        edges {
          amount
          isPending
        }
      }
      taxGoal {
        id
        isAccountReady
        status
      }
      ptoGoal {
        id
        isAccountReady
        status
      }
      retirementGoal {
        id
        isAccountReady
        status
      }
    }
  }
`;

const withViewer = graphql(VIEWER, {
  options: { variables: { pagination: { pageNumber: 20, pageSize: 20 } } },
});

const background = {
  backgroundColor: colors['moss--light3'],
};

const PREFIX = 'catch.module.me.ReferralView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: values => <FormattedMessage id={`${PREFIX}.p1`} values={values} />,
  'p1.split': values => (
    <FormattedMessage id={`${PREFIX}.p1.split`} values={values} />
  ),
  termsLink: <FormattedMessage id={`${PREFIX}.termsLink`} />,
  'refLink.label': <FormattedMessage id={`${PREFIX}.refLink.label`} />,
  'refLink.button': <FormattedMessage id={`${PREFIX}.refLink.button`} />,
  'refLink.caption': <FormattedMessage id={`${PREFIX}.refLink.caption`} />,
  'refCode.label': <FormattedMessage id={`${PREFIX}.refCode.label`} />,
  'refCode.caption': <FormattedMessage id={`${PREFIX}.refCode.caption`} />,
  copySuccess: <FormattedMessage id={`${PREFIX}.copySuccess`} />,
  processing: <FormattedMessage id={`${PREFIX}.processing`} />,
  redirectCTA: <FormattedMessage id={`${PREFIX}.redirectCTA`} />,
  redirectToPlan: values => (
    <FormattedMessage id={`${PREFIX}.redirectToPlan`} values={values} />
  ),
};

export class ReferralView extends React.PureComponent {
  constructor() {
    super();
    this.goTo = goTo.bind(this);
    this.state = {
      showCode: false,
      copied: false,
    };
  }
  toggleCode = () => {
    this.setState(({ showCode }) => ({
      showCode: !showCode,
      copied: false,
    }));
  };
  handleCopy = string => {
    if (this.codeField) {
      this.codeField.focus();
      if (Platform.OS === 'web') {
        document.execCommand('copy');
      } else {
        Clipboard.setString(string);
      }
      this.setState({
        copied: true,
      });
    }
  };

  render() {
    const { pr, viewport, data } = this.props;
    const { showCode, copied } = this.state;

    const taxGoal = access(data, 'viewer.taxGoal');
    const ptoGoal = access(data, 'viewer.ptoGoal');
    const retirementGoal = access(data, 'viewer.retirementGoal');
    const deposits = access(data, 'viewer.transfers.edges');

    const filteredDeposits = deposits && deposits.filter(dep => !dep.isPending);

    const depositSum =
      filteredDeposits &&
      filteredDeposits
        .map(item => item.amount)
        .reduce((prev, next) => prev + next, 0);

    const goalsAreReady = [taxGoal, ptoGoal, retirementGoal].some(
      goal => !!goal && !!goal.isAccountReady,
    );

    const canRefer = goalsAreReady && depositSum >= 10;

    const isProcessing =
      !canRefer &&
      [taxGoal, ptoGoal, retirementGoal].some(
        goal => !!goal && goal.status === 'ACTIVE' && !goal.isAccountReady,
      );

    let referralStatus = '';

    if (goalsAreReady && depositSum >= 10) {
      referralStatus = 'canRefer';
    } else if (goalsAreReady && depositSum < 10) {
      referralStatus = 'needsMoney';
    } else if (isProcessing) {
      referralStatus = 'accountProcessing';
    } else {
      referralStatus = 'needsAccount';
    }

    let renderView = () => {
      switch (referralStatus) {
        case 'canRefer':
          return (
            <React.Fragment>
              <ReferralCode>
                {({ loading, refCode }) => (
                  <Box row align="center" wrap>
                    <Input
                      label={
                        showCode ? COPY['refCode.label'] : COPY['refLink.label']
                      }
                      value={
                        showCode
                          ? refCode
                          : `https://app.catch.co/?r=${refCode}`
                      }
                      style={
                        showCode
                          ? { width: 131, fontSize: 18, letterSpacing: 3 }
                          : { width: 266 }
                      }
                      editable={false}
                      myRef={input => (this.codeField = input)}
                      selectTextOnFocus={true}
                      white
                    />
                    {copied ? (
                      <Box
                        screen={viewport}
                        row
                        pl={2}
                        align="flex-end"
                        mb={[3, null, null]}
                      >
                        <Icon
                          name="check"
                          dynamicRules={{ paths: { fill: colors.success } }}
                          fill={colors.success}
                          size={16}
                        />
                        <Text weight="medium" pl={1}>
                          {COPY['copySuccess']}
                        </Text>
                      </Box>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.handleCopy(
                            showCode
                              ? refCode
                              : `https://app.catch.co/?r=${refCode}`,
                          );
                          Segment.copiedRefLink(refCode);
                        }}
                      >
                        <Text color="link" weight="medium" pl={2}>
                          {COPY['refLink.button']}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Box>
                )}
              </ReferralCode>
              <TouchableOpacity onPress={this.toggleCode}>
                <Text size="small" weight="medium">
                  {showCode ? COPY['refCode.caption'] : COPY['refLink.caption']}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        case 'needsMoney':
          return (
            <React.Fragment>
              <Text>
                To start sending referrals, you'll need to contribute a total of{' '}
                <Text weight="medium">at least $10</Text> to your plan.
              </Text>
              <Text mt={2}>
                Once you've deposited $10 or more, check back here for your
                custom referral link.
              </Text>
            </React.Fragment>
          );

        case 'accountProcessing':
          return (
            <Box>
              <Text mb={2}>Your plan is currently processing.</Text>
              <Text>{COPY['processing']}</Text>
            </Box>
          );

        default:
          return (
            <Box>
              <Text mb={2}>
                {COPY['redirectToPlan']({
                  link: (
                    <Text
                      color="link"
                      weight="medium"
                      onClick={() => this.goTo('/plan')}
                    >
                      {COPY['redirectCTA']}
                    </Text>
                  ),
                })}
              </Text>
              <Text>{COPY['processing']}</Text>
            </Box>
          );
      }
    };

    return (
      <View style={styles.get(['Container', 'White'])}>
        <Box row w={1} style={background} pr={pr} align="center">
          <Box
            screen={viewport}
            px={[3, 3, 72]}
            py={[3, 3, 49]}
            w={[1, 1, 4 / 5]}
          >
            <H2 mb={2}>{COPY['title']}</H2>
            <Text mb={2}>
              {/*
              {COPY['p1']({
                amount: (
                  <Text weight="bold">
                    <Currency>5</Currency>
                  </Text>
                ),
              })}
            */}
              {COPY['p1.split']({
                giveAmount: <Text weight="bold">give $20</Text>,
                getAmount: <Text weight="bold">get $10</Text>,
              })}
            </Text>
            <Link newTab to="https://help.catch.co/referrals">
              <Text color="link" weight="medium">
                {COPY['termsLink']}
              </Text>
            </Link>
          </Box>
          {viewport !== 'PhoneOnly' && (
            <Box w={1 / 5}>
              <Icon
                name="gift"
                size={68}
                fill={colors['algae']}
                stroke={colors['algae']}
                style={{ opacity: 0.5 }}
              />
            </Box>
          )}
        </Box>
        <Box screen={viewport} px={[3, 3, 72]} py={[3, 3, 49]}>
          {renderView()}
        </Box>
      </View>
    );
  }
}

const withNavigation = connect(
  undefined,
  { push },
);

const enhance = compose(
  withDimensions,
  withViewer,
  withNavigation,
);

const Component = enhance(ReferralView);

Component.displayName = 'ReferralView';

export default Component;
