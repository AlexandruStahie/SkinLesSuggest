import AsyncStorage from '@react-native-community/async-storage';

const storeToken = async (token) => {
  const promises = [];
  promises.push(AsyncStorage.setItem('token', token));
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
