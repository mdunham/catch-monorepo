import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Icon, Text, Box, Modal } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.errors.ErrorModal';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  captionP1: <FormattedMessage id={`${PREFIX}.captionP1`} />,
  captionP2: <FormattedMessage id={`${PREFIX}.captionP2`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

const ErrorModal = ({ onClose }) => (
  <Modal onRequestClose={onClose} style={{ width: 375 }}>
    <Box p={5} align="center">
      <Box p={2}>
        <Icon
          name="ball"
          dynamicRules={{ paths: { fill: '#FF605B' } }}
          fill="#FF605B"
          size={60}
        />
      </Box>
      <Box mb={2}>
        <Text size="large" color="#FF605B" weight="medium">
          {COPY['title']}
        </Text>
      </Box>
      <Box mb={2}>
        <Text color="gray3">{COPY['captionP1']}</Text>
      </Box>
      <Box mb={2}>
        <Text color="gray3">{COPY['captionP2']}</Text>
      </Box>
      <Box row justify="center">
        <Button onClick={onClose}>{COPY['button']}</Button>
      </Box>
    </Box>
  </Modal>
);

ErrorModal.propTypes = {
  onClose: PropTypes.func,
};

export default ErrorModal;
