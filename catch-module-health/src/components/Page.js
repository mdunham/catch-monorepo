import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import { Button, styles as st, colors, Icon } from '@catch/rio-ui-kit';

class Page extends React.PureComponent {
  static propTypes = {
    viewport: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.bool,
    ]),
    children: PropTypes.node,
    actions: function(props, propName, componentName) {
      if (props.renderFooter && !props[propName]) {
        return new Error(
          'The prop `' +
            propName +
            '` is marked as required in' +
            ' `' +
            componentName +
            '` if `renderFooter` is true.',
        );
      }
      return PropTypes.Array;
    },
    renderFooter: PropTypes.bool,
    actionStack: PropTypes.bool,
    // Top nav props
    renderTopNav: PropTypes.oneOf([false, 'scroll', 'fixed']),
    topNavLeftText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.object,
    ]),
    topNavRightText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.object,
    ]),
    topNavTitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.object,
    ]),
    topNavLeftAction: PropTypes.func,
    topNavRightAction: PropTypes.func,
    topNavLeftIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    topNavRightIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    topNavRightComponent: PropTypes.node,
  };
  static defaultProps = {
    renderFooter: true,
    topNavLeftIcon: {
      name: 'left',
      fill: colors.ink,
      dynamicRules: { paths: { fill: colors.ink } },
      size: Platform.select({
        web: 16,
        default: 20,
      }),
    },
  };
  renderTopNav = () => {
    const {
      viewport,
      topNavLeftText,
      topNavRightText,
      topNavTitle,
      topNavLeftAction,
      topNavRightAction,
      topNavLeftIcon,
      topNavRightIcon,
      topNavRightComponent,
    } = this.props;
    return (
      <View
        style={st.get(
          [
            'PageMax',
            'Margins',
            'FullWidth',
            viewport === 'TabletLandscapeUp' && 'XlTopGutter',
          ],
          viewport,
        )}
      >
        <View
          style={[styles.topNavContainer, styles[`topNavContainer${viewport}`]]}
        >
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={topNavLeftAction}
            style={styles.topNavLeft}
          >
            {!!topNavLeftIcon && <Icon {...topNavLeftIcon} />}
            {!!topNavLeftText && (
              <Text
                style={st.get(
                  ['FinePrint', 'Medium', 'SmLeftGutter'],
                  viewport,
                )}
              >
                {topNavLeftText}
              </Text>
            )}
          </TouchableOpacity>
          <View style={st.get('CenterColumn')}>
            {!!topNavTitle && (
              <Text style={st.get(['Body', 'Bold', 'CenterText'], viewport)}>
                {topNavTitle}
              </Text>
            )}
          </View>
          {!!topNavRightComponent && (
            <View style={styles.topNavRight}>{topNavRightComponent}</View>
          )}
          {(!!topNavRightText || !!topNavRightIcon) && (
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={topNavRightAction}
              style={styles.topNavRight}
            >
              {!!topNavRightText && (
                <Text
                  style={st.get(
                    ['FinePrint', 'Medium', 'SmRightGutter'],
                    viewport,
                  )}
                >
                  {topNavRightText}
                </Text>
              )}
              {!!topNavRightIcon && <Icon {...topNavRightIcon} />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  renderTitle = () => {
    const {
      viewport,
      title,
      subtitle,
      containTitle,
      narrowTitle,
      centerTitle,
      titleIcon,
      titleIconSize,
      titleIconStyle,
      titleContainerStyle,
    } = this.props;
    return (
      <View
        style={st.get(
          [
            'FullWidth',
            'PageMax',
            containTitle && 'ContentMax',
            narrowTitle && 'ButtonMax',
            styles.titleContainer,
            centerTitle && 'CenterColumn',
            styles[`titleContainer${viewport}`],
            titleContainerStyle,
          ],
          viewport,
        )}
      >
        {!!titleIcon && (
          <View style={st.get(['BottomGutter', titleIconStyle])}>
            <Icon name={titleIcon} size={titleIconSize} />
          </View>
        )}
        <Text style={st.get(['H3', centerTitle && 'CenterText'], viewport)}>
          {title}
        </Text>
        {Array.isArray(subtitle) ? (
          subtitle.map(
            (s, i) =>
              !!s && (
                <Text
                  key={`s-${i}`}
                  style={st.get(
                    [
                      'Body',
                      i === 0 && 'TopGutter',
                      centerTitle && 'CenterText',
                      'BottomGutter',
                    ],
                    viewport,
                  )}
                >
                  {s}
                </Text>
              ),
          )
        ) : subtitle ? (
          <Text
            style={st.get(
              ['Body', 'TopGutter', centerTitle && 'CenterText'],
              viewport,
            )}
          >
            {subtitle}
          </Text>
        ) : (
          undefined
        )}
      </View>
    );
  };
  renderBody = () => {
    const {
      topSpace,
      viewport,
      children,
      title,
      centerBody,
      noMargins,
      renderTopNav,
    } = this.props;
    return (
      <ScrollView
        contentContainerStyle={st.get([
          'CenterColumn',
          topSpace && styles.topSpace,
        ])}
      >
        {renderTopNav === 'scroll' && this.renderTopNav()}
        <View
          style={st.get(['Margins', 'FullWidth', 'CenterColumn'], viewport)}
        >
          {!!title && this.renderTitle()}
        </View>
        <View
          style={st.get(
            [
              'FullWidth',
              'PageMax',
              !noMargins && 'Margins',
              centerBody && 'CenterColumn',
            ],
            viewport,
          )}
        >
          {children}
        </View>
      </ScrollView>
    );
  };
  renderFooter = () => {
    const {
      actions,
      actionStack,
      rightSecondaryAction,
      rightSecondaryActionText,
      viewport,
    } = this.props;
    return (
      <View style={[styles.bottomActions, actionStack && styles.actionStack]}>
        <View
          style={st.get(
            [
              'FullWidth',
              'Margins',
              'PageMax',
              styles.mainAction,
              !rightSecondaryAction && styles[`mainAction${viewport}`],
            ],
            viewport,
          )}
        >
          {actionStack && (
            <React.Fragment>
              <View style={st.get(['FullWidth', 'ButtonMax', 'BottomGutter'])}>
                <Button {...actions[0]} viewport={viewport} />
              </View>
              <View style={st.get(['FullWidth', 'ButtonMax'])}>
                <Button {...actions[1]} viewport={viewport} />
              </View>
            </React.Fragment>
          )}
          {rightSecondaryAction &&
            (viewport === 'PhoneOnly' ? (
              <View style={st.get(['FullSize', 'Row', 'CenterColumn'])}>
                <View style={st.get(['Flex1', 'SmRightGutter'])}>
                  <Button
                    type="outline"
                    onClick={rightSecondaryAction}
                    children={rightSecondaryActionText}
                  />
                </View>
                <View style={st.get('Flex1')}>
                  <Button
                    wide={viewport === 'PhoneOnly'}
                    viewport={viewport}
                    {...actions[0]}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.row}>
                <Text
                  onPress={rightSecondaryAction}
                  style={st.get(
                    ['Body', 'Medium', styles.rightSecondaryAction],
                    viewport,
                  )}
                >
                  {rightSecondaryActionText}
                </Text>
                <Button
                  wide={viewport === 'PhoneOnly'}
                  viewport={viewport}
                  {...actions[0]}
                />
              </View>
            ))}
          {!rightSecondaryAction &&
            !actionStack && (
              <Button
                wide={viewport === 'PhoneOnly'}
                viewport={viewport}
                {...actions[0]}
              />
            )}
        </View>
      </View>
    );
  };
  render() {
    const { viewport, renderFooter, renderTopNav } = this.props;
    return (
      <SafeAreaView
        style={st.get(['Flex1', viewport === 'PhoneOnly' && 'White'])}
      >
        <KeyboardAvoidingView
          style={st.get('Flex1')}
          behavior={Platform.select({ ios: 'padding' })}
        >
          {renderTopNav === 'fixed' && this.renderTopNav()}
          {this.renderBody()}
          {renderFooter && this.renderFooter()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topSpace: {
    paddingTop: 56,
  },
  bottomActions: {
    borderTopWidth: 1,
    borderTopColor: colors['ink+3'],
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  actionStack: {
    borderTopColor: 'transparent',
    height: 180,
  },
  titleContainer: {
    marginTop: 54,
    marginBottom: 40,
  },
  titleContainerPhoneOnly: {
    marginTop: 48,
  },
  mainAction: {
    alignItems: 'flex-end',
  },
  mainActionPhoneOnly: {
    maxWidth: 312,
  },
  row: {
    flexDirection: 'row',
  },
  rightSecondaryAction: {
    paddingTop: 8,
    marginRight: 32,
  },
  topNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  topNavContainerTabletLandscapeUp: {
    height: 16,
  },
  topNavLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topNavRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Page;
