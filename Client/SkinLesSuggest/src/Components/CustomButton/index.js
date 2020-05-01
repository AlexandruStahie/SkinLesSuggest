import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './style';

const CustomTextInput = ({
  text, onPress, customStyle, customTextStyle
}) => {
  const contentToRender = (
    <>
      <TouchableOpacity
        style={customStyle ? [styles.button, customStyle] : styles.button}
        onPress={onPress}
      >
        <Text
          style={customTextStyle ? [styles.buttonText, customTextStyle] : styles.buttonText}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </>
  );

  return contentToRender;
};

export default CustomTextInput;
