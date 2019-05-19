import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LegalIdentification extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    legalName: PropTypes.string,
    dob: PropTypes.string,
    render: PropTypes.func.isRequired,
  };

  render() {
    const { render, loading, error, legalName, dob } = this.props;
    return render({
      loading,
      error,
      legalName,
      dob,
    });
  }
}

export default LegalIdentification;
