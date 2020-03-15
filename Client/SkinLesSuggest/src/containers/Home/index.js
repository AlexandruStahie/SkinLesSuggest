import React from 'react';
import { Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import styles from './style';
import CustomButton from '../../components/CustomButton';

const Home = ({ componentId }) => {
  const goToScreen = (screenName) => {
    Navigation.push(componentId, {
      component: {
        name: screenName,
        options: {
          topBar: {
            title: {
              text: screenName
            }
          }
        }
      }
    });
  };

  const contentToRender = (
    <>
      <View style={styles.container}>
        <Text style={styles.logo}>SkinLesSuggest</Text>

        {/* <CustomButton
          text="Get Suggestion"
          onPress={() => goToScreen('GetSuggestion')}
        /> */}
        <CustomButton
          text="Login"
          onPress={() => goToScreen('Login')}
        />
        <CustomButton
          text="Register"
          onPress={() => goToScreen('Register')}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default Home;
