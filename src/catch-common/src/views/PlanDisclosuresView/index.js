import React from 'react';
import { View, Platform } from 'react-native';

import {
  Box,
  Text,
  SplitLayout,
  Checkbox,
  Link,
  colors,
  Label,
  withDimensions,
  styles as globalStyles,
} from '@catch/rio-ui-kit';
import { Markdown } from '@catch/disclosures';
import {
  goTo,
  getRouteState,
  getParentRoute,
  navigationPropTypes,
  createLogger,
} from '@catch/utils';
import { UpdateUser } from '../../containers';

import { FlowLayout, FolioFooter } from '../../components';
import { COPY } from './COPY';
import AgreementHeaderView from '../AgreementHeaderView';

const Log = createLogger('PlanDisclosuresView');

const styles = {
  base: {
    backgroundColor: colors.white,
  },
};

class PlanDisclosuresView extends React.PureComponent {
  static propTypes = {
    ...navigationPropTypes,
  };

  constructor() {
    super();
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.getParentRoute = getParentRoute.bind(this);
    this.state = {
      agreeCom: false,
      agreeCert: false,
      isChecking: false,
      disclosure: '',
      error: null,
    };
  }

  componentWillMount() {
    const disclosurePath = `https://s.catch.co/legal/bbvac-opening-summary.md`;
    try {
      fetch(disclosurePath)
        .then(res => res.text())
        .then(text =>
          this.setState({
            disclosure: text,
          }),
        );
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  toggleCom = ({ target }) => {
    this.setState({
      agreeCom: target.checked,
    });
  };

  toggleCert = ({ target }) => {
    this.setState({
      agreeCert: target.checked,
    });
  };

  handleBack = _ => {
    const { prevPath } = this.getRouteState();
    this.goTo(prevPath);
  };

  handleNext = async ({ updateUser }) => {
    const { agreeCom, agreeCert } = this.state;

    const canClickNext = agreeCom && agreeCert;

    const rootPath = this.getParentRoute();
    const isRetirement = rootPath === '/plan/retirement';

    if (canClickNext) {
      try {
        this.setState({
          isChecking: true,
        });

        await updateUser({
          variables: { input: { acknowledgedAccountDisclosures: true } },
        });

        this.goTo([
          rootPath,
          isRetirement ? '/investment-agreement' : '/confirm',
        ]);
      } catch (e) {
        // TODO: better handle error messaging for
        // plan flows. Do we pop a toast, where do we show our error
        // message if the api fails?
        Log.error(e);
        this.setState({
          isChecking: false,
        });
      }
    }
  };
  render() {
    const { agreeCom, agreeCert, isChecking, disclosure, error } = this.state;
    const { viewport } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    const canClickNext = agreeCom && agreeCert;

    const rootPath = this.getParentRoute();
    const isRetirement = rootPath === '/plan/retirement';

    return (
      <Box style={styles.base} flex={1}>
        <UpdateUser>
          {({ updateUser }) => (
            <FlowLayout
              onBack={this.handleBack}
              onNext={() => this.handleNext({ updateUser })}
              canClickNext={canClickNext}
              viewTitle={COPY['flowTitle']}
              isLoading={isChecking}
              footer={isRetirement && <FolioFooter />}
            >
              <AgreementHeaderView
                viewport={viewport}
                totalAgreements={isRetirement ? 2 : 1}
              />
              <View
                style={globalStyles.get(['Margins', 'PageWrapper'], viewport)}
              >
                <SplitLayout>
                  <Markdown height={1870} source={disclosure} />

                  <Box>
                    <Box mb={3} mt={2}>
                      <Label mb={1}>Required agreements:</Label>
                      <Checkbox
                        name="agreeCom"
                        qaName="agreeCom"
                        checked={agreeCom}
                        onChange={this.toggleCom}
                      >
                        <Text size="small">
                          {COPY['checkBoxLabel1']}{' '}
                          <Link
                            newTab
                            componentId="plan-flow"
                            to="/disclosures/bbvac-electronic"
                          >
                            {' '}
                            {COPY['checkBoxLink1']}
                          </Link>
                        </Text>
                      </Checkbox>
                    </Box>
                    <Box mb={2}>
                      <Checkbox
                        name="agreeCert"
                        qaName="agreeCert"
                        checked={agreeCert}
                        onChange={this.toggleCert}
                      >
                        <Text size="small">
                          {COPY['checkBoxLabel2']}{' '}
                          <Link
                            newTab
                            componentId="plan-flow"
                            to="/disclosures"
                          >
                            {' '}
                            {COPY['checkBoxLink2']}
                          </Link>
                        </Text>
                      </Checkbox>
                    </Box>
                  </Box>
                </SplitLayout>
              </View>
            </FlowLayout>
          )}
        </UpdateUser>
      </Box>
    );
  }
}

export { COPY };

export default withDimensions(PlanDisclosuresView);
