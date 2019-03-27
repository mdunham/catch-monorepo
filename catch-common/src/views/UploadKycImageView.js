import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FormattedMessage } from 'react-intl';
import S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk/global';
import { Platform, View } from 'react-native';
import {
  Box,
  Text,
  SplitLayout,
  Icon,
  withDimensions,
  colors,
  styles,
  Spinner,
} from '@catch/rio-ui-kit';
import {
  goTo,
  getParentRoute,
  navigationPropTypes,
  createLogger,
  Auth,
  Env,
} from '@catch/utils';
import { toastActions } from '@catch/errors';

import { UploadKycImage } from '../containers';
import { FileDropper, FlowLayout, SmallPageTitle } from '../components';

const Log = createLogger('upload-kyc-image-view');

const PREFIX = 'catch.plans.UploadKycImageView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
  validId: <FormattedMessage id={`${PREFIX}.validId`} />,
  'idType.one': <FormattedMessage id={`${PREFIX}.idType.one`} />,
  'idType.two': <FormattedMessage id={`${PREFIX}.idType.two`} />,
  'idType.three': <FormattedMessage id={`${PREFIX}.idType.three`} />,
  'disclaimer.one': <FormattedMessage id={`${PREFIX}.disclaimer.one`} />,
  'disclaimer.two': <FormattedMessage id={`${PREFIX}.disclaimer.two`} />,
  'toast.success.title': (
    <FormattedMessage id={`${PREFIX}.toast.success.title`} />
  ),
  'toast.success.description': (
    <FormattedMessage id={`${PREFIX}.toast.success.description`} />
  ),
  'toast.failure.title': (
    <FormattedMessage id={`${PREFIX}.toast.failure.title`} />
  ),
  'toast.failure.description': (
    <FormattedMessage id={`${PREFIX}.toast.failure.description`} />
  ),
};

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

export class UploadKycImageView extends Component {
  static propTypes = {
    viewport: PropTypes.string,
    ...navigationPropTypes,
  };

  static defaultProps = {
    moduleName: null,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getParentRoute = getParentRoute.bind(this);

    this.state = { file: null, isUploading: false };
  }
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

  handleDrop = file => {
    Log.debug(file);
    this.setState({ file: file[0] });
  };

  handleNext = ({ accepted }) => {
    const rootPath = this.getParentRoute();
    const { popToast } = this.props;

    if (accepted) {
      popToast({
        type: 'person',
        title: COPY['toast.success.title'],
        msg: COPY['toast.success.description'],
      });

      if (rootPath === '/plan') {
        // if id review is one-off
        this.goTo(['/plan']);
      } else {
        // if id review is in middle of setting up a vertical
        this.goTo([rootPath, '/regulatory']);
      }
    } else {
      popToast({
        title: COPY['toast.failure.title'],
        msg: COPY['toast.failure.description'],
      });
      Log.error('not accepted');
    }
  };

  /**
   * Gets the latest cognito credentials, instanciate the S3
   * create an upload promise and awaits the results from AWS
   * the callback posts the result to the api
   */
  handleAWS = async cb => {
    const { file } = this.state;
    try {
      this.setState({
        isUploading: true,
      });
      // 1) Get the cognito credentials
      const jwt = await Auth.getJWTToken();
      // 2) instanciate the S3 api
      const s3 = this._createS3(jwt);
      // 3) Map provided type to something our api can understand
      const fileType = fileTypes[file.type];
      // 4) Use the user's last name as an easy debug reference
      const user = await Auth.currentProviderUser();
      const attributes = await Auth.getUserAttributes(user);
      // 5) Append a nonce and filetype too
      const fileKey = `${attributes.familyName}-${Date.now()}.${fileType}`;
      // prep the payload cross platform changes
      const payload = Object.assign(
        {
          Key: fileKey,
          ACL: 'private',
          ServerSideEncryption: 'AES256',
        },
        Platform.select({
          web: {
            Body: file,
          },
          default: {
            Body: file.data,
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
      Log.debug(result);
      this.setState({
        isUploading: false,
        file: null,
      });
      // 8) Post the result to the api
      const apiResp = await cb({
        variables: {
          imageKey: fileKey,
          filetype: fileType,
        },
      });
      Log.debug(apiResp);
      // 9) Redirect to the next screen
      this.handleNext({
        accepted: apiResp.data.uploadIdentificationImage.accepted,
      });
    } catch (e) {
      Log.error(e);
      this.setState({
        isUploading: false,
      });
    }
  };

  handleDelete = () => {
    this.setState({ file: null });
  };
  render() {
    const { viewport, breakpoints } = this.props;

    const rootPath = this.getParentRoute();

    return (
      <UploadKycImage>
        {({ uploadKycImage, loading }) => (
          <FlowLayout
            onNext={() => this.handleAWS(uploadKycImage)}
            canClickNext={!!this.state.file}
            isLoading={loading || this.state.isUploading}
            nextButtonText={rootPath === '/plan' && 'Submit'}
          >
            <View
              style={styles.get(
                ['FullWidth', 'Margins', 'PageWrapper', 'BottomGutter'],
                viewport,
              )}
            >
              <SmallPageTitle>{COPY['title']}</SmallPageTitle>
              <Box screen={viewport} w={[1, 1, 1 / 2]} mb={4}>
                <Text>{COPY['description']}</Text>
              </Box>
              <SplitLayout type="master">
                {this.state.isUploading ? (
                  <Box w={1} p={4} align="center">
                    <Spinner large />
                  </Box>
                ) : (
                  <FileDropper
                    file={this.state.file}
                    handleDrop={this.handleDrop}
                    handleDelete={this.handleDelete}
                    handleUpload={uploadKycImage}
                    breakpoints={breakpoints}
                    isPickerOpen={this.state.isPickerOpen}
                    onOpen={this.toggleOpen}
                  />
                )}

                <Box mt={1}>
                  <Text mb={1} weight="medium">
                    {COPY['validId']}
                  </Text>
                  <Text mb={1}>{COPY['idType.one']}</Text>
                  <Text mb={1}>{COPY['idType.two']}</Text>
                  <Text mb={1}>{COPY['idType.three']}</Text>
                  <Box mt={3}>
                    <Box row>
                      <Box mt={4.5}>
                        <Icon size={12} name="gray-lock" fill={colors.gray3} />
                      </Box>
                      <Text ml={1}>{COPY['disclaimer.one']}</Text>
                    </Box>
                    <Box row mt={1}>
                      <Box mt={4.5}>
                        <Icon size={12} name="human-semicircle" />
                      </Box>
                      <Text ml={1}>{COPY['disclaimer.two']}</Text>
                    </Box>
                  </Box>
                </Box>
              </SplitLayout>
            </View>
          </FlowLayout>
        )}
      </UploadKycImage>
    );
  }
}

const withRedux = connect(
  undefined,
  toastActions,
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(UploadKycImageView);
