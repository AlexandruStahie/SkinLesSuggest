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
  },
  inputText: {
    height: 50,
    color: colors.black,
    fontSize: 16
  },
});
