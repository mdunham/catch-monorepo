import React from 'react';
import { Text, View, StyleSheet, Platform, Linking } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Button, Modal, styles as st, Icon, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.MedicareMessage';

const content = {
  SELF: {
    title: <FormattedMessage id={`${PREFIX}.SELF.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.SELF.caption`} />,
    topButton: <FormattedMessage id={`${PREFIX}.SELF.topButton`} />,
    bottomButton: <FormattedMessage id={`${PREFIX}.SELF.bottomButton`} />,
  },
  SELF_AND_SPOUSE: {
    title: <FormattedMessage id={`${PREFIX}.SELF_AND_SPOUSE.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.SELF_AND_SPOUSE.caption`} />,
    topButton: <FormattedMessage id={`${PREFIX}.SELF_AND_SPOUSE.topButton`} />,
    bottomButton: (
      <FormattedMessage id={`${PREFIX}.SELF_AND_SPOUSE.bottomButton`} />
    ),
  },
  SPOUSE: {
    title: <FormattedMessage id={`${PREFIX}.SPOUSE.title`} />,
    caption: values => (
      <FormattedMessage id={`${PREFIX}.SPOUSE.caption`} values={values} />
    ),
    topButton: <FormattedMessage id={`${PREFIX}.SPOUSE.topButton`} />,
    bottomButton: <FormattedMessage id={`${PREFIX}.SPOUSE.bottomButton`} />,
  },
  DEPENDENT: {
    title: <FormattedMessage id={`${PREFIX}.DEPENDENT.title`} />,
    caption: values => (
      <FormattedMessage id={`${PREFIX}.DEPENDENT.caption`} values={values} />
    ),
    topButton: <FormattedMessage id={`${PREFIX}.DEPENDENT.topButton`} />,
    bottomButton: <FormattedMessage id={`${PREFIX}.DEPENDENT.bottomButton`} />,
  },
};

const newWindowIcon = {
  name: 'new-window',
  fill: '#fff',
  dynamicRules: { paths: { fill: '#fff' } },
  size: 11,
  style: { marginLeft: 8 },
};

const medicareUrl = 'https://www.ssa.gov/benefits/medicare/';

const MedicareMessage = ({
  status,
  viewport,
  onClose,
  onContinue,
  onRemove,
  onExit,
}) => (
  <Modal onRequestClose={onClose} style={styles[`modal${viewport}`]}>
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
        {/DEPENDENT|^SPOUSE/.test(status)
          ? content[status].caption({
              link: (
                <Text
                  href={medicareUrl}
                  onPress={Platform.select({
                    default: () => Linking.open(medicareUrl),
                  })}
                  accessibilityRole={Platform.select({ web: 'link' })}
                  target="_blank"
                  style={st.get(['BodyLink'], viewport)}
                >
                  Medicare
                </Text>
              ),
            })
          : content[status].caption}
      </Text>
      <View style={st.get(['FullWidth', 'ButtonMax', 'TopGutter'])}>
        <Button
          icon={/SELF|SELF_AND_SPOUSE/.test(status) && newWindowIcon}
          href={/SELF|SELF_AND_SPOUSE/.test(status) && medicareUrl}
          onClick={/SELF|SELF_AND_SPOUSE/.test(status) ? onExit : onRemove}
        >
          {content[status].topButton}
        </Button>
      </View>
      <View
        style={st.get(['FullWidth', 'ButtonMax', 'TopGutter', 'BottomGutter'])}
      >
        <Button type="outline" onClick={onContinue}>
          {content[status].bottomButton}
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
});

export default MedicareMessage;
