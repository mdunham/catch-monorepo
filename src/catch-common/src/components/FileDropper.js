import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import Dropzone from './Dropzone';
import {
  Box,
  Text,
  H4,
  colors,
  borderRadius,
  Icon,
  space,
  shadow,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.FileDropper';
export const COPY = {
  'plhTitle.desktop': <FormattedMessage id={`${PREFIX}.plhTitle.desktop`} />,
  'plhCaption.desktop': (
    <FormattedMessage id={`${PREFIX}.plhCaption.desktop`} />
  ),
  'plhTitle.mobile': <FormattedMessage id={`${PREFIX}.plhTitle.mobile`} />,
  deleteAction: <FormattedMessage id={`${PREFIX}.deleteAction`} />,
  replaceAction: <FormattedMessage id={`${PREFIX}.replaceAction`} />,
  encryptedCaption: <FormattedMessage id={`${PREFIX}.encryptedCaption`} />,
};

const styles = {
  base: {
    flex: 1,
  },
  accept: {
    width: '100%',
    height: 275,
    border: `1px solid ${colors.moss}`,
    borderRadius: borderRadius.large,
    backgroundColor: colors.white,
  },
};

const uploadStyles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: 265,
    borderWidth: 1,
    borderColor: colors.gray3,
    borderRadius: borderRadius.large,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  loaded: {
    borderWidth: 0,
    ...shadow.deep,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    borderTopRightRadius: borderRadius.large,
    borderTopLeftRadius: borderRadius.large,
    overflow: 'hidden',
  },
  containerActions: {
    height: 65,
  },
  textOverlay: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: 200,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: borderRadius.large,
    borderTopLeftRadius: borderRadius.large,
  },
  placeholder: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: 205,
    backgroundColor: 'black',
    borderTopRightRadius: borderRadius.large,
    borderTopLeftRadius: borderRadius.large,
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors['charcoal--light4'],
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const dropzoneRef = React.createRef();

export const FileDropper = ({
  file,
  handleDelete,
  handleDrop,
  breakpoints,
  onOpen,
  isPickerOpen,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={() => dropzoneRef.current.open()}
      disabled={Boolean(file) || isPickerOpen}
      style={[uploadStyles.touchable, !!file && uploadStyles.loaded]}
    >
      <Dropzone
        style={styles.base}
        activeStyle={styles.active}
        acceptStyle={styles.accept}
        accept="image/jpeg, image/png"
        onDrop={handleDrop}
        onOpen={onOpen}
        disableClick
        ref={dropzoneRef}
      >
        {file ? (
          <Fragment>
            <Box style={uploadStyles.container}>
              {file.type === 'application/pdf' ? (
                <Box style={uploadStyles.placeholder} />
              ) : (
                <Image
                  source={{ uri: file.preview }}
                  style={{ width: '100%', height: 200 }}
                />
              )}

              <Box style={uploadStyles.textOverlay} px={2}>
                <Icon name="gray-lock" fill={colors.grass} size={36} />
                <Text color="white" weight="medium" mt={1} size={24}>
                  {file.name.length > 12
                    ? file.name.substring(0, 12).concat('...')
                    : file.name}
                </Text>
                <Text color="white" size="large">
                  {COPY['encryptedCaption']}
                </Text>
              </Box>
            </Box>

            <Box row w={1} align="center" style={uploadStyles.containerActions}>
              <View style={uploadStyles.leftAction}>
                <Text
                  weight="medium"
                  color="wave"
                  onClick={() => {
                    dropzoneRef.current.open();
                  }}
                >
                  {COPY['replaceAction']}
                </Text>
              </View>
              <View style={uploadStyles.rightAction}>
                <Text weight="medium" color="fire" onClick={handleDelete}>
                  {COPY['deleteAction']}
                </Text>
              </View>
            </Box>
          </Fragment>
        ) : (
          <Box align="center" justify="center" mt={20}>
            <Icon name="photo-id" size={Platform.select({ web: 115 })} />
            {breakpoints.select({
              'PhoneOnly|TabletPortraitUp': (
                <H4 mt={Platform.select({ web: 0, default: 2 })}>
                  {COPY['plhTitle.mobile']}
                </H4>
              ),
              TabletLandscapeUp: (
                <React.Fragment>
                  <H4 mt={Platform.select({ web: 0, default: 2 })}>
                    {COPY['plhTitle.desktop']}
                  </H4>
                  <Text>{COPY['plhCaption.desktop']}</Text>
                </React.Fragment>
              ),
            })}
            {/* Keeping that in plain text if we decide to remove*/}
            <Text weight="medium" color={colors.gray3} pt={3}>
              JPEG or PNG files only
            </Text>
          </Box>
        )}
      </Dropzone>
    </TouchableOpacity>
  );
};

FileDropper.propTypes = {
  // the file to be uploaded
  file: PropTypes.object,
  // the function that handles the drop
  handleDrop: PropTypes.func.isRequired,
  // the function to call to delete
  handleDelete: PropTypes.func.isRequired,
};

export default FileDropper;
