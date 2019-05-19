import React from 'react';
import PropTypes from 'prop-types';

import ModalBox from './ModalBox';

const ActionSheet = ({
  onRequestClose,
  children,
  height,
  cardStyle,
  display,
}) => (
  <ModalBox
    isOpen={display}
    onClosed={onRequestClose}
    position="bottom"
    style={{ height }}
  >
    {children}
  </ModalBox>
);

ActionSheet.propTypes = {
  onRequestClose: PropTypes.func,
  children: PropTypes.node,
  height: PropTypes.number,
  display: PropTypes.bool,
};

export default ActionSheet;
