import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Modal, Button, Text, H3, Box } from '@catch/rio-ui-kit';

import Label from './Label';

const PREFIX = 'catch.util.LegalInfoModal';
export const COPY = {
  description: <FormattedMessage id={`${PREFIX}.description`} />,
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  editButton: <FormattedMessage id={`${PREFIX}.editButton`} />,
  confirmButton: <FormattedMessage id={`${PREFIX}.confirmButton`} />,
};

export const LegalInfoModal = ({ onEdit, onConfirm, children }) => (
  <Modal onRequestClose={onEdit}>
    <Box p={4} w={450}>
      <H3>{COPY['title']}</H3>
      <Text mt={2}>{COPY['description']}</Text>
      <Box my={4}>{children}</Box>
      <Box row justify="flex-end">
        <Box mr={2}>
          <Button onClick={onEdit} tertiary>
            {COPY['editButton']}
          </Button>
        </Box>
        <Button onClick={onConfirm}>{COPY['confirmButton']}</Button>
      </Box>
    </Box>
  </Modal>
);

LegalInfoModal.propTypes = {
  children: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default LegalInfoModal;
