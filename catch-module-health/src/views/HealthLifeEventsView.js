import React from 'react';
import { Text } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { withDimensions, styles as st } from '@catch/rio-ui-kit';
import { goTo, Segment } from '@catch/utils';

import { Page, StateSupportMessage } from '../components';
import { LifeEventsForm } from '../forms';

const PREFIX = 'catch.health.HealthLifeEventsView';
export const COPY = {
  'openEnrollment.title': (
    <FormattedMessage id={`${PREFIX}.openEnrollment.title`} />
  ),
  'openEnrollment.p1': <FormattedMessage id={`${PREFIX}.openEnrollment.p1`} />,
  'openEnrollment.p2': values => (
    <FormattedMessage id={`${PREFIX}.openEnrollment.p2`} values={values} />
  ),
  'openEnrollment.link': (
    <FormattedMessage id={`${PREFIX}.openEnrollment.link`} />
  ),
  'openEnrollment.button': (
    <FormattedMessage id={`${PREFIX}.openEnrollment.button`} />
  ),
};

const lifeEvents = [
  'Lost health coverage',
  'Change in household size',
  'Change in primary residence',
  'Change in eligibility',
  'Other qualifying life event',
];

export class HealthLifeEventsView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      showOpenEnrollment: false,
    };
  }
  handleNext = values => {
    // The selection does not matter
    this.goTo('/plan/health/dependents');
    Segment.healthQLEChecked(lifeEvents[values.lifeEvent]);
  };
  handleNotApplicable = () => {
    this.setState({
      showOpenEnrollment: true,
    });
    Segment.healthQLEChecked();
  };
  handleExit = () => {
    this.goTo('/');
  };
  render() {
    const { viewport } = this.props;
    const { showOpenEnrollment } = this.state;
    return showOpenEnrollment ? (
      <Page
        viewport={viewport}
        renderFooter={viewport === 'PhoneOnly'}
        actions={[
          { onClick: this.handleExit, children: COPY['openEnrollment.button'] },
        ]}
        centerTitle
        centerBody
        topSpace
      >
        <StateSupportMessage
          viewport={viewport}
          onNext={this.handleExit}
          title={COPY['openEnrollment.title']}
          buttonText={COPY['openEnrollment.button']}
          paragraphs={[
            COPY['openEnrollment.p1'],
            COPY['openEnrollment.p2']({
              link: (
                <Text
                  style={st.get('BodyLink', viewport)}
                  href="https://www.healthcare.gov/screener/"
                  target="_blank"
                  accessibilityRole="link"
                >
                  {COPY['openEnrollment.link']}
                </Text>
              ),
            }),
          ]}
          icon={{
            name: 'leaves-highlight',
            size: 132,
          }}
        />
      </Page>
    ) : (
      <Page centerBody viewport={viewport} renderFooter={false} topSpace>
        <LifeEventsForm
          onSubmit={this.handleNext}
          onNone={this.handleNotApplicable}
          viewport={viewport}
        />
      </Page>
    );
  }
}

export default withDimensions(HealthLifeEventsView);
