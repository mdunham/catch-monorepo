import React from 'react';
import PropTypes from 'prop-types';
import { Icon, styles } from '@catch/rio-ui-kit';

const NavAlert = ({ showAlert, onGo }) =>
  showAlert ? (
    <Icon
      name="alert"
      size={24}
      onClick={onGo}
      style={styles.get('RightGutter')}
    />
  ) : null;

NavAlert.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  onGo: PropTypes.func.isRequired,
};

export default NavAlert;
