import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Box, ReduxCheckbox, Divider, Text } from '@catch/rio-ui-kit';

export class NotificationGroupForm extends React.Component {
  static propTypes = {
    notifications: PropTypes.object.isRequired,
    notificationsType: PropTypes.string.isRequired,
    labels: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired,
  };

  render() {
    const {
      formValues,
      notifications,
      notificationsType,
      labels,
      title,
      update,
    } = this.props;
    return (
      <Box style={{ maxWidth: 400 }} mb={3}>
        <Divider mb={2} />
        <Text my={2} weight="medium">
          {title}
        </Text>
        {Object.keys(notifications).map((key, value) => (
          <Box mb={2} key={`${notificationsType}${value}`}>
            <Field
              name={key}
              component={ReduxCheckbox}
              onChange={() =>
                update({
                  variables: {
                    input: {
                      [`${notificationsType}NotificationSettings`]: {
                        [key]: !notifications[key],
                      },
                    },
                  },
                })
              }
            >
              {labels[key]}
            </Field>
          </Box>
        ))}
      </Box>
    );
  }
}

const withFormValues = connect(state => ({
  formValues: getFormValues('NotificationGroup')(state),
}));

const withForm = reduxForm({
  form: 'NotificationGroup',
  destroyOnUnmount: true,
  enableReinitialize: false,
});

const enhance = compose(
  withForm,
  withFormValues,
);

export default enhance(NotificationGroupForm);
