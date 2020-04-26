import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './utils/consts';

export default StyleSheet.create({

  // CONTAINER
  containerBase: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
  },
  leftContainer: {
    justifyContent: 'flex-start',
  },

  // LOGO
  logoBase: {
    fontWeight: 'bold',
    fontSize: 40,
    color: colors.customGreen,
    marginBottom: 40
  },
  logoMarginTop: {
    marginTop: 40
  },
  logoImage: {
    width: 100,
    height: 100
  },

  // MODAL
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

  // BULLET LIST-VIEW
  instrBullet: {
    marginLeft: 15,
    alignSelf: 'flex-start',
    fontSize: 15
  },

  // INSTRUCTIONS IMAGE EXAMPLE
  exampleImage: {
    marginTop: 10,
    width: Dimensions.get('window').width - 50,
    height: 180,
  },
});
