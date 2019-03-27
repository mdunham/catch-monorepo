import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { colors, Divider, Icon, styles } from '@catch/rio-ui-kit';

import DoctorForm from './DoctorForm';

const PREFIX = 'catch.module.health.DoctorsFormList';
export const COPY = {
  'name.label': <FormattedMessage id={`${PREFIX}.name.label`} />,
  addDoctor: <FormattedMessage id={`${PREFIX}.addDoctor`} />,
};

export const DoctorsFormList = ({ fields, formName, formValues, viewport }) => (
  <React.Fragment>
    {fields.map((doctor, idx) => (
      <View key={`doc-${idx}`}>
        {idx !== 0 && (
          <React.Fragment>
            <Divider
              style={styles.get(['TopGutter', 'LgBottomGutter'])}
              color={colors.sage}
              height={2}
            />
            <View style={styles.get('CenterRightRow')}>
              <Icon
                style={styles.get(['SmBottomGutter'])}
                name="trash"
                fill={colors.ink}
                dynamicRules={{ paths: { fill: colors.ink } }}
                onClick={() => {
                  fields.remove(idx);
                }}
              />
            </View>
          </React.Fragment>
        )}
        <DoctorForm
          name={`${doctor}.name`}
          otherType={`${doctor}.otherType`}
          type={`${doctor}.type`}
          phoneNumber={`${doctor}.phoneNumber`}
          form={formName}
          formValues={formValues}
          idx={idx}
        />
      </View>
    ))}
    <TouchableOpacity
      qaName="add-doctor"
      style={styles.get(['CenterColumn', 'LgBottomGutter'])}
      onPress={() => fields.push({})}
    >
      <View style={styles.get('CenterLeftRow')}>
        <Icon
          name="naked-plus"
          size={11}
          fill={colors.flare}
          dynamicRules={{ paths: { fill: colors.flare } }}
        />
        <Text style={styles.get(['XsLeftGutter', 'BodyLink'], viewport)}>
          Add another doctor
        </Text>
      </View>
    </TouchableOpacity>
  </React.Fragment>
);

DoctorsFormList.propTypes = {
  fields: PropTypes.array,
  formName: PropTypes.string,
  viewport: PropTypes.string,
};

export default DoctorsFormList;
