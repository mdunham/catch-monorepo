import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import { ModifyContactsView, ContactsQuery } from '@catch/common';
import { goTo } from '@catch/utils';
import {
  Blob,
  withDimensions,
  styles,
  colors,
  borderRadius,
  Icon,
} from '@catch/rio-ui-kit';

import { ContactCard, SettingsLayout } from '../components';

const PREFIX = 'catch.module.me.ContactsView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
  'defaultState.noContacts': (
    <FormattedMessage id={`${PREFIX}.defaultState.noContacts`} />
  ),
  'defaultState.cta': <FormattedMessage id={`${PREFIX}.defaultState.cta`} />,
  'dependent.cta': <FormattedMessage id={`${PREFIX}.dependent.cta`} />,
  numDependents: values => (
    <FormattedMessage id={`${PREFIX}.numDependents`} values={values} />
  ),
};

const localStyles = StyleSheet.create({
  highlight: {
    backgroundColor: colors['peach+2'],
    borderRadius: borderRadius.regular,
  },
});

export class ContactsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { action: null, contactId: null };
    this.goTo = goTo.bind(this);
  }

  handleDismiss = () => {
    this.setState({ action: null, contactId: null });
  };

  togglePeople = Platform.select({
    web: ({ action, id, initialValues }) => {
      this.setState({ action, contactId: id, initialValues });
    },
    default: ({ action, id, initialValues }) => {
      this.goTo('/me/people/edit', { action, contactId: id, initialValues });
    },
  });

  render() {
    const { breakpoints, viewport } = this.props;
    return (
      <React.Fragment>
        <SettingsLayout breakpoints={breakpoints}>
          <View style={styles.get('ContentMax')}>
            <View style={styles.get(['BottomGutter', 'Bilateral'])}>
              <Text
                style={styles.get(
                  ['H3S', breakpoints.current === 'PhoneOnly' && 'SmTopGutter'],
                  viewport,
                )}
              >
                {COPY['title']}
              </Text>
              <TouchableOpacity
                onPress={() => this.togglePeople({ action: 'ADD_CONTACT' })}
                style={styles.get('CenterRightRow')}
              >
                <Icon fill={colors.flare} name="naked-plus" size={11} />
                <Text
                  style={styles.get(
                    ['XsLeftGutter', 'BodyLink'],
                    breakpoints.current,
                  )}
                >
                  New contact
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={styles.get(['Body', 'SmBottomSpace'], breakpoints.current)}
            >
              {COPY['description']}
            </Text>

            <ContactsQuery>
              {({
                numDependents,
                connectedDependents,
                hasTaxGoal,
                contacts,
              }) => (
                <React.Fragment>
                  {hasTaxGoal &&
                    numDependents > 0 &&
                    numDependents !== connectedDependents && (
                      <View
                        style={styles.get(
                          [
                            'TopGutter',
                            'LgMargins',
                            'SmTopSpace',
                            'SmBottomSpace',
                            'BottomGutter',
                            localStyles.highlight,
                          ],
                          breakpoints.current,
                        )}
                      >
                        <Text style={styles.get('Body', breakpoints.current)}>
                          {COPY['numDependents']({
                            connectedDependents: (
                              <Text style={styles.get('Bold', breakpoints)}>
                                {connectedDependents}
                              </Text>
                            ),
                            of: (
                              <Text style={styles.get('Bold', breakpoints)}>
                                of
                              </Text>
                            ),
                            numDependents: (
                              <Text style={styles.get('Bold', breakpoints)}>
                                {numDependents}
                              </Text>
                            ),
                          })}
                        </Text>

                        <Text
                          onPress={() =>
                            this.togglePeople({
                              action: 'ADD_CONTACT',
                              id: null,
                              initialValues: { isTaxDependent: true },
                            })
                          }
                          style={styles.get(['BodyLink'], breakpoints.current)}
                        >
                          {COPY['dependent.cta']}
                        </Text>
                      </View>
                    )}
                  {!contacts && (
                    <View
                      style={styles.get(
                        [
                          'TopGutter',
                          'LgMargins',
                          'CenterColumn',
                          'SmTopSpace',
                          'SmBottomSpace',
                          'BottomGutter',
                          localStyles.highlight,
                        ],
                        breakpoints.current,
                      )}
                    >
                      <Blob name="contact-book" blobColor={colors['peach+1']} />
                      <Text style={styles.get('Body', breakpoints.current)}>
                        {COPY['defaultState.noContacts']}
                      </Text>
                      <Text
                        onPress={() =>
                          this.togglePeople({ action: 'ADD_CONTACT' })
                        }
                        style={styles.get(['BodyLink'], breakpoints.current)}
                      >
                        {COPY['defaultState.cta']}
                      </Text>
                    </View>
                  )}
                  {contacts &&
                    contacts.map(contact => (
                      <View
                        key={contact.id}
                        style={styles.get(['SmTopGutter', 'SmBottomGutter'])}
                      >
                        <ContactCard
                          onClick={() =>
                            this.togglePeople({
                              action: 'VIEW_CONTACT',
                              id: contact.id,
                            })
                          }
                          breakpoints={breakpoints}
                          {...contact}
                        />
                      </View>
                    ))}
                </React.Fragment>
              )}
            </ContactsQuery>
          </View>
          {!!this.state.action && (
            <ModifyContactsView
              action={this.state.action}
              onDismiss={this.handleDismiss}
              contactId={this.state.contactId}
              onToggle={this.togglePeople}
              initialValues={this.state.initialValues}
            />
          )}
        </SettingsLayout>
      </React.Fragment>
    );
  }
}

ContactsView.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  viewport: PropTypes.string.isRequired,
};

const Component = withDimensions(ContactsView);
Component.displayName = 'ContactsView';

export default Component;
