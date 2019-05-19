import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, Box, H3, Text, styles as st } from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

const PREFIX = 'catch.plans.TransferFundsSuccessView';
export const COPY = {
  withdrawTitle: <FormattedMessage id={`${PREFIX}.withdrawTitle`} />,
  depositTitle: <FormattedMessage id={`${PREFIX}.depositTitle`} />,
  withdrawDescription: (
    <FormattedMessage id={`${PREFIX}.withdrawDescription`} />
  ),
  depositDescription: <FormattedMessage id={`${PREFIX}.depositDescription`} />,
};

export class TransferFundsSuccessView extends React.PureComponent {
  static propTypes = {
    toggleParentModal: PropTypes.func.isRequired,
    transferType: PropTypes.string.isRequired,
  };

  componentDidMount() {
    setTimeout(
      Platform.select({
        web: () => {
          this.props.replace
            ? this.props.replace('/plan', {})
            : this.props.toggleParentModal();
        },
        default: () => {
          this.props.goTo('/plan', {}, 'RESET');
        },
      }),
      2500,
    );
  }

  render() {
    const { transferType, viewport } = this.props;

    return (
      <View
        style={st.get(
          ['CenterColumn', 'XlTopGutter', 'XlBottomGutter', 'Margins'],
          viewport,
        )}
      >
        <Icon name="circle-check" size={64} />
        <View style={st.get(['LgTopGutter', 'LgBottomGutter'])}>
          <H3>
            {transferType === 'deposit'
              ? COPY['depositTitle']
              : COPY['withdrawTitle']}
          </H3>
        </View>
        <View style={st.get('ContentMax')}>
          <Text center>
            {transferType === 'deposit'
              ? COPY['depositDescription']
              : COPY['withdrawDescription']}
          </Text>
        </View>
      </View>
    );
  }
}

export default TransferFundsSuccessView;
