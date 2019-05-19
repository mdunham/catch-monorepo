import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, withDimensions } from '@catch/rio-ui-kit';
import { EditInfoLayout } from '@catch/common';

import { DeleteInsuranceForm } from '../forms';

const PREFIX = 'catch.health.DeleteInsuranceConfirmationView';
export const COPY = {
  cancel: <FormattedMessage id={`${PREFIX}.cancel`} />,
  delete: <FormattedMessage id={`${PREFIX}.delete`} />,
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

export const DeleteInsuranceConfirmationView = ({
  breakpoints,
  viewport,
  onCancel,
  onConfirm,
  deleteReason,
}) => (
  <EditInfoLayout
    breakpoints={breakpoints}
    onClose={onCancel}
    actions={[
      {
        text: COPY['cancel'],
        onPress: onCancel,
      },
      {
        text: COPY['delete'],
        onPress: onConfirm,
        danger: true,
        disabled: !deleteReason,
      },
    ]}
  >
    <Text style={st.get('H4', viewport)}>{COPY['title']}</Text>
    <Text style={st.get(['Body', 'TopGutter', 'BottomGutter'], viewport)}>
      {COPY['description']}
    </Text>
    <DeleteInsuranceForm viewport={viewport} />
  </EditInfoLayout>
);

DeleteInsuranceConfirmationView.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  viewport: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  deleteReason: PropTypes.string,
};

const Component = withDimensions(DeleteInsuranceConfirmationView);
Component.displayName = 'DeleteInsuranceConfirmationView';

export default Component;
