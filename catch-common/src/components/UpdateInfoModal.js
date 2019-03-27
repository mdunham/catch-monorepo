import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import {
  Modal,
  Button,
  Text,
  H3,
  Box,
  styles,
  Spinner,
  withDimensions,
} from '@catch/rio-ui-kit';

import Label from './Label';

const PREFIX = 'catch.util.views.UpdateIncomeView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  saveButton: <FormattedMessage id={`${PREFIX}.saveButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

export const UpdateInfoModal = ({
  onCancel,
  onSave,
  children,
  title,
  descriptionLabel,
  cancelButtonText,
  saveButtonText,
  showDescription,
  loading,
  canSave,
  isSaving,
  viewport,
  breakpoints,
}) => (
  <Modal viewport={viewport} onRequestClose={onCancel}>
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding' })}
      style={styles.get('Flex1')}
    >
      <ScrollView
        style={styles.get(
          ['ModalMax', 'LgTopGutter', 'BottomSpace', 'Margins'],
          viewport,
        )}
      >
        <H3 mb={2}>{title}</H3>
        {showDescription && <Text>{COPY['description']}</Text>}
        <View style={styles.get(['LgTopGutter', 'LgBottomGutter'])}>
          {children}
        </View>
      </ScrollView>
      <View
        style={styles.get(
          [
            'CenterRightRow',
            'Margins',
            'BottomBar',
            breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': 'BottomGutter',
            }),
          ],
          viewport,
        )}
      >
        {cancelButtonText && (
          <View
            style={styles.get([
              breakpoints.select({ PhoneOnly: 'Flex1' }),
              'RightGutter',
            ])}
          >
            <Button
              wide={breakpoints.select({ PhoneOnly: true })}
              onClick={onCancel}
              type="light"
              viewport={viewport}
            >
              {cancelButtonText}
            </Button>
          </View>
        )}
        <View style={styles.get([breakpoints.select({ PhoneOnly: 'Flex1' })])}>
          <Button
            wide={breakpoints.select({ PhoneOnly: true })}
            disabled={!canSave}
            onClick={onSave}
            viewport={viewport}
          >
            {isSaving ? 'Updating...' : saveButtonText}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

UpdateInfoModal.propTypes = {
  children: PropTypes.node.isRequired,
  // Required otherwiser a user could be stuck on that modal forever
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  canSave: PropTypes.bool,
  isSaving: PropTypes.bool,
};

UpdateInfoModal.defaultProps = {
  title: COPY['title'],
  descriptionLabel: COPY['descriptionLabel'],
  cancelButtonText: COPY['cancelButton'],
  saveButtonText: COPY['saveButton'],
  showDescription: true,
  canSave: true,
  isSaving: false,
};

const Component = withDimensions(UpdateInfoModal);

Component.displayName = 'UpdateInfoModal';

export default Component;
