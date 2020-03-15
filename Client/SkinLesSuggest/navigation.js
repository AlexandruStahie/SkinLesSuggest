/* eslint-disable global-require */
import { Navigation } from 'react-native-navigation';

const RegisterScreens = () => {
  Navigation.registerComponent('App', () => require('./src/App').default);
  Navigation.registerComponent('Home', () => require('./src/containers/Home').default);
  Navigation.registerComponent('Login', () => require('./src/containers/Login').default);
  Navigation.registerComponent('Register', () => require('./src/containers/Register').default);
};

Navigation.setDefaultOptions({
  animations: {
    setRoot: {
      enabled: 'false'
    },
    push: {
      enabled: 'false'
    },
    pop: {
      enabled: 'false'
    }
  }
});

const GoToHomeScreen = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Home'
          },
        }
      ],
    }
  }
});

export {
  RegisterScreens,
  GoToHomeScreen
};
