import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { size, padding } from '../../const';
import Box from '../Box';
import PageWrapper from '../PageWrapper';

/**
 * Simple layout with 100% width/height outer
 * and wrapper container
 */
const Page = ({ id, children, ...other }) => (
  <PageWrapper>
    <Box {...other}>{children}</Box>
  </PageWrapper>
);

Page.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
};

const styles = StyleSheet.create({
  outer: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    maxWidth: size.pageMaxWidth,
    width: '100%',
    margin: 'auto',
    height: '100%',
  },
});

export default Page;
