import AsyncStorage from '@react-native-community/async-storage';

const storeData = async (objToStore) => {
  const objToStoreKeys = Object.keys(objToStore);
  const promises = [];

  objToStoreKeys.forEach((key) => {
    promises.push(AsyncStorage.setItem(key, objToStore[key]));
  });

  Promise.all(promises).then((values) => {
    console.log(values);
  });
};

// const getData = async (keys) => {
//   try {
//     const value = await AsyncStorage.getItem('@storage_Key');
//     if (value !== null) {
//       // value previously stored
//     }
//   } catch (e) {
//     // error reading value
//   }
// };

const clearStore = async () => {
  AsyncStorage.clear();
};

export {
  storeData,
  //   getData,
  clearStore
};
