import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Icon from '../Icon';
import ClickOutside from '../ClickOutside';
import InputError from '../InputError';
import NakedInput from '../NakedInput';
import Box, { Flex } from '../Box';
import Paper from '../Paper';
import Label from '../Label';
import Text from '../Text';
import { colors, zIndex, animations, fontColors } from '../../const';

import Month from './Month.js';

// TODO:
// * turn this into a render prop component that be restyled
// * use actual SVG's for left/right instead of hacked together ones

const months = [
  ['Jan', 'Feb', 'Mar'],
  ['Apr', 'May', 'Jun'],
  ['Jul', 'Aug', 'Sep'],
  ['Oct', 'Nov', 'Dec'],
];

const monthToNum = month => {
  const map = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };
  const mo = map[month.toLowerCase()];
  if (!mo) throw new Error('Couldnt find proper month');
  return mo;
};

const getYears = numYears => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  for (let i = 0; i < numYears; i++) {
    years.push(currentYear + i + 1);
  }
  return years;
};

/**
 * MonthPicker is a utility Input for users selecting a month/year
 */
class MonthPicker extends Component {
  static propTypes = {
    /** Redux form input object */
    input: PropTypes.object.isRequired,
    /** Redux form meta object */
    meta: PropTypes.object.isRequired,
    /** The content to be rendered */
    children: PropTypes.node,
    /** 2-d Array of month names to be used in selection */
    months: PropTypes.array,
    /** Number of years to offer in the selector */
    numYears: PropTypes.number,
    /** Callback that converts the month name to the number equivalent of the year */
    monthToNum: PropTypes.func,
    /** Optional placeholder to use on the input field */
    placeholder: PropTypes.string,
    /** Optional label to use above the input field */
    label: PropTypes.string,
    /** Name of the input field */
    name: PropTypes.string,
  };
  static defaultProps = {
    months: months,
    numYears: 20,
    monthToNum,
  };

  constructor(props) {
    super(props);
    const years = getYears(props.numYears);

    this.state = {
      isOpen: false,
      years,
      months: props.months,
      month: props.months[0][0],
      yearIdx: 0,
    };
  }

  close = () => this.setState({ isOpen: false });
  open = () => {
    if (!this.state.isOpen) {
      this.setState({ isOpen: true });
    }
  };
  selectMonth = month => {
    this.setState({ month }, () => this.handleChange());
  };
  selectYear = yearIdx => this.setState({ yearIdx });
  prevYear = () => {
    if (this.state.yearIdx !== 0) {
      this.setState({ yearIdx: this.state.yearIdx - 1 });
    }
  };
  nextYear = () => {
    if (this.state.yearIdx !== this.state.years.length - 1) {
      this.setState({ yearIdx: this.state.yearIdx + 1 });
    }
  };

  // convert month/year to proper format
  // use redux forms on change
  // close the month selection window
  handleChange = e => {
    const {
      monthToNum,
      input: { onChange },
    } = this.props;
    const { years, yearIdx, month } = this.state;
    onChange(`${monthToNum(month)}/1/${years[yearIdx]}`);
    this.close();
    this.input.focus();
  };

  render() {
    const {
      input: { value, onFocus, onBlur },
      meta: { touched, error },
      children,
      placeholder,
      name,
      label,
      ...rest
    } = this.props;

    const { years, yearIdx } = this.state;

    const isPrevDisabled = yearIdx === 0;
    const isNextDisabled = yearIdx === years.length - 1;

    return (
      <Flex mb={error ? 0 : 16}>
        {label && (
          <Box pb={1}>
            <Label>{label}</Label>
          </Box>
        )}

        <Box row>
          <NakedInput
            placeholder={placeholder}
            value={value}
            onClick={this.open}
            onFocus={onFocus}
            name={name}
            myRef={input => (this.input = input)}
          />
          {touched &&
            !error && (
              <Icon name="check" fill="#333" style={styles.checkIcon} />
            )}
        </Box>

        {this.state.isOpen && (
          <ClickOutside onClickOutside={this.close}>
            <Paper p={3} style={styles.items} mt={1}>
              <Flex row mb={2}>
                <Icon
                  name="left"
                  stroke={isPrevDisabled ? colors.gray5 : fontColors.primary}
                  onClick={this.prevYear}
                />
                <Box ml="auto" mr="auto">
                  <Text style={styles.year} weight="medium">
                    {years[yearIdx]}
                  </Text>
                </Box>
                <Icon
                  name="right"
                  stroke={isNextDisabled ? colors.gray5 : fontColors.primary}
                  onClick={this.nextYear}
                />
              </Flex>

              {this.props.months.map((monthRow, i) => {
                return (
                  <Flex row justify="space-between" key={i}>
                    {monthRow.map(month => {
                      return (
                        <Box mb="3px" mx={1} key={month}>
                          <Month
                            isActive={month === this.state.month}
                            onClick={this.selectMonth.bind(this, month)}
                          >
                            {month}
                          </Month>
                        </Box>
                      );
                    })}
                  </Flex>
                );
              })}
            </Paper>
          </ClickOutside>
        )}
        <Box row py={1}>
          {touched && error && <InputError>{error}</InputError>}
        </Box>
      </Flex>
    );
  }
}

const styles = StyleSheet.create({
  items: {
    maxHeight: 400,
    // overflowY: 'auto', @FIXME
    position: 'absolute',
    // display: 'block',
    backgroundColor: colors.white,
    zIndex: zIndex.monthPicker,
    ...animations.inAndUp,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 14,
    // animationDuration: '.3s',
    // animationName: [animations.fadeInSlowRight],
    // animationTimingFunction: 'ease-in-out',
  },
  year: {
    // userSelect: 'none',
  },
});

export default MonthPicker;
