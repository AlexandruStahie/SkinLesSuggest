import { StyleSheet } from 'react-native';
import colors from '../../utils/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    color: colors.customGreen,
    marginBottom: 40
  },
  forgot: {
    color: colors.black,
    fontSize: 11
  },
  simpleText: {
    color: colors.black,
  }
});
