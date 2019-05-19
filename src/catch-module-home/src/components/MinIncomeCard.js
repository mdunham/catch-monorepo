import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Paper, Icon, Text, colors } from '@catch/rio-ui-kit';
import { FullDate, preDateWord } from '@catch/utils';

const PREFIX = 'catch.module.home.MinIncomeCard';
export const COPY = {
  caption: values => (
    <FormattedMessage id={`${PREFIX}.caption`} values={values} />
  ),
  captionLong: values => (
    <FormattedMessage id={`${PREFIX}.captionLong`} values={values} />
  ),
};

const MinIncomeCard = ({ date }) => (
  <Paper row p={2} align="center" m={1}>
    <Icon
      name="chaching"
      dynamicRules={{ paths: { fill: colors.charcoal } }}
      fill={colors.charcoal}
      size={24}
      style={{ opacity: 0.5 }}
    />
    <Text ml={2} style={{ opacity: 0.5 }}>
      {COPY[preDateWord(date) ? 'captionLong' : 'caption']({
        date: (
          <Text weight="bold">
            <FullDate>{date}</FullDate>
          </Text>
        ),
      })}
    </Text>
  </Paper>
);

MinIncomeCard.propTypes = {
  date: PropTypes.string.isRequired,
};

export default MinIncomeCard;
