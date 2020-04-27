import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from './style';

const CustomDropDown = ({
  options, setField, name, value, defaultValue
}) => {
  let valueSelected = false;
  const findValueInOptions = options.filter((el) => el === value);
  if (findValueInOptions && findValueInOptions.length > 0) {
    valueSelected = true;
  }

  const contentToRender = (
    <>
      <ModalDropdown
        style={styles.inputView}
        textStyle={[styles.inputText, valueSelected ? styles.blackInputText : styles.greyInputText]}
        dropdownStyle={[styles.dropdownStyle, options && options.length > 2 ? { height: 200 } : { height: 100 }]}
        dropdownTextStyle={styles.dropdownTextStyle}
        dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
        defaultValue={valueSelected ? value : defaultValue}
        options={options}
        onSelect={(index, selectedValue) => setField(name, selectedValue)}
      />
    </>
  );

  return contentToRender;
};

export default CustomDropDown;
