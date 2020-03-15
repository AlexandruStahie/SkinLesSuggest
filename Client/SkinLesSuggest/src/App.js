/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './containers/Login';
import colors from './utils/colors';

// Debug Options
console.disableYellowBox = true;

// To see all the requests in the chrome Dev tools in the network tab.
const _XHR = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;
XMLHttpRequest = _XHR;

const App = () => (
  <>
    <View style={styles.container}>
      <Login />
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App;
