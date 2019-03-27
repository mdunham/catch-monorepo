import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { View } from 'react-native';
import { PageTitle, styles } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.HomeTitle';
export const COPY = {
  noPlanTitle: values => (
    <FormattedMessage id={`${PREFIX}.noPlanTitle`} values={values} />
  ),
  noPlanSubtitle: <FormattedMessage id={`${PREFIX}.noPlanSubtitle`} />,
  noNotificationsTitle: (
    <FormattedMessage id={`${PREFIX}.noNotificationsTitle`} />
  ),
  noNotificationsSubtitle: (
    <FormattedMessage id={`${PREFIX}.noNotificationsSubtitle`} />
  ),
  'notificationsTitle--morning': (
    <FormattedMessage id={`${PREFIX}.notificationsTitle--morning`} />
  ),
  'notificationsTitle--afternoon': (
    <FormattedMessage id={`${PREFIX}.notificationsTitle--afternoon`} />
  ),
  'notificationsTitle--evening': (
    <FormattedMessage id={`${PREFIX}.notificationsTitle--evening`} />
  ),
  notificationsSubtitle: values => (
    <FormattedMessage id={`${PREFIX}.notificationsSubtitle`} values={values} />
  ),
  emptyTitle: <FormattedMessage id={`${PREFIX}.emptyTitle`} />,
  emptySubtitle: <FormattedMessage id={`${PREFIX}.emptySubtitle`} />,
  backTitle: <FormattedMessage id={`${PREFIX}.backTitle`} />,
  backSubtitle: values => (
    <FormattedMessage id={`${PREFIX}.backSubtitle`} values={values} />
  ),
};

const selectTitle = ({ type, name, dayTime }) => {
  switch (type) {
    case 'NO_PLAN':
      return COPY['noPlanTitle']({ name });
    case 'NOTIFICATIONS':
      return COPY[`notificationsTitle--${dayTime}`];
    case 'EMPTY':
      return COPY['emptyTitle'];
    case 'NO_NOTIFICATIONS':
      return COPY['noNotificationsTitle'];
    case 'PLAN_STARTED':
    case 'PLAN_PROCESSING':
    default:
      return COPY['backTitle'];
  }
};

const selectSubtitle = ({ type, name }) => {
  switch (type) {
    case 'NO_PLAN':
      return COPY['noPlanSubtitle'];
    case 'EMPTY':
      return COPY['emptySubtitle'];
    case 'NO_NOTIFICATIONS':
      return COPY['noNotificationsSubtitle'];
    case 'NOTIFICATIONS':
      return COPY['notificationsSubtitle']({ name });
    case 'PLAN_STARTED':
    case 'PLAN_PROCESSING':
    default:
      return COPY['backSubtitle']({ name });
  }
};

const HomeTitle = props => (
  <View style={styles.get('Margins', props.breakpoints.current)}>
    <PageTitle
      light
      mt={props.isMobile ? 0 : undefined}
      isMobile={props.isMobile}
      title={selectTitle(props)}
      subtitle={selectSubtitle(props)}
      viewport={props.breakpoints.current}
    />
  </View>
);

HomeTitle.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  dayTime: PropTypes.string,
};

export default HomeTitle;
