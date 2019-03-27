import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, styles as st, withDimensions, colors } from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';

const PREFIX = 'catch.PlanLineupView';
export const COPY = {
  healthTitle: <FormattedMessage id={`${PREFIX}.healthTitle`} />,
  healthDate: <FormattedMessage id={`${PREFIX}.healthDate`} />,
  healthDescription: <FormattedMessage id={`${PREFIX}.healthDescription`} />,
  lifeTitle: <FormattedMessage id={`${PREFIX}.lifeTitle`} />,
  lifeDate: <FormattedMessage id={`${PREFIX}.lifeDate`} />,
  lifeDescription: <FormattedMessage id={`${PREFIX}.lifeDescription`} />,
  studentTitle: <FormattedMessage id={`${PREFIX}.studentTitle`} />,
  studentDate: <FormattedMessage id={`${PREFIX}.studentDate`} />,
  studentDescription: <FormattedMessage id={`${PREFIX}.studentDescription`} />,
  moreTitle: <FormattedMessage id={`${PREFIX}.moreTitle`} />,
  moreDescription: <FormattedMessage id={`${PREFIX}.moreDescription`} />,
};

export class PlanLineupView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleBack = () => {
    this.goTo('/plan');
  };
  render() {
    const { viewport, breakpoints } = this.props;
    return (
      <ScrollView contentContainerStyle={st.get(['CenterColumn'])}>
        <View
          style={st.get(
            [
              'Row',
              'Wrap',
              'FullWidth',
              'PageMax',
              'Margins',
              'TopSpace',
              'XlTopGutter',
            ],
            viewport,
          )}
        >
          {Platform.select({
            web: (
              <TouchableOpacity
                onPress={this.handleBack}
                style={styles.topLeftAction}
              >
                <Icon size={16} name="left" fill={colors['ink']} />
              </TouchableOpacity>
            ),
          })}
          <View style={st.get(['FullWidth', 'CenterColumn', styles.item])}>
            <View style={st.get('ContentMax')}>
              <View style={st.get(['Row', 'CenterColumn', 'BottomGutter'])}>
                <Icon name="health" fill="none" size={50} />
                <Text
                  style={st.get(
                    [
                      'FinePrint',
                      'SubtleText',
                      'Bold',
                      'LeftGutter',
                      styles.label,
                    ],
                    viewport,
                  )}
                >
                  {COPY['healthDate']}
                </Text>
              </View>
              <Text style={st.get(['H3S', 'BottomGutter'], viewport)}>
                {COPY['healthTitle']}
              </Text>
              <Text style={st.get(['Body'], viewport)}>
                {COPY['healthDescription']}
              </Text>
            </View>
          </View>
          <View style={st.get(['FullWidth', 'CenterColumn', styles.item])}>
            <View style={st.get('ContentMax')}>
              <View style={st.get(['Row', 'CenterColumn', 'BottomGutter'])}>
                <Icon name="shield-default" fill="none" size={40} />
                <Text
                  style={st.get(
                    [
                      'FinePrint',
                      'SubtleText',
                      'Bold',
                      'LeftGutter',
                      styles.label,
                    ],
                    viewport,
                  )}
                >
                  {COPY['lifeDate']}
                </Text>
              </View>
              <Text style={st.get(['H3S', 'BottomGutter'], viewport)}>
                {COPY['lifeTitle']}
              </Text>
              <Text style={st.get(['Body'], viewport)}>
                {COPY['lifeDescription']}
              </Text>
            </View>
          </View>
          <View style={st.get(['FullWidth', 'CenterColumn', styles.item])}>
            <View style={st.get('ContentMax')}>
              <View style={st.get(['Row', 'CenterColumn', 'BottomGutter'])}>
                <Icon
                  name="student-hat"
                  fill="none"
                  size={Platform.select({ web: 50 })}
                />
                <Text
                  style={st.get(
                    [
                      'FinePrint',
                      'SubtleText',
                      'Bold',
                      'LeftGutter',
                      styles.label,
                    ],
                    viewport,
                  )}
                >
                  {COPY['studentDate']}
                </Text>
              </View>
              <Text style={st.get(['H3S', 'BottomGutter'], viewport)}>
                {COPY['studentTitle']}
              </Text>
              <Text style={st.get(['Body'], viewport)}>
                {COPY['studentDescription']}
              </Text>
            </View>
          </View>
          <View style={st.get(['FullWidth', 'CenterColumn', styles.item])}>
            <View style={st.get('ContentMax')}>
              <View style={st.get(['Row', 'CenterColumn', 'BottomGutter'])}>
                <Icon
                  name="flask"
                  fill="none"
                  size={Platform.select({ web: 50 })}
                />
              </View>
              <Text style={st.get(['H3S', 'BottomGutter'], viewport)}>
                {COPY['moreTitle']}
              </Text>
              <Text style={st.get(['Body'], viewport)}>
                {COPY['moreDescription']}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    maxWidth: 500,
    marginBottom: 60,
  },
  label: {
    maxWidth: 120,
  },
  topLeftAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 24,
  },
});

export default withDimensions(PlanLineupView);
