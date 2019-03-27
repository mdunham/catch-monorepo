import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ListSavingsGoals extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    goals: PropTypes.array,
  };

  render() {
    const { render, loading, error, goals } = this.props;
    return render({
      loading,
      error: JSON.stringify(error),
      goals,
    });
  }
}

export default ListSavingsGoals;
