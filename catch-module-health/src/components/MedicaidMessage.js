import React from 'react';
import { View, Text, StyleSheet, Platform, Linking } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Button, Modal, styles as st, Icon, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.MedicaidMessage';
export const COPY = {
  'SELF.title': <FormattedMessage id={`${PREFIX}.SELF.title`} />,
  'SELF_AND_SPOUSE.title': (
    <FormattedMessage id={`${PREFIX}.SELF_AND_SPOUSE.title`} />
  ),
  'FAMILY.title': <FormattedMessage id={`${PREFIX}.FAMILY.title`} />,
  'CHILD.title': <FormattedMessage id={`${PREFIX}.CHILD.title`} />,
  'CHILDREN.title': <FormattedMessage id={`${PREFIX}.CHILDREN.title`} />,
  'Medicaid.p1': <FormattedMessage id={`${PREFIX}.Medicaid.p1`} />,
  'Medicaid.topButton': (
    <FormattedMessage id={`${PREFIX}.Medicaid.topButton`} />
  ),
  'Medicaid.bottomButton': (
    <FormattedMessage id={`${PREFIX}.Medicaid.bottomButton`} />
  ),
  'CHIP.p1': values => (
    <FormattedMessage id={`${PREFIX}.CHIP.p1`} values={values} />
  ),
  'CHIP.single.p2': <FormattedMessage id={`${PREFIX}.CHIP.single.p2`} />,
  'CHIP.multiple.p2': <FormattedMessage id={`${PREFIX}.CHIP.multiple.p2`} />,
  'CHIP.link': <FormattedMessage id={`${PREFIX}.CHIP.link`} />,
  'CHIP.single.topButton': (
    <FormattedMessage id={`${PREFIX}.CHIP.single.topButton`} />
  ),
  'CHIP.single.bottomButton': (
    <FormattedMessage id={`${PREFIX}.CHIP.single.bottomButton`} />
  ),
  'CHIP.multiple.topButton': values => (
    <FormattedMessage
      id={`${PREFIX}.CHIP.multiple.topButton`}
      values={values}
    />
  ),
  'CHIP.multiple.bottomButton': values => (
    <FormattedMessage
      id={`${PREFIX}.CHIP.multiple.bottomButton`}
      values={values}
    />
  ),
};

const newWindowIcon = {
  name: 'new-window',
  fill: '#fff',
  dynamicRules: { paths: { fill: '#fff' } },
  size: 11,
  style: { marginLeft: 8 },
};

const content = {
  SELF: {
    title: COPY['SELF.title'],
    p1: COPY['Medicaid.p1'],
    topButton: COPY['Medicaid.topButton'],
    bottomButton: COPY['Medicaid.bottomButton'],
  },
  SELF_AND_SPOUSE: {
    title: COPY['SELF_AND_SPOUSE.title'],
    p1: COPY['Medicaid.p1'],
    topButton: COPY['Medicaid.topButton'],
    bottomButton: COPY['Medicaid.bottomButton'],
  },
  FAMILY: {
    title: COPY['FAMILY.title'],
    p1: COPY['Medicaid.p1'],
    topButton: COPY['Medicaid.topButton'],
    bottomButton: COPY['Medicaid.bottomButton'],
  },
  CHILD: {
    title: COPY['CHILD.title'],
    p1: COPY['CHIP.p1'],
    p2: COPY['CHIP.single.p2'],
    topButton: COPY['CHIP.single.topButton'],
    bottomButton: COPY['CHIP.single.bottomButton'],
  },
  CHILDREN: {
    title: COPY['CHILDREN.title'],
    p1: COPY['CHIP.p1'],
    p2: COPY['CHIP.multiple.p2'],
    topButton: COPY['CHIP.multiple.topButton'],
    bottomButton: COPY['CHIP.multiple.bottomButton'],
  },
};

const medicaidUrl =
  'https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/';

const MedicaidMessage = ({
  numChildren,
  status,
  onExit,
  viewport,
  onRemove,
  onContinue,
}) => (
  <Modal onRequestClose={onContinue} style={styles[`modal${viewport}`]}>
    <View style={styles.container}>
      <Icon name="health" size={64} />
      <Text
        style={st.get(
          ['H4', 'BottomGutter', 'XlTopGutter', 'CenterText', 'ButtonMax'],
          viewport,
        )}
      >
        {content[status].title}
      </Text>
      <Text
        style={st.get(
          ['Body', 'BottomGutter', 'CenterText', 'ButtonMax'],
          viewport,
        )}
      >
        {/CHILD|CHILDREN/.test(status)
          ? content[status].p1({
              link: (
                <Text
                  href={medicaidUrl}
                  onPress={Platform.select({
                    default: () => Linking.open(medicaidUrl),
                  })}
                  accessibilityRole={Platform.select({ web: 'link' })}
                  target="_blank"
                  style={st.get(['BodyLink'], viewport)}
                >
                  {COPY['CHIP.link']}
                </Text>
              ),
            })
          : content[status].p1}
      </Text>
      {content[status].p2 && (
        <Text
          style={st.get(
            ['Body', 'BottomGutter', 'CenterText', 'ButtonMax'],
            viewport,
          )}
        >
          {content[status].p2}
        </Text>
      )}
      <View style={st.get(['FullWidth', 'TopGutter', styles.buttonContainer])}>
        <Button
          icon={!/CHILD|CHILDREN/.test(status) && newWindowIcon}
          href={!/CHILD|CHILDREN/.test(status) && medicaidUrl}
          onClick={!/CHILD|CHILDREN/.test(status) ? onExit : onRemove}
        >
          {typeof content[status].topButton === 'function'
            ? content[status].topButton({ number: numChildren })
            : content[status].topButton}
        </Button>
      </View>
      <View
        style={st.get([
          'FullWidth',
          'TopGutter',
          'BottomGutter',
          styles.buttonContainer,
        ])}
      >
        <Button type="outline" onClick={onContinue}>
          {typeof content[status].bottomButton === 'function'
            ? content[status].bottomButton({ number: numChildren })
            : content[status].bottomButton}
        </Button>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalPhoneOnly: {
    width: 343,
  },
  container: {
    padding: 24,
    paddingTop: 40,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    maxWidth: 296,
  },
});

export default MedicaidMessage;
