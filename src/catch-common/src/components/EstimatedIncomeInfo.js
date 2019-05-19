import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, SafeAreaView } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Text as Emphasis,
  withDimensions,
  styles,
  colors,
  Icon,
  Modal,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.me.EstimatedIncomeInfo';

export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  p1099: <FormattedMessage id={`${PREFIX}.p1099`} />,
  pW2: values => <FormattedMessage id={`${PREFIX}.pW2`} values={values} />,
  emphasisW2: <FormattedMessage id={`${PREFIX}.emphasisW2`} />,
  p2: <FormattedMessage id={`${PREFIX}.p2`} />,
  dismissButton: <FormattedMessage id={`${PREFIX}.dismissButton`} />,
  backTitle: <FormattedMessage id={`${PREFIX}.backTitle`} />,
};

export const EstimatedIncomeInfo = ({
  incomeType,
  onBack,
  onClose,
  overlay,
  breakpoints,
}) => (
  <Modal
    onRequestClose={onClose}
    viewport={breakpoints.current}
    transparent={
      overlay &&
      breakpoints.select({
        'TabletLandscapeUp|TabletPortraitUp': true,
      })
    }
    style={
      overlay
        ? breakpoints.select({
            PhoneOnly: { minWidth: '100%' },
            'TabletLandscapeUp|TabletPortraitUp': { height: 477 },
          })
        : undefined
    }
  >
    <View
      style={styles.get(
        ['Margins', 'LgTopGutter', 'LgBottomGutter', 'ModalMax'],
        breakpoints.current,
      )}
    >
      {overlay ? (
        breakpoints.select({
          'TabletLandscapeUp|TabletPortraitUp': (
            <TouchableOpacity
              onPress={onBack}
              style={styles.get(
                ['CenterLeftRow', 'Shrink', 'LgBottomGutter'],
                breakpoints.current,
              )}
            >
              <Icon
                name="left"
                size={16}
                fill={colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.get(['BodyLink'], breakpoints.current)}>
                {COPY['backTitle']}
              </Text>
            </TouchableOpacity>
          ),
        })
      ) : (
        <TouchableOpacity
          onPress={onBack}
          style={styles.get(
            ['CenterRightRow', 'Shrink', 'LgBottomGutter'],
            breakpoints.current,
          )}
        >
          <Icon name="close" size={24} fill={colors.ink} />
        </TouchableOpacity>
      )}
      <Text style={styles.get(['H4', 'BottomGutter'], breakpoints.current)}>
        {COPY['title']({ incomeType })}
      </Text>
      <Text style={styles.get(['Body', 'BottomGutter'], breakpoints.current)}>
        {incomeType === '1099'
          ? COPY['p1099']
          : COPY['pW2']({
              emphasis: (
                <Emphasis weight="medium">{COPY['emphasisW2']}</Emphasis>
              ),
            })}
      </Text>
      <Text style={styles.get(['Body', 'LgBottomGutter'], breakpoints.current)}>
        {COPY['p2']}
      </Text>
    </View>
    {breakpoints.select({
      PhoneOnly: (
        <View style={styles.get(['BottomBar', 'Margins'], breakpoints.current)}>
          <View style={styles.get(['TopGutter', 'FullWidth'])}>
            <Button onClick={onBack} type="outline" wide>
              {COPY['dismissButton']}
            </Button>
          </View>
        </View>
      ),
    })}
  </Modal>
);

EstimatedIncomeInfo.propTypes = {
  incomeType: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  breakpoints: PropTypes.object.isRequired,
  overlay: PropTypes.bool,
};

EstimatedIncomeInfo.defaultProps = {
  overlay: true,
};

const Component = withDimensions(EstimatedIncomeInfo);

Component.displayName = 'EstimatedIncomeInfo';

export default Component;
