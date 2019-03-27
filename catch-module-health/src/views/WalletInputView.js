import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector, isValid, submit } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk/global';

import { Auth, Env, createLogger, goTo, goBack } from '@catch/utils';
import { withDimensions, styles as st, colors, Icon } from '@catch/rio-ui-kit';
import { SetRecommendationImportance } from '@catch/guide';

import { ImagePreview, InsuranceCardDropper, Page } from '../components';
import {
  DeleteHealthInsurance,
  DeleteHealthInsuranceCard,
  HealthInsurance,
  UploadHealthInsuranceCard,
  UpsertHealthInsurance,
} from '../containers';
import { WalletInputForm } from '../forms';

import DeleteInsuranceConfirmationView from './DeleteInsuranceConfirmationView';

const Log = createLogger('wallet-input-view');

const columnWidth = 360;

const fileTypes = {
  JPG: 'JPEG',
  JPEG: 'JPEG',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  PNG: 'PNG',
  'application/pdf': 'PDF',
  'image/heif': 'HEIF',
  'image/heic': 'HEIC',
  HEIF: 'HEIF',
  HEIC: 'HEIC',
};
const mimeTypes = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  PDF: 'application/pdf',
  HEIC: 'image/heic',
  HEIF: 'image/heif',
};

const cardSides = {
  front: 'FRONT',
  back: 'BACK',
};

export class WalletInputView extends React.Component {
  static propTypes = {
    breakpoints: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
    submitForm: PropTypes.func.isRequired,
    viewport: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);

