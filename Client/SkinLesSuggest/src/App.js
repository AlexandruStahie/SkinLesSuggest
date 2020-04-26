/* eslint-disable global-require */
import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import jwtDecode from 'jwt-decode';
import { GoToHomeScreen, GoToMenuScreen } from '../navigation';
import { getData } from './utils/localStorage';
import { setHeader } from './utils/requests';
import generalStyle from './generalStyle';

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      redirectScreen();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const redirectScreen = () => {
    getData('token').then((token) => {
      if (token) {
        const decodedToken = jwtDecode(decodeURIComponent(token));
        const { exp } = decodedToken;
        if (exp >= new Date().getTime() / 1000) {
          setHeader('Authorization', `Bearer ${token}`);
          GoToMenuScreen();
        } else {
          GoToHomeScreen();
        }
      } else {
        GoToHomeScreen();
      }
    }).catch(() => {
      GoToHomeScreen();
    });
  };

  const contentToRender = (
    <>
      <View style={[generalStyle.containerBase, generalStyle.centerContainer]}>
        <Image
          source={require('../logo.png')}
          style={generalStyle.logoImage}
        />
        <Text style={generalStyle.splashTitle}>
          Skin Lesion Suggestions
        </Text>
      </View>
    </>
  );

  return contentToRender;
};

export default App;
