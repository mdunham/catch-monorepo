import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform } from 'react-native';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { getFormValues, formValueSelector, initialize } from 'redux-form';
import format from 'date-fns/format';
import {
  PageTitle,
  PageWrapper,
  Button,
  H4,
  Text,
  Flex,
  Box,
  Spinner,
  Divider,
  withDimensions,
  space,
  styles,
} from '@catch/rio-ui-kit';
import { UserInfo, LabelText, EstimatedIncomeInfo } from '@catch/common';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import {
  goTo,
  filingStatusCopy,
  STATES,
  Currency,
  NumericDate,
  createLogger,
} from '@catch/utils';

import {
  SettingsGroup,
  InfoBlock,
  SettingsLayout,
} from '../components';
import { EditInfo } from '../containers';

const Log = createLogger('user-details');

const PREFIX = 'catch.module.me.UserDetailsView';
export const COPY = {
  'legalInfo.title': <FormattedMessage id={`${PREFIX}.legalInfo.title`} />,
  'workInfo.title': <FormattedMessage id={`${PREFIX}.workInfo.title`} />,
  'workType.label': <FormattedMessage id={`${PREFIX}.workType.label`} />,
  'workType.1099': <FormattedMessage id={`${PREFIX}.workType.1099`} />,
  'workType.w2': <FormattedMessage id={`${PREFIX}.workType.w2`} />,
  'workType.mixed': <FormattedMessage id={`${PREFIX}.workType.mixed`} />,
  'checkup.title': <FormattedMessage id={`${PREFIX}.checkup.title`} />,
  'checkup.caption': <FormattedMessage id={`${PREFIX}.checkup.caption`} />,
  'checkup.link': <FormattedMessage id={`${PREFIX}.checkup.link`} />,
};

/**
 * Possible work types
 *
 * WORK_TYPE_1099 / WORK_TYPE_W2 / WORK_TYPE_DIVERSIFIED
 */

const WORK_TYPE_COPY = {
  WORK_TYPE_W2: COPY['workType.w2'],
  WORK_TYPE_1099: COPY['workType.1099'],
  WORK_TYPE_DIVERSIFIED: COPY['workType.mixed'],
};

export class UserDetailsView extends React.Component {
  static propTypes = {
    annualIncome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    legalFormValues: PropTypes.object,
    workState: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = { isEditing: null };
    this.goTo = goTo.bind(this);
  }

  handleCompleted = _ => {
    this.toggleEdit(null);
  };

  toggleEdit = Platform.select({
    web: obj => {
      this.setState({ isEditing: obj });
    },
    default: obj => {
      this.goTo('/me/info/edit', { info: obj });
    },
  });

  toggleInfo = info => {
    this.setState(({ isEditing }) => ({
      isEditing: {
        ...isEditing,
        showInfo: info,
      },
    }));
  };

  handleCheckup = () => {
    this.goTo('/guide/checkup');
  };

