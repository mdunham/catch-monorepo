import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';

import {
  Icon,
  Modal,
  Button,
  styles,
  colors,
  Divider,
} from '@catch/rio-ui-kit';

const isLast = (index, length) => index === length - 1;

const Container = Platform.select({
  web: Modal,
  default: SafeAreaView,
});

const EditInfoLayout = ({
  children,
  actions,
  onClose,
  breakpoints,
  center,
  title,
  description,
}) => (
  <Container
    viewport={breakpoints.current}
    onRequestClose={onClose}
    style={Platform.select({
      web: undefined,
      default: styles.get('Flex1'),
    })}
    behavior={Platform.select({ ios: 'padding' })}
  >
    {breakpoints.current === 'PhoneOnly' &&
      Platform.select({
        web: (
          <View
            style={styles.get([
              'RowContainer',
              'TopGutter',
              'LeftGutter',
              'BottomGutter',
            ])}
          >
            <Icon
              name="right"
              onClick={() => onClose()}
              fill={colors.primary}
              stroke={colors.primary}
              dynamicRules={{ paths: { fill: colors.primary } }}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </View>
        ),
      })}
    <KeyboardAvoidingView
      style={styles.get(['Flex1', 'BottomSpace'], breakpoints.current)}
    >
      <ScrollView
        contentContainerStyle={styles.get(
          [
            'ModalMax',
            'Margins',
            'LgTopGutter',
            breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': actions && 'LgBottomGutter',
              PhoneOnly: 'BottomSpace',
            }),
          ],
          breakpoints.current,
        )}
      >
        {title && (
          <React.Fragment>
            <Text
              style={styles.get(['H4', 'BottomGutter'], breakpoints.current)}
            >
              {title}
            </Text>

            {description && description}

            <Divider color={colors.sage} style={styles.get('BottomGutter')} />
          </React.Fragment>
        )}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
    {Array.isArray(actions) && (
      <View
        style={styles.get(
          [
            'CenterRightRow',
            center && 'CenterRow',
            'TopGutter',
            'Margins',
            'BottomBar',
          ],
          breakpoints.current,
        )}
      >
        {actions.map(
          (a, i) =>
            !!a && (
              <View
                key={`action-${i}`}
                style={styles.get([
                  breakpoints.select({ PhoneOnly: 'Flex1' }),
                  isLast(i, actions.length) ? undefined : 'RightGutter',
                ])}
              >
                <Button
                  wide={breakpoints.select({ PhoneOnly: true })}
                  smallText={breakpoints.select({ PhoneOnly: true })}
                  onClick={a.onPress}
                  disabled={a.disabled}
                  type={
                    a.type ||
                    (actions.length > 1 && i === 0
                      ? 'light'
                      : a.danger
                        ? 'danger'
                        : 'primary')
                  }
                  viewport={breakpoints.current}
                >
                  {a.text}
                </Button>
              </View>
            ),
        )}
      </View>
    )}
  </Container>
);

EditInfoLayout.propTypes = {
  actions: PropTypes.array,
  children: PropTypes.node,
  breakpoints: PropTypes.object.isRequired,
};

export default EditInfoLayout;
