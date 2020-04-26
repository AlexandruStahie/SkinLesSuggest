import React from 'react';
import { View, Text } from 'react-native';
import generalStyles from '../../generalStyle';

const ExtraInfo = ({
  infoLabel, onInfoPress, customInfoContainerStyle, customInfoButtonStyle
}) => {
  const contentToRender = (
    <>
      <View style={[generalStyles.infoContainer, customInfoContainerStyle || {}]}>
        <Text style={generalStyles.infoLabel}>
          {infoLabel}
        </Text>
        <Text
          style={[generalStyles.infoButton, customInfoButtonStyle || {}]}
          onPress={onInfoPress}
          hitSlop={{
            top: 20, bottom: 20, left: 50, right: 50
          }}
        >
          i
        </Text>
      </View>
    </>
  );

  return contentToRender;
};

export default ExtraInfo;
