import React from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';

import { Button, Box } from '@catch/rio-ui-kit';

const WIN_WIDTH = Dimensions.get('window').width;
//const WIN_HEIGHT = Dimensions.get('window').height

class TriageView extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        <Box row>
          <Box m={1}>
            <Button onClick={() => navigation.navigate('/auth/sign-in')}>
              Sign In
            </Button>
          </Box>
          <Box m={1}>
            <Button onClick={() => navigation.navigate('/auth/sign-up/work')}>
              Sign Up
            </Button>
          </Box>
        </Box>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    //opacity: 0.7,
  },
  image: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    resizeMode: 'contain',
    width: WIN_WIDTH,
  },
});

export default TriageView;
