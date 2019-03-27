import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  SegmentedControl,
  styles as st,
  withDimensions,
  colors,
  Spinner,
} from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';
import { HealthCta } from '@catch/common';

import { DoctorCard, HealthInsuranceCard, ImagePreview } from '../components';
import { HealthInsurance } from '../containers';

const PREFIX = 'catch.health.HealthInsuranceView';
export const COPY = {
  guide: <FormattedMessage id={`${PREFIX}.guide`} />,
  healthPlaceholder: <FormattedMessage id={`${PREFIX}.healthPlaceholder`} />,
  doctorPlaceholder: <FormattedMessage id={`${PREFIX}.doctorPlaceholder`} />,
  addDoctor: <FormattedMessage id={`${PREFIX}.addDoctor`} />,
  addHealth: <FormattedMessage id={`${PREFIX}.addHealth`} />,
};

export class HealthInsuranceView extends React.PureComponent {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    viewport: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);

    this.state = { imagePreview: null };
  }

  handleEdit = () => {
    this.goTo('/plan/health/wallet/edit', {
      isEditing: true,
    });
  };

  setPreview = url => {
    this.setState({ imagePreview: url });
  };

  renderTopNav = () => {
    const { viewport } = this.props;
    if (Platform.OS !== 'web') {
      return null;
    }
    return (
      <View
        style={st.get(
          ['FullWidth', 'PageMax', 'Margins', 'XlTopGutter', 'Bilateral'],
          viewport,
        )}
      >
        <TouchableOpacity
          style={st.get(['Row', 'CenterColumn'])}
          onPress={() => this.goTo('/guide')}
        >
          <Icon
            name="left"
            fill={colors.ink}
            dynamicRules={{ paths: { fill: colors.ink } }}
            size={16}
          />

          {viewport !== 'PhoneOnly' && (
            <Text
              style={st.get(['FinePrint', 'Medium', 'SmLeftGutter'], viewport)}
            >
              {COPY['guide']}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { breakpoints, viewport } = this.props;
    const { imagePreview } = this.state;

    return (
      <HealthInsurance>
        {({
          id,
          carrier,
          planName,
          insuranceSource,
          phoneNumber,
          policyNumber,
          notes,
          frontImageUrl,
          backImageUrl,
          doctors,
          loading,
        }) => (
          <ScrollView contentContainerStyle={st.get(['CenterColumn'])}>
            {this.renderTopNav()}
            <View
              style={st.get(
                ['FullWidth', 'LgTopGutter', 'Margins', styles.base],
                viewport,
              )}
            >
              <SegmentedControl
                controls={[{ title: 'Health insurance' }, { title: 'Doctors' }]}
              >
                <View style={styles.segmentContainer}>
                  {loading ? (
                    <View style={st.get(['CenterColumn', 'XlTopGutter'])}>
                      <Spinner large />
                    </View>
                  ) : insuranceSource ? (
                    <View style={st.get('LgBottomGutter')}>
                      <HealthInsuranceCard
                        viewport={viewport}
                        carrier={carrier}
                        planName={planName}
                        insuranceSource={insuranceSource}
                        phoneNumber={phoneNumber}
                        policyNumber={policyNumber}
                        notes={notes}
                        onEdit={this.handleEdit}
                        frontImageUrl={frontImageUrl}
                        backImageUrl={backImageUrl}
                        toggleImage={url => this.setPreview(url)}
                      />
                    </View>
                  ) : (
                    <View style={st.get(['CenterColumn', 'LgTopGutter'])}>
                      <Icon name="health" size={66} />
                      <Text
                        style={st.get(
                          ['Body', 'CenterText', 'LgTopGutter'],
                          viewport,
                        )}
                      >
                        {COPY['healthPlaceholder']}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.goTo('/plan/health/wallet/intro')}
                        style={st.get([
                          'CenterLeftRow',
                          'TopGutter',
                          'BottomGutter',
                        ])}
                      >
                        <Icon
                          name="naked-plus"
                          size={11}
                          fill={colors.flare}
                          dynamicRules={{ paths: { fill: colors.flare } }}
                        />
                        <Text
                          style={st.get(['SmLeftGutter', 'BodyLink'], viewport)}
                        >
                          {COPY['addHealth']}
                        </Text>
                      </TouchableOpacity>

                      <HealthCta
                        onPress={() => this.goTo('/plan/health/intro')}
                        viewport={viewport}
                        center
                      />
                    </View>
                  )}
                </View>
                <View style={styles.segmentContainer}>
                  <View
                    style={st.get(
                      ['CenterColumn', 'LgTopGutter', 'Flex1'],
                      viewport,
                    )}
                  >
                    {doctors && doctors.length ? (
                      doctors.map(doctor => (
                        <View
                          key={doctor.id}
                          style={st.get(['FullWidth', 'BottomGutter'])}
                        >
                          <DoctorCard
                            {...doctor}
                            viewport={viewport}
                            onEdit={() =>
                              this.goTo('/plan/health/wallet/edit-doctor', {
                                doctorId: doctor.id,
                              })
                            }
                          />
                        </View>
                      ))
                    ) : (
                      <React.Fragment>
                        <Icon name="health" size={66} />
                        <Text
                          style={st.get(
                            ['Body', 'CenterText', 'LgTopGutter'],
                            viewport,
                          )}
                        >
                          {COPY['doctorPlaceholder']}
                        </Text>
                      </React.Fragment>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        this.goTo('/plan/health/wallet/add-doctors', {
                          onCompletedRoute: '/plan/health/overview',
                          onBackRoute: '/plan/health/overview',
                        })
                      }
                      style={st.get([
                        'CenterLeftRow',
                        'TopGutter',
                        'LgBottomGutter',
                      ])}
                    >
                      <Icon
                        name="naked-plus"
                        size={11}
                        fill={colors.flare}
                        dynamicRules={{ paths: { fill: colors.flare } }}
                      />
                      <Text
                        style={st.get(['SmLeftGutter', 'BodyLink'], viewport)}
                      >
                        {COPY['addDoctor']}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </SegmentedControl>
            </View>
            {!!imagePreview && (
              <ImagePreview
                file={imagePreview}
                breakpoints={breakpoints}
                viewport={viewport}
                onClose={() => this.setState({ imagePreview: null })}
              />
            )}
          </ScrollView>
        )}
      </HealthInsurance>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    maxWidth: 375,
  },
  segmentContainer: {
    paddingTop: 40,
  },
});

const enhance = compose(withDimensions);

const Component = enhance(HealthInsuranceView);
Component.displayName = 'HealthInsuranceView';

export default Component;