  render() {
    const { isEditing } = this.state;
    const { viewport, breakpoints } = this.props;
    return (
      <UserInfo key={1}>
        {props => (
          <React.Fragment>
            <SettingsLayout breakpoints={breakpoints}>
              {this._renderDetails(props)}
            </SettingsLayout>
            {isEditing && (
              <React.Fragment>
                <EditInfo
                  {...isEditing}
                  onClose={this.toggleEdit}
                  metaData={props.metaData}
                  onCompleted={this.handleCompleted}
                  userData={{
                    givenName: props.givenName,
                    familyName: props.familyName,
                    dob: format(props.dob, 'MM/DD/YYYY'),
                    phoneNumber: props.phoneNumber,
                    tcEmail: props.trustedContact.email,
                    tcName: props.trustedContact.name,
                    tcPhoneNumber: props.trustedContact.phoneNumber,
                    workType: props.workType,
                    ...props.legalAddress,
                  }}
                  onInfo={this.toggleInfo}
                  goTo={this.goTo}
                />
                {isEditing.showInfo && (
                  // We can make this component a universal tooltip info renderer
                  // but for now it serves its purpose
                  <EstimatedIncomeInfo
                    incomeType={isEditing.showInfo}
                    onClose={() => this.toggleEdit(null)}
                    onBack={() => this.toggleInfo(null)}
                  />
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </UserInfo>
    );
  }
  /**
   * @NOTE: array is necessary to render in a ScrollView
   * We could move this method as its own component but I feel it is easier
   * to understand if we keep it here
   */
  _renderDetails = ({
    loading,
    legalAddress,
    phoneNumber,
    legalName,
    dob,
    workType,
    incomeState,
    estimatedIncome,
    filingStatus,
    spouseIncome,
    kycStatus,
    hasFinishedSurvey,
  }) => [
    <SettingsGroup
      title={COPY['legalInfo.title']}
      titleProps={this.props.breakpoints.select({
        TabletLandscapeUp: { ml: 12 },
      })}
      key="g-1"
    >
      {loading ? (
        <Box p={5} row align="center" justify="center">
          <Spinner />
        </Box>
      ) : (
        <React.Fragment>
          <InfoBlock
            editable={kycStatus !== 'KYC_GOOD'}
            info={legalName}
            label={<LabelText fieldName="LegalNameField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'LegalFirstNameField' })}
            breakpoints={this.props.breakpoints}
          />
          <InfoBlock
            editable={kycStatus !== 'KYC_GOOD'}
            info={<NumericDate>{dob}</NumericDate>}
            label={<LabelText fieldName="DobField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'DobField' })}
            breakpoints={this.props.breakpoints}
          />
          <InfoBlock
            editable
            info={
              legalAddress.street1
                ? () => this._renderAddress(legalAddress)
                : undefined
            }
            label={<LabelText fieldName="LegalAddressField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'LegalAddressField' })}
            breakpoints={this.props.breakpoints}
          />
          <InfoBlock
            editable
            info={phoneNumber}
            label={<LabelText fieldName="PhoneNumberField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'PhoneNumberField' })}
            breakpoints={this.props.breakpoints}
            isLast
          />
        </React.Fragment>
      )}
    </SettingsGroup>,
    this.props.viewport === 'TabletLandscapeUp' && (
      <Box mb={4} w={374} ml={2} key="d-1">
        <Divider />
      </Box>
    ),
    <SettingsGroup
      title={COPY['workInfo.title']}
      titleProps={this.props.breakpoints.select({
        TabletLandscapeUp: { ml: 12 },
      })}
      key="g-2"
    >
      {loading ? (
        <Box p={5} row align="center" justify="center">
          <Spinner />
        </Box>
      ) : (
        <React.Fragment>
          <InfoBlock
            editable
            info={WORK_TYPE_COPY[workType]}
            label={COPY['workType.label']}
            onEdit={() =>
              this.toggleEdit({
                fieldName: 'WorkTypeField',
                nextFieldName: 'UserIncomeField',
              })
            }
            breakpoints={this.props.breakpoints}
          />
          <InfoBlock
            editable
            info={STATES[incomeState]}
            label={<LabelText fieldName="WorkStateField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'WorkStateField' })}
            breakpoints={this.props.breakpoints}
          />
          <InfoBlock
            editable
            info={filingStatusCopy[filingStatus]}
            label={<LabelText fieldName="FilingStatusField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'FilingStatusField' })}
            breakpoints={this.props.breakpoints}
          />
          <InfoBlock
            editable
            info={<Currency>{estimatedIncome}</Currency>}
            label={<LabelText fieldName="UserIncomeField" />}
            onEdit={() => this.toggleEdit({ fieldName: 'UserIncomeField' })}
            breakpoints={this.props.breakpoints}
            isLast={filingStatus !== 'MARRIED'}
          />
          {filingStatus === 'MARRIED' && (
            <InfoBlock
              editable
              info={<Currency>{spouseIncome}</Currency>}
              label={<LabelText fieldName="SpouseIncomeField" />}
              onEdit={() => this.toggleEdit({ fieldName: 'SpouseIncomeField' })}
              breakpoints={this.props.breakpoints}
              isLast
            />
          )}
        </React.Fragment>
      )}
    </SettingsGroup>,
    this.props.viewport === 'TabletLandscapeUp' &&
      hasFinishedSurvey && (
        <Box mb={4} ml={12} w={374} key="d-3">
          <Divider />
        </Box>
      ),
    hasFinishedSurvey && (
      <SettingsGroup
        title={COPY['checkup.title']}
        titleProps={this.props.breakpoints.select({
          TabletLandscapeUp: { ml: 12 },
        })}
        key="g-4"
      >
        <Text
          mb={2}
          ml={this.props.breakpoints.select({
            TabletLandscapeUp: 12,
          })}
        >
          {COPY['checkup.caption']}
        </Text>
        <Text
          ml={this.props.breakpoints.select({
            TabletLandscapeUp: 12,
          })}
          weight="medium"
          color="link"
          onClick={this.handleCheckup}
        >
          {COPY['checkup.link']}
        </Text>
      </SettingsGroup>
    ),
  ];

  _renderAddress = ({ street1, street2, city, state, zip, coutry }) => (
    <Box>
      <Text size={16}>{street1}</Text>
      {street2 && <Text size={16}>{street2}</Text>}
      <Text size={16}>
        {city}, {state} {zip}
      </Text>
    </Box>
  );
}

const selectMetadata = formValueSelector('UserMetadataForm');

const withRedux = connect(
  state => ({
    filingStatus: selectMetadata(state, 'filingStatus'),
  }),
  {
    initialize,
    push,
  },
);

const enhance = compose(
  withRedux,
  withDimensions,
);

const Component = enhance(UserDetailsView);

Component.displayName = 'UserDetailsView';

export default Component;
