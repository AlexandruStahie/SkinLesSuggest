import React from 'react';
import { Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import styles from './style';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';

const Home = ({ componentId }) => {
  const goToScreen = (screenName) => {
    Navigation.push(componentId, {
      component: {
        name: screenName
      }
    });
  };

  const goToRegister = () => {
    Navigation.push(componentId, {
      component: {
        name: 'Register',
        passProps: {
          goToLoginScreen
        }
      }
    });
  };

  const goToLoginScreen = (email, pass) => {
    Navigation.push(componentId, {
      component: {
        name: 'Login',
        passProps: {
          newEmail: email,
          newPass: pass,
        }
      },
    });
  };

  const contentToRender = (
    <>
      <View style={[generalStyles.containerBase, generalStyles.centerContainer]}>
        <Text style={generalStyles.logoBase}>SkinLesSuggest</Text>

        <CustomButton
          text="Get Suggestion"
          onPress={() => goToScreen('GetSuggestion')}
        />
        <CustomButton
          text="Login"
          onPress={() => goToScreen('Login')}
        />
        <CustomButton
          text="Register"
          onPress={goToRegister}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default Home;