    this.state = {
      front: null,
      back: null,
      isUploading: false,
      isDeleting: false,
    };
  }

  handleBack = () => {
    const { isEditing } = this.props;
    if (Platform.OS !== 'web') {
      this.goBack('modal');
      return;
    }
    if (isEditing) {
      this.goTo('/plan/health/overview');
    } else {
      this.goTo('/plan/health/wallet/intro');
    }
  };

  handleCompleted = () => {
    const { isEditing } = this.props;
    if (isEditing) {
      this.goTo('/plan/health/overview');
    } else {
      this.goTo('/plan/health/wallet/add-doctors');
    }
  };

  handleDrop = (file, side) => {
    Log.debug({ file, side });

    this.setState({ [side]: { file: file[0], side } });
  };

  handleDelete = side => {
    Log.debug(`removing ${side}`);

    this.setState({ [side]: null });
  };

  /**
   * Handler for submitting the form values
   *
   * @param {function} upsertHealthInsurance - the function to save the record to our db
   * @param {object} values - the form values
   * @param {string} id - the id of the insurance record in our db
   */
  handleSubmit = (upsertHealthInsurance, values, id) => {
    /**
     * @Note if we don't pass the id in the upsert, the health insurance record gets overwritten. The id is required
     * for a pure update
     */
    upsertHealthInsurance({
      variables: {
        input: { id, ...values },
      },
    });
  };

  /**
   * Updates the AWS config with the latest cognito credentials and creates
   * a new instance of the S3 helper class
   * @params {String} jwt
   * @return {Class} s3
   */
  _createS3 = jwt => {
    const region = Env.authCreds.region;

    const opts = {
      region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: Env.authCreds.identityPoolId,
        Logins: {
          [`cognito-idp.${region}.amazonaws.com/${
            Env.authCreds.userPoolId
          }`]: jwt,
        },
      }),
    };

    Log.debug(opts);
    AWS.config.update(opts);
    return new S3({
      apiVersion: '2006-03-01',
      params: {
        Bucket: Env.uploads.bucket,
      },
      region,
    });
  };

  /**
   * Gets the latest cognito credentials, instanciate the S3
   * create an upload promise and awaits the results from AWS
   * the callback posts the result to the api
   */
  handleAWS = async (cb, familyName) => {
    const { front, back } = this.state;
    const { submitForm } = this.props;

    if (front || back) {
      try {
        this.setState({ isUploading: true });
        // 1) Get the cognito credentials
        const jwt = await Auth.getJWTToken();
        // 2) instanciate the S3 api
        const s3 = this._createS3(jwt);

        if (front) {
          // 3) Map provided type to something our api can understand
          const fileType = fileTypes[front.file.type];
          // 4) Append a nonce and filetype too
          const fileKey = `${familyName}-${Date.now()}.${fileType}`;
          // prep the payload cross platform changes

          const payload = Object.assign(
            { Key: fileKey, ACL: 'private', ServerSideEncryption: 'AES256' },
            Platform.select({
              web: {
                Body: front.file,
              },
              default: {
                Body: front.file.data,
                ContentEncoding: 'base64',
                ContentType: mimeTypes[fileType],
              },
            }),
          );

          // 6) Create an upload promise
          const upload = s3.upload(payload);
          // TODO: track progress and show a progress bar
          // 7) Wait for the promise to come back
          const result = await upload.promise();

          // 8) Post the result to the api

          const apiResp = await cb({
            variables: {
              input: {
                key: fileKey,
                filetype: fileType,
                side: cardSides[front.side],
              },
            },
          });
          Log.debug(result);
          Log.debug(apiResp);
        }
        if (back) {
          // 3) Map provided type to something our api can understand
          const fileType = fileTypes[back.file.type];
          // 4) Append a nonce and filetype too
          const fileKey = `${familyName}-${Date.now()}.${fileType}`;
          // prep the payload cross platform changes

          const payload = Object.assign(
            { Key: fileKey, ACL: 'private', ServerSideEncryption: 'AES256' },
            Platform.select({
              web: {
                Body: back.file,
              },
              default: {
                Body: back.file.data,
                ContentEncoding: 'base64',
                ContentType: mimeTypes[fileType],
              },
            }),
          );

          // 6) Create an upload promise
          const upload = s3.upload(payload);
          // TODO: track progress and show a progress bar
          // 7) Wait for the promise to come back
          const result = await upload.promise();

          // 8) Post the result to the api

          const apiResp = await cb({
            variables: {
              input: {
                key: fileKey,
                filetype: fileType,
                side: cardSides[back.side],
              },
            },
          });
          Log.debug(result);
          Log.debug(apiResp);
        }
        this.setState({ isUploading: false, file: null });

        submitForm();
      } catch (e) {
        Log.error(e);
        this.setState({ isUploading: false });
      }
    } else {
      submitForm();
    }
  };

  /**
   * Sets the image preview
   *
   * @param {string} side - the image side to set as preview
   * @param {string} url - optional url to set in preview if `side` is null
   */
  setImagePreview = (side, url) => {
    this.setState({ imagePreview: side ? this.state[side].file.preview : url });
  };

  /**
   * Handler for deleting health insurance - conditionally sets the importance of the user's health insurance recommendation
   *
   * @param {function} setImportance - mutate function to set importance
   * @param {id} id - the ID in our db for this recommendation
   * @param {string} needBasedImportance - the importance level for this user based on answers in guide checkup
   */
  handleDeleteInsuranceComplete = (setImportance, id, needBasedImportance) => {
    const { deleteReason } = this.props;

    // if a user indicates they're no longer covered, we need to reset their importance to the needBasedImportance they obtained when initially going through the guide
    if (deleteReason === 'NOT_COVERED') {
      setImportance({
        variables: {
          importanceInput: {
            recommendationID: id,
            importance: needBasedImportance,
          },
        },
      });
    }

    this.handleCompleted();
  };

  render() {
    const {
      breakpoints,
      isValid,
      viewport,
      // Comes from either navigation props
      isEditing,
      deleteReason,
    } = this.props;
    const { back, front, imagePreview, isDeleting, isUploading } = this.state;

    return (
      <HealthInsurance>
        {({
          id,
          initialValues,
          carrier,
          familyName,
          frontImageUrl,
          backImageUrl,
          loading,
          healthInsuranceRecommendation,
        }) =>
          loading ? null : (
            <UploadHealthInsuranceCard>
              {({ uploadHealthInsuranceCard, loading: uploading }) => (
                <UpsertHealthInsurance onCompleted={this.handleCompleted}>
                  {({ upsertHealthInsurance, loading }) => (
                    <Page
                      title={
                        !isEditing && 'Enter your health insurance details'
                      }
                      titleIcon={!isEditing && 'health'}
                      titleIconSize={66}
                      viewport={viewport}
                      breakpoints={breakpoints}
                      topNavLeftAction={this.handleBack}
                      renderTopNav={
                        Platform.OS === 'web'
                          ? 'scroll'
                          : isEditing
                            ? 'fixed'
                            : false
                      }
                      centerTitle
                      narrowTitle
                      actions={[
                        {
                          onClick: () => {
                            this.handleAWS(
                              uploadHealthInsuranceCard,
                              familyName,
                            );
                          },
                          children: isUploading
                            ? 'Saving...'
                            : isEditing
                              ? 'Save'
                              : 'Next',
                          disabled: isUploading || loading || !isValid,
                        },
                      ]}
                      rightSecondaryAction={this.handleBack}
                      rightSecondaryActionText="Cancel"
                      topNavLeftIcon={
                        isEditing && Platform.OS !== 'web'
                          ? {
                              name: 'close',
                              dynamicRules: { paths: { fill: colors.ink } },
                              size: 30,
                            }
                          : undefined
                      }
                      topNavTitle={
                        isEditing &&
                        Platform.OS !== 'web' &&
                        'Edit Insurance Details'
                      }
                      topNavRightComponent={
                        isEditing && (
                          <TouchableOpacity
                            style={st.get('CenterLeftRow')}
                            onPress={() => this.setState({ isDeleting: true })}
                          >
                            <Icon
                              name="trash"
                              fill={colors['coral-2']}
                              size={viewport === 'PhoneOnly' ? 22 : 16}
                            />
                            {viewport !== 'PhoneOnly' && (
                              <Text
                                style={st.get(
                                  ['Body', 'Medium', 'Warning', 'SmLeftGutter'],
                                  viewport,
                                )}
                              >
                                Delete insurance
                              </Text>
                            )}
                          </TouchableOpacity>
                        )
                      }
                    >
                      <View
                        style={[
                          st.get([
                            'CenterRow',
                            'FullWidth',
                            'LgBottomGutter',
                            !!carrier && 'LgTopGutter',
                            viewport !== 'PhoneOnly' && styles.container,
                          ]),
                          breakpoints.select({
                            'TabletLandscapeUp|TabletPortraitUp': st.get(
                              'CenterLeftRow',
                            ),
                          }),
                        ]}
                      >
                        <View
                          style={breakpoints.select({
                            'TabletLandscapeUp|TabletPortraitUp': st.get([
                              'LgRightGutter',
                              styles.column,
                            ]),
                          })}
                        >
                          <WalletInputForm
                            initialValues={initialValues || null}
                            onSubmit={values =>
                              this.handleSubmit(
                                upsertHealthInsurance,
                                values,
                                id,
                              )
                            }
                            viewport={viewport}
                          />
                        </View>
                        <DeleteHealthInsuranceCard>
                          {({ deleteHealthInsuranceCard }) => (
                            <View
                              style={breakpoints.select({
                                'TabletLandscapeUp|TabletPortraitUp': st.get([
                                  'LgLeftGutter',
                                  styles.column,
                                  { height: '100%' },
                                ]),
                              })}
                            >
                              <View style={styles.frontImageWrapper}>
                                <InsuranceCardDropper
                                  breakpoints={breakpoints}
                                  file={front ? front.file : frontImageUrl}
                                  name="front"
                                  handleDrop={file =>
                                    this.handleDrop(file, 'front')
                                  }
                                  side="front"
                                  viewport={viewport}
                                  onDelete={
                                    front
                                      ? () => this.handleDelete('front')
                                      : () =>
                                          deleteHealthInsuranceCard({
                                            variables: { sides: ['FRONT'] },
                                          })
                                  }
                                  onPreview={
                                    front
                                      ? () => this.setImagePreview('front')
                                      : () =>
                                          this.setImagePreview(
                                            null,
                                            frontImageUrl,
                                          )
                                  }
                                />
                              </View>
                              <View style={styles.backImageWrapper}>
                                <InsuranceCardDropper
                                  breakpoints={breakpoints}
                                  file={back ? back.file : backImageUrl}
                                  name="back"
                                  handleDrop={file =>
                                    this.handleDrop(file, 'back')
                                  }
                                  side="back"
                                  viewport={viewport}
                                  onDelete={
                                    back
                                      ? () => this.handleDelete('back')
                                      : () =>
                                          deleteHealthInsuranceCard({
                                            variables: { sides: ['BACK'] },
                                          })
                                  }
                                  onPreview={
                                    back
                                      ? () => this.setImagePreview('back')
                                      : () =>
                                          this.setImagePreview(
                                            null,
                                            backImageUrl,
                                          )
                                  }
                                />
                              </View>
                            </View>
                          )}
                        </DeleteHealthInsuranceCard>
                      </View>
                      {!!imagePreview && (
                        <ImagePreview
                          file={imagePreview}
                          breakpoints={breakpoints}
                          viewport={viewport}
                          onClose={() => this.setState({ imagePreview: null })}
                        />
                      )}
                      {isDeleting && (
                        <SetRecommendationImportance
                          id={healthInsuranceRecommendation.id}
                        >
                          {({ setImportance }) => (
                            <DeleteHealthInsurance
                              onCompleted={() => {
                                this.handleDeleteInsuranceComplete(
                                  setImportance,
                                  healthInsuranceRecommendation.id,
                                  healthInsuranceRecommendation.needBasedImportance,
                                );
                                this.goTo('/plan/health/overview');
                              }}
                            >
                              {({ deleteHealthInsurance }) => (
                                <DeleteInsuranceConfirmationView
                                  deleteReason={deleteReason}
                                  viewport={viewport}
                                  onConfirm={deleteHealthInsurance}
                                  onCancel={() =>
                                    this.setState({ isDeleting: false })
                                  }
                                />
                              )}
                            </DeleteHealthInsurance>
                          )}
                        </SetRecommendationImportance>
                      )}
                    </Page>
                  )}
                </UpsertHealthInsurance>
              )}
            </UploadHealthInsuranceCard>
          )
        }
      </HealthInsurance>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  column: {
    width: '50%',
    maxWidth: columnWidth,
  },
  backImageWrapper: {
    marginTop: 32,
  },
  frontImageWrapper: {
    marginTop: 26,
  },
});

const withRedux = connect(
  state => ({
    isValid: isValid('WalletInputForm')(state),
    deleteReason: formValueSelector('DeleteInsuranceForm')(state, 'reason'),
  }),
  {
    submitForm: () => submit('WalletInputForm'),
  },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(WalletInputView);
Component.displayName = 'WalletInputView';

export default Component;
