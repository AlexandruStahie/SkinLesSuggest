/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import styles from './style';
import { colors } from '../../utils/consts';

const CustomTextInput = ({
  showError, value, placeholder, name, setField, secureTextEntry, type
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const contentToRender = (
    <>
      <View style={{
        ...styles.inputView,
        borderColor: showError && showError[`${name}`] ? colors.red : (isFocused ? colors.customGreen : colors.black),
        borderWidth: isFocused ? 1.5 : 0.3,
      }}
      >
        <TextInput
          keyboardType={type || null}
          secureTextEntry={secureTextEntry}
          value={value}
          name={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={colors.grey}
          onChange={(event) => setField(name, event.nativeEvent.text)}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default CustomTextInput;
