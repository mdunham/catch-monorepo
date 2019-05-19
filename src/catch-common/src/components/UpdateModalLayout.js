import React from 'react';
import { node, string, func, oneOfType, object } from 'prop-types';

import { Button, Box, Text, H3 } from '@catch/rio-ui-kit';

const UpdateModalLayout = ({
  children,
  title,
  handleBack,
  handleNext,
  nextButtonText,
  backButtonText,
}) => {
  return (
    <Box>
      <H3>{title}</H3>
      <Box mt={3} mb={4}>
        {children}
      </Box>
      <Box row justify="flex-end">
        {!!handleBack && (
          <Box mr={2}>
            <Button onClick={handleBack} color="subtle">
              {backButtonText}
            </Button>
          </Box>
        )}
        <Button onClick={handleNext}>{nextButtonText}</Button>
      </Box>
    </Box>
  );
};

UpdateModalLayout.propTypes = {
  children: node.isRequired,
  title: oneOfType([string, object]).isRequired,
  handleBack: func,
  handleNext: func.isRequired,
  backButtonText: oneOfType([string, object]),
  nextButtonText: oneOfType([string, object]).isRequired,
};

export default UpdateModalLayout;
