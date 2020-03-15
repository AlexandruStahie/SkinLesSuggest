import React, { useEffect } from 'react';
import { Text } from 'react-native';
import jwtDecode from 'jwt-decode';
import { GoToHomeScreen, GoToMenuScreen } from '../navigation';
import { getData } from './utils/localStorage';
import { setHeader } from './utils/requests';

const App = () => {
  useEffect(() => {
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
  }, []);

  const contetnToRender = (
    <>
      <Text>Loading</Text>
    </>
  );
  return contetnToRender;
};

export default App;
