import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, Button, Icon } from '@catch/rio-ui-kit';

const PREFIX = 'catch.home.HealthExitCard';
export const COPY = {
  'enrollYes.title': <FormattedMessage id={`${PREFIX}.enrollYes.title`} />,
  'enrollYes.coveredTitle': (
    <FormattedMessage id={`${PREFIX}.enrollYes.coveredTitle`} />
  ),
  'enrollYes.subtitle': values => (
    <FormattedMessage id={`${PREFIX}.enrollYes.subtitle`} values={values} />
  ),
  'enrollYes.caption': <FormattedMessage id={`${PREFIX}.enrollYes.caption`} />,
  'enrollYes.coveredCaption': (
    <FormattedMessage id={`${PREFIX}.enrollYes.coveredCaption`} />
  ),
  'enrollYes.leftButton': (
    <FormattedMessage id={`${PREFIX}.enrollYes.leftButton`} />
  ),
  'enrollYes.rightButton': (
    <FormattedMessage id={`${PREFIX}.enrollYes.rightButton`} />
  ),
  'enrollNo.title': <FormattedMessage id={`${PREFIX}.enrollNo.title`} />,
  'enrollNo.subtitle': values => (
    <FormattedMessage id={`${PREFIX}.enrollNo.subtitle`} values={values} />
  ),
  'enrollNo.link': <FormattedMessage id={`${PREFIX}.enrollNo.link`} />,
  'enrollNo.dismissButton': (
    <FormattedMessage id={`${PREFIX}.enrollNo.dismissButton`} />
  ),
  'enrollNil.title': <FormattedMessage id={`${PREFIX}.enrollNil.title`} />,
  'enrollNil.coveredTitle': (
    <FormattedMessage id={`${PREFIX}.enrollNil.coveredTitle`} />
  ),
  'enrollNil.subtitle': values => (
    <FormattedMessage id={`${PREFIX}.enrollNil.subtitle`} values={values} />
  ),
  'enrollNil.leftButton': (
    <FormattedMessage id={`${PREFIX}.enrollNil.leftButton`} />
  ),
  'enrollNil.rightButton': (
    <FormattedMessage id={`${PREFIX}.enrollNil.rightButton`} />
  ),
  'origin.stateExchange': (
    <FormattedMessage id={`${PREFIX}.origin.stateExchange`} />
  ),
  'origin.medicare': <FormattedMessage id={`${PREFIX}.origin.medicare`} />,
  'origin.medicaid': <FormattedMessage id={`${PREFIX}.origin.medicaid`} />,
  'origin.healthcareGov': (
    <FormattedMessage id={`${PREFIX}.origin.healthcareGov`} />
  ),
};
const tri = {
  ENROLL_YES: {
    title: COPY['enrollYes.title'],
    subtitle: COPY['enrollYes.subtitle'],
    leftButton: COPY['enrollYes.leftButton'],
    rightButton: COPY['enrollYes.rightButton'],
  },
  ENROLL_NO: {
    title: COPY['enrollNo.title'],
    subtitle: COPY['enrollNo.subtitle'],
    dismissButton: COPY['enrollNo.dismissButton'],
  },
  ENROLL_NIL: {
    title: COPY['enrollNil.title'],
    subtitle: COPY['enrollNil.subtitle'],
    leftButton: COPY['enrollNil.leftButton'],
    rightButton: COPY['enrollNil.rightButton'],
  },
};

const coTitles = {
  ENROLL_YES: COPY['enrollYes.coveredTitle'],
  ENROLL_NO: COPY['enrollNo.title'],
  ENROLL_NIL: COPY['enrollNil.coveredTitle'],
};

const origins = {
  STATE_EXCHANGE: COPY['origin.stateExchange'],
  MEDICARE: COPY['origin.medicare'],
  MEDICAID: COPY['origin.medicaid'],
  HEALTHCARE_GOV: COPY['origin.healthcareGov'],
};

const icons = {
  ENROLL_YES: 'health-covered',
  ENROLL_NO: 'thumb-accent',
  ENROLL_NIL: 'health-default',
};

const HealthExitCard = ({
  viewport,
  state,
  origin,
  isCovered,
  onDismiss,
  onExplore,
  onLeftAction,
  onRightAction,
}) => (
  <View
    style={st.get(['Card', 'BottomGutter', 'SmLeftGutter', 'SmRightGutter'])}
  >
    <View style={st.get('CenterColumn')}>
      <Icon name={icons[state]} size={68} />
    </View>
    <Text style={st.get(['H4', 'BottomGutter', 'LgTopGutter'], viewport)}>
      {isCovered ? coTitles[state] : tri[state].title}
    </Text>
    {!(isCovered && /YES/.test(state)) && (
      <Text
        style={st.get(
          ['Body', /YES/.test(state) ? 'BottomGutter' : 'XlBottomGutter'],
          viewport,
        )}
      >
        {tri[state].subtitle({
          origin: origins[origin],
          link: (
            <Text onPress={onExplore} style={st.get('BodyLink', viewport)}>
              {COPY['enrollNo.link']}
            </Text>
          ),
        })}
      </Text>
    )}
    {/YES/.test(state) && (
      <Text style={st.get(['Body', 'XlBottomGutter'], viewport)}>
        {isCovered
          ? COPY['enrollYes.coveredCaption']
          : COPY['enrollYes.caption']}
      </Text>
    )}
    {/YES|NIL/.test(state) ? (
      <View style={st.get(['Row', 'FullWidth'])}>
        <View style={st.get(['Flex1', 'SmRightGutter'])}>
          <Button viewport={viewport} type="outline" onClick={onLeftAction}>
            {tri[state].leftButton}
          </Button>
        </View>
        <View style={st.get('Flex1')}>
          <Button viewport={viewport} onClick={onRightAction}>
            {tri[state].rightButton}
          </Button>
        </View>
      </View>
    ) : (
      <Button viewport={viewport} onClick={onDismiss}>
        {tri[state].dismissButton}
      </Button>
    )}
  </View>
);

export default HealthExitCard;
