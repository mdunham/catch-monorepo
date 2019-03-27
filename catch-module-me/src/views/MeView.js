import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  H2,
  Box,
  Icon,
  Link,
  Hoverable,
  colors,
  styles,
  withDimensions,
} from '@catch/rio-ui-kit';
import { goTo, navigationPropTypes } from '@catch/utils';

import ProfileQuery from '../containers/ProfileQuery';
import SignOutButton from '../containers/SignOutButton';

const PREFIX = 'catch.module.me.MeView';

export let sidebarLinks = {
  '/info': <FormattedMessage id={`${PREFIX}.infoLink`} />,
  '/people': <FormattedMessage id={`${PREFIX}.contactsLink`} />,
  '/accounts': <FormattedMessage id={`${PREFIX}.accountsLink`} />,
  '/settings': <FormattedMessage id={`${PREFIX}.settingsLink`} />,
  '/referral': <FormattedMessage id={`${PREFIX}.referralsLink`} />,
  '/statements': <FormattedMessage id={`${PREFIX}.statementsLink`} />,
  '/disclosures': <FormattedMessage id={`${PREFIX}.disclosuresLink`} />,
};

export class MeView extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  activeProps = tab => {
    const { location, breakpoints } = this.props;
    const current = location.pathname;
    const isActive = current.indexOf(tab) > 0;
    return styles.get(['Body', isActive && 'Bold'], breakpoints.current);
  };

  /**
   * @NOTE: Handles cross platform navigation issue.
   */
  handleNav = path => {
    let fullPath = '/me'.concat(path);
    this.goTo(fullPath);
  };

  renderPressable = ({ title, path }) => {
    const { breakpoints } = this.props;
    return (
      <TouchableOpacity
        style={styles.get(['Divider', 'Bilateral'])}
        onPress={() => this.handleNav(path)}
        key={path}
      >
        <Text
          style={styles.get(
            ['Body', 'BottomGutter', 'TopGutter'],
            breakpoints.current,
          )}
        >
          {title}
        </Text>
        <Icon
          name="right"
          fill={colors.ink}
          dynamicRules={{ paths: { fill: colors.ink } }}
        />
      </TouchableOpacity>
    );
  };

  renderLink = ({ title, path }) => {
    const { breakpoints } = this.props;
    return breakpoints.select({
      'PhoneOnly|TabletPortaitUp': this.renderPressable({ title, path }),
      TabletLandscapeUp: Platform.select({
        web: (
          <Box py={1} key={path}>
            <Hoverable>
              {isHovered => (
                <Link to="#" onClick={() => this.handleNav(path)}>
                  <Text style={this.activeProps(path)}>{title}</Text>
                </Link>
              )}
            </Hoverable>
          </Box>
        ),
        // For native landscape view
        default: this.renderPressable({ title, path }),
      }),
    });
  };

  render() {
    const { breakpoints } = this.props;

    return (
      <ProfileQuery>
        {({ loading, canHaveContacts, canRefer }) => {
          // filter out referral link if a user cannot refer
          !loading && !canRefer && delete sidebarLinks['/referral'];
          !loading && !canHaveContacts && delete sidebarLinks['/people'];

          let links = Object.keys(sidebarLinks).map(link =>
            this.renderLink({ title: sidebarLinks[link], path: link }),
          );

          return (
            <SafeAreaView style={styles.get('Flex1')}>
              <ScrollView
                contentContainerStyle={styles.get(
                  [
                    'Margins',
                    'TopSpace',
                    'BottomSpace',
                    breakpoints.select({ PhoneOnly: 'White' }),
                  ],
                  breakpoints.current,
                )}
              >
                {breakpoints.select({
                  PhoneOnly: (
                    <H2 weight="normal" mb={2}>
                      Profile
                    </H2>
                  ),
                  'TabletLandscapeUp|TabletPortraitUp': (
                    <H2 weight="normal" w={212} mb={53}>
                      Profile
                    </H2>
                  ),
                })}
                {!loading && links}

                <SignOutButton />
              </ScrollView>
            </SafeAreaView>
          );
        }}
      </ProfileQuery>
    );
  }
}

const Component = withDimensions(MeView);

Component.displayName = 'MeView';

export default Component;
