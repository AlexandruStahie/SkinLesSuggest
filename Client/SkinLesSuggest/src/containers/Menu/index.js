import React, { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import jwtDecode from 'jwt-decode';
import { GoToHomeScreen } from '../../../navigation';
import { clearStore, getData } from '../../utils/localStorage';
import CustomButton from '../../components/CustomButton';
import generalStyles from '../../generalStyle';
import Loader from '../../components/Loader';
import { del } from '../../utils/requests';

const Menu = ({ componentId }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const logout = () => {
    setIsLoading(true);
    clearStore();
    GoToHomeScreen();
    setIsLoading(false);
  };

  // const testAuth = () => {
  //   get('/User/testAuth');
  // };

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

  const clearUserData = () => {
    setIsLoading(true);
    getData('token')
      .then((token) => {
        if (token) {
          const decodedToken = jwtDecode(decodeURIComponent(token));
          const { exp, nameid } = decodedToken;
          if (exp >= new Date().getTime() / 1000) {
            del(`/User/userDetails/${nameid}`)
              .then((response) => {
                setIsLoading(false);
                console.log('message', response);
                if (response && response.data && response.data.message) {
                  Alert.alert(
                    response.data.message,
                    'Thank you for using the SkinLesSuggest application',
                    [{ text: 'Ok', onPress: () => { } }]
                  );
                }
              });
          } else {
            logout();
            setIsLoading(false);
          }
        }
      })
      .catch(() => {
        logout();
        setIsLoading(false);
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
          onPress={clearUserData}
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
