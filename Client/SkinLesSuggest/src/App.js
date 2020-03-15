/* eslint-disable global-require */
import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import jwtDecode from 'jwt-decode';
import { GoToHomeScreen, GoToMenuScreen } from '../navigation';
import { getData } from './utils/localStorage';
import { setHeader } from './utils/requests';
import colors from './utils/colors';

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      redirectScreen();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const redirectScreen = () => {
    console.log('test');
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
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../logo.png')}
          style={{ width: 100, height: 100 }}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 35,
            textAlign: 'center',
            justifyContent: 'center',
            color: colors.customGreen,
            marginBottom: 40,
            marginTop: 15
          }}
        >
          Skin Lesion Suggestions
        </Text>
      </View>
    </>
  );

  return contentToRender;
};

export default App;
