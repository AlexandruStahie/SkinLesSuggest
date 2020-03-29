/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import { Navigation } from 'react-native-navigation';
import { RegisterScreens } from './navigation';

console.disableYellowBox = true;

// To see all the requests in the chrome Dev tools in the network tab.
const _XHR = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;
XMLHttpRequest = _XHR;

RegisterScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'App'
      },
    }
  });
});
