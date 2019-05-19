import React from 'react';
import { func, object } from 'prop-types';
import { View } from 'react-native';
import { Modal, withDimensions, styles, Box } from '@catch/rio-ui-kit';

/**
 * simple modal implementation used on withdrawal flows
 */

export const WithdrawalModal = ({ children, onRequestClose, viewport }) => (
  <Modal viewport={viewport} onRequestClose={onRequestClose}>
    <View style={styles.get(['ModalMax', 'Flex1'])}>{children}</View>
  </Modal>
);

WithdrawalModal.propTypes = {
  children: object.isRequired,
  onRequestClose: func.isRequired,
};

export default withDimensions(WithdrawalModal);
