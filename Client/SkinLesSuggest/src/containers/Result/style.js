import { StyleSheet } from 'react-native';
import { colors } from '../../utils/consts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    fontWeight: 'bold',
    top: 0,
    fontSize: 40,
    color: colors.customGreen,
    marginBottom: 40,
    marginTop: 40
  },
});
