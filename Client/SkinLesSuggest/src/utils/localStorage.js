import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';

const storeToken = async (token) => {
  const decodedToken = jwtDecode(decodeURIComponent(token));
  const promises = [];

  promises.push(AsyncStorage.setItem('token', token));
  promises.push(AsyncStorage.setItem('id', decodedToken.nameid));
  promises.push(AsyncStorage.setItem('email', decodedToken.email));

  Promise.all(promises);
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    return null;
  }
};

const clearStore = async () => {
  AsyncStorage.clear();
};

export {
  storeToken,
  getData,
  clearStore
};
