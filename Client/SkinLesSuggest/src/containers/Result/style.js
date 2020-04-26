import { StyleSheet } from 'react-native';
import { colors } from '../../utils/consts';

export default StyleSheet.create({
  legend: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checkLegend: {
    fontSize: 18,
    width: '90%',
  },
  iDispaly: {
    fontSize: 18,
    width: '10%',
    borderRadius: 50,
    borderWidth: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.customBlue
  },
});
