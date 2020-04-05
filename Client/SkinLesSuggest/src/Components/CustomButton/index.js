import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './style';

const CustomTextInput = ({ text, onPress }) => {
  const contentToRender = (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </>
  );

  return contentToRender;
};

export default CustomTextInput;