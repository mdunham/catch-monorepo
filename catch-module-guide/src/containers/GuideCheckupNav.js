import React from 'react';
import { Platform, View, Animated, StyleSheet, Easing } from 'react-native';
import access from 'safe-access';

import {
  Transitioner,
  withDimensions,
  colors,
  Spinner,
} from '@catch/rio-ui-kit';
import { goBack, createLogger } from '@catch/utils';

import * as Forms from '../forms';
import { BackButton, PlanCheckupLayout } from '../components';

const topBarHeight = {
  PhoneOnly: 54,
  TabletPortraitUp: 64,
  TabletLandscapeUp: 64,
};

const noop = () => {};

const LAST_SCENE = [
  {
    key: 'LoadingScreen',
  },
];

const Log = createLogger('checkup-nav');

// This function maps the questions from the api to relevant routes
export function deriveQuestionsFromProps({ showPreface, workType, questions }) {
  // Extra steps we add to the flow
  const preface = showPreface
    ? [
        {
          id: 'CheckupWorkTypeForm',
        },
        {
          id: 'CheckupIncomeForm',
          dependsOnQuestionKey: 'CheckupWorkTypeForm',
          // If the user selects any workType different from the current
          // we ask them to verify their estimatedIncome too
          criteria: [
            'WORK_TYPE_W2',
            'WORK_TYPE_1099',
            'WORK_TYPE_DIVERSIFIED',
          ].filter(wt => wt !== workType),
        },
      ]
    : [];
  // Filter out if the question is irrelevant to this user
  return preface
    .concat(questions)
    .filter(q => !q.workTypeVisibleTo || q.workTypeVisibleTo.includes(workType))
    .map(q => ({
      key: q.id,
      type: q.type,
      question: q.text,
      criteria: q.criteria,
      answers: q.possibleAnswers,
      dependsOnQuestionKey: q.dependsOnQuestionKey,
    }));
}

class GuideCheckupNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goBack = goBack.bind(this);

    const questions = deriveQuestionsFromProps(this.props);

    this.state = {
      index: 0,
      routes: [questions[0]],
      questions,
      isTransitioning: false,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { routes, index } = this.state;
    if (prevProps.questions !== this.props.questions) {
      const currentRoute = routes[index];
      // We don't update the questions if the loading screen is active
      if (currentRoute.key !== 'LoadingScreen') {
        const questions = deriveQuestionsFromProps(this.props);
        this.setState({
          routes: this.state.routes.map((route, i) => questions[i]),
          questions,
        });
      }
    }
  }
  renderScenes = (transitionProps, prevTransitionProps) => {
    const { size, viewport, onBack, loading } = this.props;
    const { index, questions, routes } = this.state;
    // Unfortunately we cannot predict how many questions
    // a user will be asked so we show progress out of the total list
    // anyways
    const scenes = transitionProps.scenes.map(scene =>
      this.renderScene(transitionProps, scene),
    );
    return (
      <PlanCheckupLayout
        progress={(index + 1) / questions.length}
        viewport={viewport}
        loading={routes[index].key === 'LoadingScreen'}
        renderBackButton={index > 0 || Platform.OS !== 'web'}
        onBack={
          // In native we need to navigate back when it's the first screen
          this.state.isTransitioning
            ? noop
            : index === 0
              ? this.goBack
              : this.back
        }
      >
        {scenes}
      </PlanCheckupLayout>
    );
  };
  renderScene = (transitionProps, scene) => {
    const style = this.interpolateStyle(transitionProps, scene);
    const { key, type, question, answers, fieldName } = scene.route;
    const {
      size,
      loading,
      viewport,
      breakpoints,
      onIncomeInfo,
      updateWorkType,
      estimatedW2Income,
      estimated1099Income,
    } = this.props;

    if (Forms[key]) {
      const Form = Forms[key];
      return (
        <Animated.View
          key={key}
          style={[style, styles.scene, { width: size.window.width }]}
        >
          <Form
            initialValues={{ estimatedW2Income, estimated1099Income }}
            onNext={this.next}
            viewport={viewport}
            breakpoints={breakpoints}
            isActive={scene.isActive}
            onIncomeInfo={onIncomeInfo}
            updateWorkType={updateWorkType}
            ref={el => (this.prefaceForm = el)}
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={key}
        style={[style, styles.scene, { width: size.window.width }]}
      >
        <Forms.PlanCheckupForm
          isLastScene={key === 'LoadingScreen'}
          onSubmit={this.handleSubmit}
          ref={el => (this.form = el)}
          breakpoints={breakpoints}
          isActive={scene.isActive}
          name={`Question:${key}`}
          viewport={viewport}
          questionType={type}
          question={question}
          answers={answers}
          onNext={this.next}
        />
      </Animated.View>
    );
  };
  // Uses the Animated API to map values
  interpolateStyle = (props, scene) => {
    const { position, layout } = props;
    const { index } = scene;

    // We map opacity to route index, 0.99 is a performance related trick
    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.99, index, index + 0.55, index + 1],
      outputRange: [0, 0.3, 1, 0.3, 0],
    });

    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const outputRange = [width, 0, -width];

    const translateY = 0;
    const translateX = position.interpolate({
      inputRange,
      outputRange,
    });
    return {
      opacity,
      transform: [{ translateY }, { translateX }],
      overflow: Platform.select({
        web: 'auto',
      }),
    };
  };
  // We can customize curves here too...
  configureTransition = (transitionProps, prevTransitionProps) => {
    const { size } = this.props;
    let duration;
    if (size.window.width < 1200) {
      duration = 400;
    } else if (size.window.width < 1400) {
      duration = 500;
    } else {
      duration = 600;
    }
    return {
      duration,
      // delay: 200,
    };
  };
  onTransitionStart = () => {};
  onTransitionEnd = data => {
    this.setState({
      isTransitioning: false,
    });
  };
  next = () => {
    const { index, routes, questions } = this.state;
    // The current question visible in the flow
    const currentQuestion = routes[index];
    // the next index is simply the next index after we add a new route to the stack
    const nextIndex = index + 1;
    // The nest possible index we look for it the next available question in order
    // We look them up in order
    let posIdx = questions.indexOf(currentQuestion) + 1;
    if (!questions[posIdx]) {
      // We have reached the end!
      this.props.onFlowEnd();
      // Last scene should be a smooth loading screen
      return this.setState({
        index: nextIndex,
        routes: routes.concat(LAST_SCENE),
        isTransitioning: true,
      });
    }
    let nextQuestion;
    // While we haven't found the next question we keep looking
    while (!nextQuestion) {
      // If the next question depends on any question we examine the provided
      // criteria
      if (
        questions[posIdx].dependsOnQuestionKey &&
        questions[posIdx].criteria
      ) {
        // If the criteria is met we assign it else the loop will go
        // to the next question

        // The prefaceForm is a specially handled case
        if (access(this, 'prefaceForm.values.workType')) {
          questions[posIdx].criteria.some(crit => {
            if (crit === this.prefaceForm.values.workType[0]) {
              nextQuestion = questions[posIdx];
            }
          });
        }
        if (this.form) {
          const fieldName = `Question:${
            questions[posIdx].dependsOnQuestionKey
          }`;
          if (
            this.form.values[fieldName][0] === questions[posIdx].criteria[0]
          ) {
            nextQuestion = questions[posIdx];
          }
        }
        if (!nextQuestion) {
          Log.debug(`Skipping question ${questions[posIdx].key}`);
        }
      } else {
        nextQuestion = questions[posIdx];
      }
      // Increment to the next position
      posIdx++;
    }
    // We create a new array and add the next route
    const nextRoutes = routes.concat([nextQuestion]);

    this.setState({
      index: nextIndex,
      routes: nextRoutes,
      isTransitioning: true,
    });
  };
  back = () => {
    const { index, routes } = this.state;

    const nextIndex = index - 1;
    const route = routes[nextIndex];
    // We remove the route from the stack just in case the user
    // makes a different choice
    const nextRoutes = routes.slice(0, -1);
    this.setState({
      index: nextIndex,
      routes: nextRoutes,
      isTransitioning: true,
    });
  };
  // Called by this.next() when it is the last index
  handleSubmit = formValues => {
    const { answerCheckup, surveyID } = this.props;
    const values = Object.keys(formValues).map(key => ({
      questionID: key.split(':')[1],
      answerIDs: this.form.values[key],
    }));
    answerCheckup({
      variables: {
        answers: {
          surveyID,
          questionAnswers: values,
        },
      },
    });
  };
  render() {
    return (
      <Transitioner
        configureTransition={this.configureTransition}
        onTransitionStart={this.onTransitionStart}
        onTransitionEnd={this.onTransitionEnd}
        navigation={{ state: this.state }}
        render={this.renderScenes}
      />
    );
  }
}

const styles = StyleSheet.create({
  scenesContainer: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    flexBasis: 'auto',
  },
  scene: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
});

export default GuideCheckupNav;
