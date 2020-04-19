import { StyleSheet, Dimensions } from 'react-native';
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
  image: {
    marginTop: 20,
    width: Dimensions.get('window').width - 50,
    height: 180,
  },
  instructions: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checkInstr: {
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
  modalView: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  okCustomButton: {
    marginTop: 20,
    marginBottom: 1,
    height: 30,
    width: '20%',
    justifyContent: 'center',
  },
  instrBullet: {
    marginLeft: 15, alignSelf: 'flex-start', fontSize: 15
  }
});
