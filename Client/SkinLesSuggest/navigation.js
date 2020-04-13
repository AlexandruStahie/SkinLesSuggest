/* eslint-disable global-require */
import { Navigation } from 'react-native-navigation';

const RegisterScreens = () => {
  Navigation.registerComponent('App', () => require('./src/App').default);
  Navigation.registerComponent('Home', () => require('./src/containers/Home').default);
  Navigation.registerComponent('Login', () => require('./src/containers/Login').default);
  Navigation.registerComponent('Register', () => require('./src/containers/Register').default);
  Navigation.registerComponent('Menu', () => require('./src/containers/Menu').default);
  Navigation.registerComponent('GetSuggestion', () => require('./src/containers/Form').default);
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
  },
  topBar: {
    // elevation: 0,
    visible: false,
    drawBehind: true,
    animate: false,
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
  },
  layout: {
    orientation: ['portrait']
  }
});

const GoToMenuScreen = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Menu'
          },
        }
      ],
    }
  },
  layout: {
    orientation: ['portrait']
  }
});

export {
  RegisterScreens,
  GoToHomeScreen,
  GoToMenuScreen
};
