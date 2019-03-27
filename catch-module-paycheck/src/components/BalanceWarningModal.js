import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  Modal,
  Button,
  Text,
  Box,
  styles,
  colors,
  Icon,
} from '@catch/rio-ui-kit';

// Reused between limited funds and insufficient funds
const BalanceWarningModal = ({
  onDismiss,
  onConfirm,
  title,
  paragraphs,
  confirmText,
  dismissText,
  viewport,
}) => (
  <Modal viewport={viewport} onRequestClose={onDismiss}>
    {viewport === 'PhoneOnly' && (
      <View
        style={styles.get(
          ['RowContainer', 'TopGutter', 'BottomGutter', 'Margins'],
          viewport,
        )}
      >
        <Icon
          name="close"
          size={28}
          onClick={onDismiss}
          fill={colors.primary}
          dynamicRules={{ paths: { fill: colors.primary } }}
        />
      </View>
    )}
    <View
      style={styles.get(
        [
          'ModalMax',
          'Margins',
          'LgTopGutter',
          'Flex1',
          viewport !== 'PhoneOnly' && 'LgBottomGutter',
        ],
        viewport,
      )}
    >
      <Text size="large" weight="bold" mb={2}>
        {title}
      </Text>
      {paragraphs.map((p, i) => (
        <Text key={i} mb={2}>
          {p}
        </Text>
      ))}
      {!!onConfirm ? (
        <Box
          row
          justify="space-between"
          align="center"
          mt={3}
          style={
            viewport === 'PhoneOnly'
              ? styles.get(['BottomBar', 'Margins'], viewport)
              : undefined
          }
        >
          {viewport !== 'PhoneOnly' && (
            <Box flex={1} mr={1}>
              <Button viewport={viewport} type="light" onClick={onDismiss}>
                {dismissText}
              </Button>
            </Box>
          )}
          <Button
            viewport={viewport}
            wide={viewport === 'PhoneOnly'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </Box>
      ) : (
        <Button
          outline
          viewport={viewport}
          onClick={onDismiss}
          style={{ width: '100%', marginTop: 24 }}
        >
          {dismissText}
        </Button>
      )}
    </View>
  </Modal>
);

BalanceWarningModal.propTypes = {
  onDismiss: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  paragraphs: PropTypes.array,
  confirmText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dismissText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default BalanceWarningModal;
