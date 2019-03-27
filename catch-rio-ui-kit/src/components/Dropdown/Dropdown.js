import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Picker, Platform } from 'react-native';
import Downshift from 'downshift';

import InputError from '../InputError';
import NakedInput from '../NakedInput';
import Paper from '../Paper';
import Box from '../Box';
import Icon from '../Icon';
import Label from '../Label';
import {
  colors,
  borderRadius,
  zIndex,
  fonts,
  fontColors,
  shadow,
} from '../../const';
import Env from '../../util/env';
import globStyles from '../../styles';

// TODO: Write tests
// * add error handling state
// * abstract away a lot of the concepts so they could be used in a button or input field

const itemToString = item => (item ? item.value : '');
const existy = field => field && typeof field === 'string' && field.length > 0;

class Dropdown extends Component {
  static propTypes = {
    /** Array of items that can be selected. In the form of: { value: string, label: string } */
    items: PropTypes.array.isRequired,
    /** Input object coming from redux-form */
    input: PropTypes.object.isRequired,
    /** Meta object coming from redux-form */
    meta: PropTypes.object.isRequired,
    /** Optional label to render above the input */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /** Will autocomplete too if true */
    autocomplete: PropTypes.bool,
  };

  static defaultProps = {
    autocomplete: false,
    viewport: 'PhoneOnly',
  };

  handleOnInputValueChange = () => {};

  componentDidCatch(err) {
    console.log('Dropdown', err);
  }

  render() {
    const {
      input: { onChange, ...input },
      meta,
      white,
      raised,
      color,
      items,
      label,
      extraLabel,
      qaName,
      autocomplete,
      placeholder,
      grouped,
      alert,
      style,
      viewport,
    } = this.props;
    const { touched, error } = meta;
    const hasError = touched && error && error.length > 0;

    let ddChildren = [];
    if (!input.value && placeholder) {
      ddChildren = ddChildren.concat([
        <Picker.Item key="p-1" label={placeholder} color={colors.gray3} />,
      ]);
    }
    ddChildren = ddChildren.concat(
      items.map((item, index) => (
        <Picker.Item
          key={item.value ? item.value : item}
          value={item.value ? item.value : item}
          label={item.label ? item.label : item.value ? item.value : item}
        />
      )),
    );

    /* This is a temporary solution since Downshift and react-native-web don't get along */
    return (
      <Box style={style} mb={grouped ? 0 : 24} qaName={qaName}>
        <Box row justify="space-between">
          {!!label && (
            <Box pb={1}>
              <Label>{label}</Label>
            </Box>
          )}
          {!!extraLabel && <Box pb={1}>{extraLabel}</Box>}
        </Box>
        <Box
          style={[
            styles.baseContainer,
            white && styles.white,
            raised && styles.raised,
            alert && styles.alert,
          ]}
        >
          <Picker
            selectedValue={input.value}
            style={globStyles.get(
              [
                !Env.isTest && 'Body',
                styles.base,
                white && styles.white,
                !input.value && styles.placeholder,
                !!color && Platform.select({ web: { color } }),
              ],
              viewport,
            )}
            itemStyle={styles.baseItem}
            onValueChange={(value, idx) => {
              onChange(value);
            }}
          >
            {ddChildren}
          </Picker>

          {Platform.OS === 'web' && (
            <Icon
              style={styles.iconStyle}
              name="down"
              size={14}
              fill={color || colors.ink}
            />
          )}
        </Box>
      </Box>
    );
  }
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: borderRadius.regular,
    backgroundColor: colors['snow'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors['ink+3'],
  },
  baseItem: {
    height: 36,
    textAlign: 'left',
    color: fontColors.primary,
    fontFamily:
      typeof fonts.primary === 'string'
        ? fonts.primary
        : fonts.primary['normal'],
    fontSize: fonts.body,
    padding: 0,
  },
  base: {
    backgroundColor: colors['snow'],
    borderWidth: 0,
    padding: 10,
    margin: 0,
    width: '100%',
    ...Platform.select({
      // disabling to avoid error when testing
      web: Env.isTest
        ? {}
        : {
            appearance: 'none',
          },
    }),
  },
  placeholder: {
    ...Platform.select({
      web: {
        // Styles the placeholder, the main color
        // is black by default.
        color: colors.gray3,
      },
    }),
  },
  white: {
    backgroundColor: colors.white,
    borderColor: colors.gray5,
  },
  raised: {
    ...shadow.card,
  },
  error: {
    borderColor: colors.error,
  },
  alert: {
    borderColor: colors.fire,
  },
  iconStyle: {
    position: 'absolute',
    top: '50%',
    right: 16,
    ...Platform.select({
      web: Env.isTest
        ? {}
        : {
            transform: [{ translateY: '-50%' }],
            pointerEvents: 'none',
          },
    }),
  },
});

export default Dropdown;
