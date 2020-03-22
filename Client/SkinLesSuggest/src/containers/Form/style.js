import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../utils/colors';

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

  image: {
    marginTop: 20,
    width: Dimensions.get('window').width - 50,
    height: 180,
  }
});
