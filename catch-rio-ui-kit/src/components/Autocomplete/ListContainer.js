import React from 'react';
import ReactDOM from 'react-dom';
import { View, Modal, Platform, StyleSheet } from 'react-native';
import { zIndex, colors } from '../../const';

class ListContainer extends React.PureComponent {
  render() {
    const { top, left, width, close, ...other } = this.props;
    return Platform.OS === 'web' ? (
      ReactDOM.createPortal(
        <View style={[styles.container, { top, left, width }]} {...other}>
          {this.props.children}
        </View>,
        document.body,
      )
    ) : (
      <View style={[styles.container, { top: 50, left: 0, width: '100%' }]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
    position: 'absolute',
    margin: 0,
    zIndex: zIndex.autocomplete,
  },
});

export default ListContainer;
