import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Platform, StyleSheet, Dimensions } from 'react-native';

import Box from '../Box';
import NakedInput from '../NakedInput';
import { List, ListItem, ListItemText } from '../List';
import Paper from '../Paper';
import { colors, zIndex } from '../../const';
import ListContainer from './ListContainer';

class Autocomplete extends React.Component {
  static propTypes = {
    /** Array of items that can be selected */
    items: PropTypes.array.isRequired,
    /** Executed with item when the value changes */
    onChange: PropTypes.func,
    /** Executed with item when a value is selected */
    onSelect: PropTypes.func,
    /** Executed when user is entering text */
    onInputValueChange: PropTypes.func,
    /** Pass some styles to the input form */
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  };
  static defaultProps = {
    onInputValueChange: () => {},
  };
  constructor(props) {
    super(props);
    const state = this.getState({
      isOpen: this.props.defaultIsOpen,
      inputValue: this.props.defaultInputValue,
      selectedItem: this.props.defaultSelectedItem,
    });
    if (state.selectedItem != null) {
      state.inputValue = this.itemToString(state.selectedItem);
    }
    this.state = state;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedItem !== this.state.selectedItem) {
      this.setState({
        isOpen: false,
        inputValue: this.state.selectedItem,
      });
    }
  }

  getState(stateToMerge) {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key];
      return state;
    }, {});
  }

  isControlledProp(key) {
    return this.props[key] !== undefined;
  }

  handleSelect = (item, otherStateToSet, cb) => {
    this.setState({
      selectedItem: item,
    });
    this.props.onSelect(item);
  };

  handleInputChange = e => {
    const value = e.target.value || e.nativeEvent.text;
    this.setState({
      inputValue: value,
      isOpen: value && value.length > 0 ? true : false,
    });
    this.props.onInputValueChange(value);
  };

  // Dimensions given by onLayout are relative to parent component so
  // not super useful for this case
  calcListSize = ({ nativeEvent }) => {
    if (this.input) {
      this.input.measureInWindow((x, y, width, height) => {
        this.setState(state => ({
          listLeft: x,
          listTop: y + height,
          listWidth: width,
        }));
      });
    }
  };

  render() {
    const {
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex,
      listTop,
      listLeft,
      listHeight,
      listWidth,
    } = this.state;
    const { items, style, placeholder } = this.props;
    return (
      <React.Fragment>
        <NakedInput
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus}
          value={inputValue}
          style={style}
          placeholder={placeholder}
          myRef={el => (this.input = el)}
          onLayout={this.calcListSize}
        />
        {isOpen && (
          <ListContainer
            top={listTop}
            left={listLeft}
            width={listWidth}
            close={() => this.setState({ isOpen: false })}
          >
            <Paper style={{ overflow: 'hidden' }}>
              <List maxHeight={400}>
                {items
                  .filter(
                    i =>
                      !inputValue ||
                      i.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map((item, index, arr) => (
                    <ListItem
                      onClick={() => this.handleSelect(item)}
                      key={item}
                      isHighlighted={highlightedIndex === index}
                      isLast={index === arr.length - 1}
                      divider={false}
                    >
                      <ListItemText
                        primary={item}
                        primaryProps={{
                          weight: selectedItem === item ? 'bold' : 'normal',
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </ListContainer>
        )}
      </React.Fragment>
    );
  }
}

export default Autocomplete;
