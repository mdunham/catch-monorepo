import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { CenterFrame, Icon, Text, Spinner, colors } from '@catch/rio-ui-kit';

class LoadingStatus extends React.PureComponent {
  static propTypes = {
    debounceTime: PropTypes.number,
    onCompleted: PropTypes.func,
    messages: PropTypes.object.isRequired,
    status: PropTypes.string,
  };
  static defaultProps = {
    // We can increase time here to show messages longer
    debounceTime: 500,
    onCompleted: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
    this.updateStatus = debounce(
      status =>
        this.setState({
          status,
        }),
      props.debounceTime,
    );
    this.onCompleted = debounce(props.onCompleted, props.debounceTime);
  }
  componentDidMount() {
    const { onStart } = this.props;
    // Can trigger a mutation on render
    if (onStart) onStart();
  }
  componentDidUpdate(prevProps, prevState) {
    const { status } = this.props;
    if (status !== prevProps.status && status !== this.state.status) {
      this.updateStatus(status);
    }
    if (this.state.status === 'success' && prevState.status !== 'success') {
      // this syncs our success updates with the delayed state caused by this component
      this.onCompleted();
    }
  }

  render() {
    const { messages } = this.props;
    const { status } = this.state;
    return (
      <CenterFrame>
        {status === 'success' ? (
          <Icon
            name="check"
            dynamicRules={{ paths: { fill: colors.success } }}
            fill={colors.success}
            stroke={colors.success}
            size={28}
          />
        ) : (
          <Spinner large />
        )}
        <Text size="large" weight="medium" center mt={2}>
          {messages[status]}
        </Text>
      </CenterFrame>
    );
  }
}

export default LoadingStatus;
