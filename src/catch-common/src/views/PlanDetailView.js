import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform } from 'react-native';

import {
  Box,
  Text,
  Spinner,
  Divider,
  Button,
  Paper,
  Link,
  borderRadius,
  colors,
  styles,
  animations,
  PageLayout,
  SplitLayout,
  withDimensions,
} from '@catch/rio-ui-kit';
import { Error } from '@catch/errors';
import { formatCurrency, Percentage } from '@catch/utils';

import { ToggleGoal } from '../containers';
import { PlanDetailCard, BackButton, PlanLayout } from '../components';
import PlanActivityView from './PlanActivityView';

export class PlanDetailView extends React.PureComponent {
  static propTypes = {
    goalType: PropTypes.string.isRequired,
    goTo: PropTypes.func.isRequired,
    goalStatus: PropTypes.string.isRequired,
    goalName: PropTypes.string.isRequired,
  };
  state = {
    showDetails: false,
  };
  handleToggle = () => {
    this.setState(({ showDetails }) => ({ showDetails: !showDetails }));
  };
  render() {
    const {
      goalType,
      goTo,
      goalStatus,
      goalName,
      viewport,
      breakpoints,
    } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    const isWeb = Platform.OS === 'web';
    return (
      <ScrollView contentContainerStyle={styles.get(['CenterColumn'])}>
        {!isMobile && (
          <View
            style={styles.get([
              'FullWidth',
              'PageMax',
              'White',
              { zIndex: 100 },
            ])}
          >
            <BackButton title="Your plan" onClick={() => goTo('/plan')} />
          </View>
        )}
        <PlanLayout
          style={styles.get(['PageMax', 'PageWrapper'], viewport)}
          breakpoints={breakpoints}
        >
          <PlanLayout.Column
            style={breakpoints.select({ PhoneOnly: { marginTop: 0 } })}
            breakpoints={breakpoints}
          >
            <PlanDetailCard
              {...this.props}
              onToggleDetails={this.handleToggle}
              isOpen={this.state.showDetails}
            />
            <ToggleGoal
              goalType={goalType}
              currentStatus={goalStatus}
              goalName={goalName}
            >
              {({ toggleGoal }) => (
                <View
                  style={styles.get(
                    [
                      'FullWidth',
                      'CenterColumn',
                      breakpoints.select({ PhoneOnly: 'White' }),
                    ],
                    viewport,
                  )}
                >
                  <View style={styles.get('XlBottomGutter')}>
                    <Button
                      type="outline"
                      light={goalStatus === 'ACTIVE'}
                      onClick={() =>
                        toggleGoal({
                          variables: {
                            input: {
                              status:
                                goalStatus === 'PAUSED' ? 'ACTIVE' : 'PAUSED',
                            },
                          },
                        })
                      }
                    >
                      {goalStatus === 'PAUSED'
                        ? `Resume ${goalName} withholding`
                        : `Pause ${goalName}`}
                    </Button>
                  </View>
                </View>
              )}
            </ToggleGoal>
          </PlanLayout.Column>
          <PlanLayout.Column breakpoints={breakpoints}>
            <PlanActivityView
              goalType={goalType}
              isMobile={isMobile}
              breakpoints={breakpoints}
            />
          </PlanLayout.Column>
        </PlanLayout>
      </ScrollView>
    );
  }
}

const Component = withDimensions(PlanDetailView);

Component.displayName = 'PlanDetailView';

export default Component;
