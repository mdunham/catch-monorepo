import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { withDimensions, styles } from '@catch/rio-ui-kit';
import { DisclosuresList } from '@catch/disclosures';

import { SettingsLayout } from '../components';

const PREFIX = 'catch.module.me.DisclosuresView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
};

const DisclosuresView = ({ breakpoints, ...other }) => (
  <SettingsLayout title={COPY['title']} breakpoints={breakpoints}>
    <DisclosuresList openExternal key="content" {...other} />
  </SettingsLayout>
);

export default withDimensions(DisclosuresView);
