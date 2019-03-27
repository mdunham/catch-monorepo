import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  Box,
  Hoverable,
  fonts,
  fontColors,
  colors,
  borderRadius,
} from '@catch/rio-ui-kit';
import { Api } from '../../store';

/**
 * CommonBank is a bank that users will commonly want to be syncing their
 * accounts with.  We provide a more 'custom' visual experience when syncing
 * with these banks.
 */
class CommonBank extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    logoSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    altText: PropTypes.string,
  };
  state = {
    bank: null,
  };
  componentDidMount() {
    const { id } = this.props;
    if (!id) return;
    Api.getBank({ id })
      .then(bank => {
        this.setState({ bank });
      })
      .catch(error => {
        this.setState({ error });
      });
  }
  render() {
    const { altText, logoSrc, onClick, ...rest } = this.props;
    return (
      <Hoverable>
        {isHovered => (
          <TouchableOpacity
            accessible={true}
            onPress={() => onClick(this.state.bank)}
          >
            <Box
              align="center"
              justify="center"
              style={[
                styles.base,
                isHovered && { backgroundColor: colors.gray6 },
              ]}
            >
              <Image
                resizeMode="contain"
                alt={altText}
                style={styles.image}
                source={Platform.select({
                  web: { uri: logoSrc },
                  default: logoSrc,
                })}
              />
            </Box>
          </TouchableOpacity>
        )}
      </Hoverable>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    padding: 0,
    borderRadius: borderRadius.regular,
    width: 120,
    height: 120,
  },
  image: {
    width: 100,
    height: 40,
  },
});

export default CommonBank;
