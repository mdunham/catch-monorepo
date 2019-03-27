import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import img from '../assets/add.png';
import { goTo } from '@catch/utils';

class AddButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handlePress = () => {
    this.goTo('/link-bank');
  };
  render() {
    return (
      <TouchableOpacity style={styles.base} onPress={this.handlePress}>
        <Image source={img} style={styles.icon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
  },
  icon: {
    height: 20,
    width: 20,
  },
});

export default AddButton;
