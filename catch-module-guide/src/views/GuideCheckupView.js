import React from 'react';
import { Platform, View, Animated, StyleSheet, Easing } from 'react-native';
import access from 'safe-access';
import { debounce } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';

import { Spinner, withDimensions } from '@catch/rio-ui-kit';

import {
  CheckupQuestions,
  GuideCheckupNav,
  AnswerCheckup,
  ChangeWorkType,
} from '../containers';
import { PlanCheckupLayout, TaxPausedWarning } from '../components';
import { goTo, Segment } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { ToggleGoal, EstimatedIncomeInfo } from '@catch/common';

export class GuideCheckupView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      showTaxWarning: false,
      showIncomeInfo: null,
    };
  }
  componentWillUnmount() {
    const { destroyWTForm, destroyQuestionForm } = this.props;
    destroyWTForm();
    destroyQuestionForm();
  }
  handleNavigation = () => {
    Segment.checkupCompleted();
    this.goTo('/guide', {}, 'RESET');
  };
  handleCompleted = debounce(data => {
    const { showTaxWarning } = this.state;
    if (!showTaxWarning) {
      this.handleNavigation();
    }
  }, 1500);
  handleTaxPaused = debounce(() => {
    this.setState({
      showTaxWarning: true,
    });
  }, 1500);
  handleIncomeInfo = info => {
    this.setState({
      showIncomeInfo: info,
    });
  };
  render() {
    const { viewport } = this.props;
    const { showTaxWarning, showIncomeInfo } = this.state;
    return showTaxWarning ? (
      <TaxPausedWarning viewport={viewport} onDismiss={this.handleNavigation} />
    ) : (
      <ErrorBoundary Component={ErrorMessage}>
        <ToggleGoal
          goalType="tax"
          toastEnabled={false}
          onCompleted={this.handleTaxPaused}
        >
          {({ toggleGoal }) => (
            <AnswerCheckup onCompleted={this.handleCompleted}>
              {({ answerCheckup, loading: answering }) => (
                <ChangeWorkType>
                  {({ loading: updating, updateWorkType }) => (
                    <CheckupQuestions>
                      {({
                        isLegacy,
                        questions,
                        surveyID,
                        workType,
                        loading,
                        taxStatus,
                        hasFinished,
                        estimatedW2Income,
                        estimated1099Income,
                      }) =>
                        loading ? null : (
                          <GuideCheckupNav
                            surveyID={surveyID}
                            answerCheckup={answerCheckup}
                            updateWorkType={updateWorkType}
                            estimatedW2Income={estimatedW2Income}
                            estimated1099Income={estimated1099Income}
                            showPreface={hasFinished || isLegacy}
                            onIncomeInfo={this.handleIncomeInfo}
                            onFlowEnd={() => {
                              if (
                                taxStatus === 'ACTIVE' &&
                                workType === 'WORK_TYPE_W2'
                              ) {
                                toggleGoal({
                                  variables: {
                                    input: {
                                      status: 'PAUSED',
                                    },
                                  },
                                });
                              }
                            }}
                            questions={questions}
                            workType={workType}
                            loading={loading}
                            // Pass the dimensions
                            {...this.props}
                          />
                        )
                      }
                    </CheckupQuestions>
                  )}
                </ChangeWorkType>
              )}
            </AnswerCheckup>
          )}
        </ToggleGoal>
        {!!showIncomeInfo && (
          <EstimatedIncomeInfo
            overlay={false}
            breakpoints={this.props.breakpoints}
            onClose={() => this.handleIncomeInfo(null)}
            onBack={() => this.handleIncomeInfo(null)}
            incomeType={showIncomeInfo}
          />
        )}
      </ErrorBoundary>
    );
  }
}

const withRedux = connect(
  null,
  {
    destroyWTForm: () => destroy('workTypeCheckup'),
    destroyQuestionForm: () => destroy('planCheckup'),
  },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(GuideCheckupView);
