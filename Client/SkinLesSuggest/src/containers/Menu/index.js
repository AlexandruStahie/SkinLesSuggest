import React, { useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import CustomButton from '../../components/CustomButton';
import generalStyles from '../../generalStyle';
import Loader from '../../components/Loader';
import { del, get } from '../../utils/requests';
import { logOutUser } from '../../utils/functions';

const Menu = ({ componentId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);
    logOutUser();
    setIsLoading(false);
  };

  // eslint-disable-next-line no-unused-vars
  const testAuth = () => {
    get('/User/testAuth');
  };

  const goToScreen = (screenName) => {
    Navigation.push(componentId, {
      component: {
        name: screenName,
        passProps: {
          logout
        }
      }
    });
  };

  const clearUserDetails = () => {
    setIsLoading(true);
    del('/UserDetails')
      .then((response) => {
        setIsLoading(false);
        if (response && response.data && response.data.message) {
          Alert.alert(
            response.data.message,
            'Thank you for using the SkinLesSuggest application',
            [{ text: 'Ok', onPress: () => { } }]
          );
        }
      });
  };

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <View style={[generalStyles.containerBase, generalStyles.centerContainer]}>
        <Text style={[generalStyles.logoBase, { marginBottom: 20 }]}>SkinLesSuggest</Text>

        <CustomButton
          text="Get Suggestion"
          onPress={() => goToScreen('GetSuggestion')}
        />

        <CustomButton
          text="History"
          onPress={() => goToScreen('History')}
        />

        <CustomButton
          text="Clear User Data"
          onPress={clearUserDetails}
        />

        <CustomButton
          text="Logout"
          onPress={logout}
        />

        {/* <CustomButton
          text="Test Auth"
          onPress={testAuth}
        /> */}
      </View>
    </>
  );

  return contentToRender;
};

export default Menu;
