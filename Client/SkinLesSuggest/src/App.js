import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './Containers/Login';
import colors from './utils/colors';

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
