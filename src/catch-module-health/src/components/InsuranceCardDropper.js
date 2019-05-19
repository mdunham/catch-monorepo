import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, Image, Text, View } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Dropzone } from '@catch/common';
import { colors, borderRadius, Icon, styles as st } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.InsuranceCardDropper';
export const COPY = {
  back: <FormattedMessage id={`${PREFIX}.back`} />,
  front: <FormattedMessage id={`${PREFIX}.front`} />,
  cardDescription: <FormattedMessage id={`${PREFIX}.cardDescription`} />,
};

const styles = StyleSheet.create({
  accept: {
    width: '100%',
    height: 164,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.fog,
    borderRadius: borderRadius.large,
    backgroundColor: colors.white,
  },
  touchable: {
    height: 164,
    borderWidth: 1,
    borderRadius: borderRadius.large,
    backgroundColor: colors.white,
    borderColor: colors.fog,
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: 160,
    borderRadius: borderRadius.regular,
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 12,
    paddingRight: 8,
    backgroundColor:
      'linear-gradient(180deg, rgba(31, 37, 51, 0.3) 60.98%, rgba(31, 37, 51, 0.75) 100%)',
  },
});

const textMap = {
  front: COPY['front'],
  back: COPY['back'],
};

const iconMap = {
  front: 'id-front',
  back: 'id-back',
};

class InsuranceCardDropper extends React.PureComponent {
  static propTypes = {
    file: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    handleDrop: PropTypes.func.isRequired,
    isPickerOpen: PropTypes.bool,
    viewport: PropTypes.string.isRequired,
    side: PropTypes.string.isRequired,
    onPreview: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  render() {
    const {
      file,
      handleDrop,
      isPickerOpen,
      viewport,
      side,
      onDelete,
      onPreview,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() => this.myRef.current.open()}
        disabled={Boolean(file) || isPickerOpen}
        style={st.get(['FullWidth', styles.touchable, file && styles.accept])}
      >
        <Dropzone
          style={st.get('FullWidth')}
          acceptStyle={styles.accept}
          accept="image/jpeg, image/png"
          onDrop={handleDrop}
          ref={this.myRef}
          disableClick
        >
          {file ? (
            <TouchableOpacity onPress={onPreview}>
              <Image
                source={{ uri: file.preview || file }}
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: borderRadius.regular,
                }}
              />
              <View style={styles.overlay}>
                <Icon
                  name="trash"
                  onClick={onDelete}
                  size={24}
                  dynamicRules={{
                    paths: { fill: colors.white, stroke: colors.white },
                  }}
                  fill={colors.white}
                  stroke={colors.white}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={st.get('CenterColumn')}>
              <Icon name={iconMap[side]} size={65} />
              <Text style={st.get(['FinePrint', 'Bold'], viewport)}>
                {textMap[side]}
              </Text>
              <Text
                style={st.get(
                  [
                    'SmTopGutter',
                    'FinePrint',
                    'SubtleText',
                    'CenterText',
                    { maxWidth: 130 },
                  ],
                  viewport,
                )}
              >
                {COPY['cardDescription']}
              </Text>
            </View>
          )}
        </Dropzone>
      </TouchableOpacity>
    );
  }
}

export default InsuranceCardDropper;
