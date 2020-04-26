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

  // SPLASHS SCREEN
  logoImage: {
    width: 100,
    height: 100
  },
  splashTitle: {
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
    justifyContent: 'center',
    color: colors.customGreen,
    marginBottom: 40,
    marginTop: 15
  },

  // MODAL
  modalTitle: {
    fontSize: 17,
    marginBottom: 10
  },
  modalSubtitle: {
    textAlign: 'left',
    fontSize: 15,
    marginBottom: 10
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

  // BULLET LIST-VIEW
  instrBullet: {
    marginLeft: 15,
    alignSelf: 'flex-start',
    fontSize: 15
  },

  // IMAGES
  exampleImage: {
    marginTop: 10,
    width: Dimensions.get('window').width - 50,
    height: 180,
  },
  image: {
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width - 20,
    height: 200,
  },

  // INFO CONTAINER
  infoContainer: {
    width: '80%',
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 18,
    width: '90%',
  },
  infoButton: {
    fontSize: 18,
    width: '10%',
    borderRadius: 50,
    borderWidth: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.customBlue
  },

  // LOGIN/REGISTER
  forgot: {
    color: colors.black,
    fontSize: 11
  },
  errorMessage: {
    color: colors.red,
    fontSize: 15
  }
});
