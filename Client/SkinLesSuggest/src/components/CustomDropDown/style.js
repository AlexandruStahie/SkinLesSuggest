import { StyleSheet } from 'react-native';
import { colors } from '../../utils/consts';

export default StyleSheet.create({
  inputView: {
    width: '80%',
    backgroundColor: colors.white,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 25,
    borderColor: colors.black,
    borderWidth: 0.3,
  },
  inputText: {
    fontSize: 16,
  },
  blackInputText: {
    color: colors.black
  },
  greyInputText: {
    color: colors.grey
  },
  dropdownStyle: {
    width: '67%',
    marginTop: 10,
    backgroundColor: colors.white,
  },
  dropdownTextHighlightStyle: {
    color: colors.black
  },
  dropdownTextStyle: {
    fontSize: 16,
    height: 50,
    color: colors.grey
  },
});
