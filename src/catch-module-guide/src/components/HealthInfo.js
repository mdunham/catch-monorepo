import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { styles as st } from '@catch/rio-ui-kit';

const HealthInfo = ({ carrier, doctors, viewport }) => {
  const max = viewport === 'PhoneOnly' ? 1 : 3;
  return (
    <View>
      <Text
        style={st.get(
          ['Body', 'SmBottomGutter', !carrier && 'SmTopGutter'],
          viewport,
        )}
      >
        {carrier ? carrier : 'Health insurance is covered'}
      </Text>
      <View style={st.get([viewport === 'PhoneOnly' && 'Row'])}>
        {carrier ? (
          doctors.map(
            (doc, i) =>
              i <= max - 1 ? (
                <Text key={doc.id} style={st.get('Body', viewport)}>
                  {doc.name}
                </Text>
              ) : null,
          )
        ) : doctors.length ? (
          <Text style={st.get('Body', viewport)}>
            {doctors[0].name}{' '}
            {doctors.length > 1 &&
              `+ ${doctors.length - 1} more doctor${
                doctors.length > 2 ? 's' : ''
              }`}
          </Text>
        ) : (
          undefined
        )}
        {carrier &&
          doctors.length > max && (
            <Text
              style={st.get(
                ['Body', viewport === 'PhoneOnly' && 'SmLeftGutter'],
                viewport,
              )}
            >
              + {doctors.length - max} more{' '}
              {doctors.length - max === 1 ? 'doctor' : 'doctors'}
            </Text>
          )}
      </View>
    </View>
  );
};

HealthInfo.propTypes = {
  carrier: PropTypes.string.isRequired,
  doctors: PropTypes.array,
  viewport: PropTypes.string.isRequired,
};

export default HealthInfo;
