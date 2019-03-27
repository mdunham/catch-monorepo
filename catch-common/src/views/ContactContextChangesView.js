import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, styles, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.me.ContactContextChangesView';
export const COPY = {
  delete: values => (
    <FormattedMessage id={`${PREFIX}.delete`} values={values} />
  ),
  taxDependents: <FormattedMessage id={`${PREFIX}.taxDependents`} />,
  tcDisclosure: <FormattedMessage id={`${PREFIX}.tcDisclosure`} />,
  updates: <FormattedMessage id={`${PREFIX}.updates`} />,
};

export const ContactContextChangesView = ({
  breakpoints,
  currentValue,
  proposedValue,
  isChangingTaxDependentsNumber,
  isChangingTrustedContact,
  isAddingTrustedContact,
  fullName,
  isDeleting,
}) => (
  <View>
    {isDeleting ? (
      <Text style={styles.get('H4', breakpoints.current)}>
        {COPY['delete']({ fullName })}
      </Text>
    ) : (
      <Text style={styles.get('Body', breakpoints.current)}>
        {COPY['updates']}
      </Text>
    )}
    <View style={styles.get('Container')}>
      {(isDeleting || isChangingTaxDependentsNumber) && (
        <React.Fragment>
          {isDeleting && (
            <Text
              style={styles.get(
                ['Body', 'SmTopGutter', 'BottomGutter'],
                breakpoints.current,
              )}
            >
              {isChangingTrustedContact || isChangingTaxDependentsNumber
                ? `All information related to this contact will be deleted and the following updates will be automatically applied to your plan:`
                : 'All information related to this contact will be deleted'}
            </Text>
          )}

          <View
            style={styles.get(
              ['Bilateral', 'FullWidth', 'TopGutter'],
              breakpoints,
            )}
          >
            {isChangingTaxDependentsNumber && (
              <React.Fragment>
                <Text style={styles.get('Body', breakpoints.current)}>
                  {COPY['taxDependents']}
                </Text>
                <View style={styles.get(['CenterRightRow'], breakpoints)}>
                  <Text
                    style={styles.get(
                      ['SubtleText', 'SmRightGutter'],
                      breakpoints.current,
                    )}
                  >
                    {currentValue}
                  </Text>
                  <Icon
                    fill={colors['ink+1']}
                    dynamicRules={{ paths: { fill: colors['ink+1'] } }}
                    name="arrow"
                  />
                  <Text
                    style={styles.get(
                      ['Body', 'Medium', 'SmLeftGutter'],
                      breakpoints.current,
                    )}
                  >
                    {proposedValue}
                  </Text>
                </View>
              </React.Fragment>
            )}
          </View>
        </React.Fragment>
      )}
      {(isDeleting || isChangingTrustedContact) && (
        <React.Fragment>
          <View
            style={styles.get(
              ['Bilateral', 'FullWidth', 'TopGutter'],
              breakpoints,
            )}
          >
            {isChangingTrustedContact && (
              <React.Fragment>
                <Text style={styles.get('Body', breakpoints.current)}>
                  Retirement trusted contact
                </Text>

                <Text
                  style={styles.get(['Body', 'Medium'], breakpoints.current)}
                >
                  {isAddingTrustedContact ? fullName : 'None'}
                </Text>
              </React.Fragment>
            )}
          </View>
          {isAddingTrustedContact && (
            <Text
              style={styles.get(
                ['TopGutter', 'FinePrintLight'],
                breakpoints.current,
              )}
            >
              {COPY['tcDisclosure']}
            </Text>
          )}
        </React.Fragment>
      )}
    </View>
  </View>
);

ContactContextChangesView.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  currentValue: PropTypes.number,
  proposedValue: PropTypes.number,
  fullName: PropTypes.string,
  isChangingTaxDependentsNumber: PropTypes.bool,
  isChangingTrustedContact: PropTypes.bool,
  isAddingTrustedContact: PropTypes.bool,
  isDeleting: PropTypes.bool,
};

export default ContactContextChangesView;
