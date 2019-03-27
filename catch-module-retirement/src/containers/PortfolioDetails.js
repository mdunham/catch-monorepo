import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Text,
  Modal,
  Button,
  H2,
  colors,
  withDimensions,
  styles,
  Icon,
  Divider,
} from '@catch/rio-ui-kit';

import { AssetList } from '../components';
import { portfolioDetails } from '../utils';

import GetPortfolio from './GetPortfolio';

const PREFIX = 'catch.module.retirement.PortfolioDetails';
export const COPY = {
  yourPortfolio: <FormattedMessage id={`${PREFIX}.yourPortfolio`} />,
  stocks: <FormattedMessage id={`${PREFIX}.stocks`} />,
  bonds: <FormattedMessage id={`${PREFIX}.bonds`} />,
  changePortfolio: <FormattedMessage id={`${PREFIX}.changePortfolio`} />,
};

const localStyles = StyleSheet.create({
  modal: {
    maxWidth: 1100,
  },
  assetList: {
    backgroundColor: colors.ghost,
  },
});

export const PortfolioDetails = ({
  closeModal,
  portfolioID,
  breakpoints,
  goTo,
}) => (
  <Modal
    viewport={breakpoints.current}
    onRequestClose={closeModal}
    style={localStyles.modal}
  >
    <GetPortfolio id={portfolioID}>
      {({ loading, name, contents }) =>
        loading ? null : (
          <ScrollView>
            <View
              // Necessary to make sure the ScrollView scrolls in the modal properly
              onStartShouldSetResponder={() => true}
              style={styles.get('FluidContainer', breakpoints.current)}
            >
              <View
                style={styles.get(
                  [
                    breakpoints.select({
                      'TabletLandscapeUp|TabletPortraitUp': 'Flex1',
                    }),
                    'Frame',
                  ],
                  breakpoints.current,
                )}
              >
                {breakpoints.select({
                  PhoneOnly: (
                    <Icon
                      name="close"
                      size={27}
                      fill={colors.primary}
                      dynamicRules={{ paths: { fill: colors.primary } }}
                      onClick={closeModal}
                    />
                  ),
                })}
                <View style={styles.get('CenterRow')}>
                  <Text my={2} size="small" color="gray3" weight="medium">
                    {COPY['yourPortfolio']}
                  </Text>
                  <H2>{name}</H2>
                  <Text mt={1}>
                    {portfolioDetails[name].stocks}% {COPY['stocks']}{' '}
                    <Text weight="bold" color="gray3">
                      •
                    </Text>{' '}
                    {portfolioDetails[name].bonds}% {COPY['bonds']}
                  </Text>
                  <Text py={3}>{portfolioDetails[name].description}</Text>
                  {breakpoints.select({
                    'TabletLandscapeUp|TabletPortraitUp': (
                      <View
                        style={styles.get(['LgBottomGutter', 'CenterLeftRow'])}
                      >
                        <Button
                          onClick={() => {
                            closeModal();
                            goTo('/plan/retirement/change-portfolio');
                          }}
                        >
                          {COPY['changePortfolio']}
                        </Button>
                      </View>
                    ),
                  })}
                </View>
              </View>
              <View
                style={styles.get(
                  breakpoints.select({
                    'TabletLandscapeUp|TabletPortraitUp': [
                      'Flex1',
                      'Frame',
                      localStyles.assetList,
                    ],
                    PhoneOnly: 'Frame',
                  }),
                  breakpoints.current,
                )}
              >
                {breakpoints.select({
                  PhoneOnly: <Divider mb={2} />,
                })}
                <AssetList items={contents} />
                {breakpoints.select({
                  PhoneOnly: <Divider mt={1} />,
                })}
              </View>
            </View>
            {breakpoints.select({
              PhoneOnly: (
                <View
                  style={styles.get(
                    ['Margins', 'BottomGutter', 'TopGutter'],
                    breakpoints.current,
                  )}
                >
                  <Button
                    wide
                    onClick={() => {
                      closeModal();
                      goTo('/plan/retirement/change-portfolio');
                    }}
                  >
                    {COPY['changePortfolio']}
                  </Button>
                </View>
              ),
            })}
          </ScrollView>
        )
      }
    </GetPortfolio>
  </Modal>
);

PortfolioDetails.propTypes = {
  closeModal: PropTypes.func.isRequired,
  portfolioID: PropTypes.string.isRequired,
  goTo: PropTypes.func.isRequired,
};

const Component = withDimensions(PortfolioDetails);

Component.displayName = 'PortfolioDetails';

export default Component;
