import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from './style';

const CustomDropDown = ({
  options, setField, name, value, defaultValue
}) => {
  const contentToRender = (
    <>
      <ModalDropdown
        style={styles.inputView}
        textStyle={[styles.inputText, value ? styles.blackInputText : styles.greyInputText]}
        dropdownStyle={[styles.dropdownStyle, options && options.length > 2 ? { height: 200 } : { height: 100 }]}
        dropdownTextStyle={styles.dropdownTextStyle}
        dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
        defaultValue={value || defaultValue}
        options={options}
        onSelect={(index, selectedValue) => setField(name, selectedValue)}
      />
    </>
  );

  return contentToRender;
};

export default CustomDropDown;
