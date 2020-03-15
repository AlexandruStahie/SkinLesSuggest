import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { GoToHomeScreen } from '../navigation';

const App = () => {
  useEffect(() => {
    /*
      // check if async storage has token and is not expired
      if (all ok){
        GoToLoggedInHomeScreen()
      } else {
        GoToHomeScreen()
      }
    */
    GoToHomeScreen();
  }, []);

  const contetnToRender = (
    <>
      <Text>Loading</Text>
    </>
  );
  return contetnToRender;
};

export default App;
