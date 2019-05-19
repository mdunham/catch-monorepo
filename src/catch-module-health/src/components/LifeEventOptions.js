import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, Button } from '@catch/rio-ui-kit';

import LifeEventCard from './LifeEventCard';

const PREFIX = 'catch.health.LifeEventOptions';

export const COPY = {
  caption: <FormattedMessage id={`${PREFIX}.caption`} />,
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  confirmButton: <FormattedMessage id={`${PREFIX}.confirmButton`} />,
};

const events = [
  {
    title: <FormattedMessage id={`${PREFIX}.0.title`} />,
    list: [
      <FormattedMessage id={`${PREFIX}.0.list.0`} />,
      <FormattedMessage id={`${PREFIX}.0.list.1`} />,
      <FormattedMessage id={`${PREFIX}.0.list.2`} />,
      <FormattedMessage id={`${PREFIX}.0.list.3`} />,
      <FormattedMessage id={`${PREFIX}.0.list.4`} />,
    ],
  },
  {
    title: <FormattedMessage id={`${PREFIX}.1.title`} />,
    list: [
      <FormattedMessage id={`${PREFIX}.1.list.0`} />,
      <FormattedMessage id={`${PREFIX}.1.list.1`} />,
      <FormattedMessage id={`${PREFIX}.1.list.2`} />,
    ],
  },
  {
    title: <FormattedMessage id={`${PREFIX}.2.title`} />,
    list: [
      <FormattedMessage id={`${PREFIX}.2.list.0`} />,
      <FormattedMessage id={`${PREFIX}.2.list.1`} />,
      <FormattedMessage id={`${PREFIX}.2.list.2`} />,
      <FormattedMessage id={`${PREFIX}.2.list.3`} />,
    ],
  },
  {
    title: <FormattedMessage id={`${PREFIX}.3.title`} />,
    list: [
      <FormattedMessage id={`${PREFIX}.3.list.0`} />,
      <FormattedMessage id={`${PREFIX}.3.list.1`} />,
      <FormattedMessage id={`${PREFIX}.3.list.2`} />,
    ],
  },
  {
    title: <FormattedMessage id={`${PREFIX}.4.title`} />,
    list: [
      <FormattedMessage id={`${PREFIX}.4.list.0`} />,
      <FormattedMessage id={`${PREFIX}.4.list.1`} />,
      <FormattedMessage id={`${PREFIX}.4.list.2`} />,
      <FormattedMessage id={`${PREFIX}.4.list.3`} />,
    ],
  },
];

const LifeEventOptions = ({
  viewport,
  input: { value, onChange },
  handleSubmit,
  onNone,
}) => (
  <React.Fragment>
    <View style={st.get(['FullWidth', 'ButtonMax'])}>
      <Text style={st.get(['Body', 'BottomGutter', 'CenterText'], viewport)}>
        {COPY['caption']}
      </Text>
      <Text style={st.get(['H3', 'XlBottomGutter', 'CenterText'], viewport)}>
        {COPY['title']}
      </Text>
    </View>
    {events.map((eventCopy, i) => (
      <View
        key={`life-event-${i}`}
        style={st.get(['BottomGutter', 'ButtonMax', 'FullWidth'])}
      >
        <LifeEventCard
          index={i}
          {...eventCopy}
          viewport={viewport}
          onCheck={() => onChange(i)}
          checked={value === i}
          onConfirm={handleSubmit}
          confirmText={COPY['confirmButton']}
        />
      </View>
    ))}
    <View style={st.get('SmTopGutter')}>
      <Button
        qaName="Continue without life event"
        onClick={() => {
          onChange(null);
          onNone();
        }}
        type="outline"
      >
        {COPY['cancelButton']}
      </Button>
    </View>
  </React.Fragment>
);

LifeEventOptions.propTypes = {
  viewport: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onNone: PropTypes.func.isRequired,
};

export default LifeEventOptions;
