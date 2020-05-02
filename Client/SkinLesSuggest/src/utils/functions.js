/* eslint-disable import/no-cycle */
import { setHeader, removeHeader } from './requests';
import { storeToken, clearStore } from './localStorage';
import { GoToMenuScreen, GoToHomeScreen } from '../../navigation';

export const isNil = (value) => value === undefined && value === null;

export const compareObjects = (val, freezVal) => {
  try {
    if (val.trim() !== freezVal.trim()) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const logInUser = (token) => {
  storeToken(token);
  setHeader(token);
  GoToMenuScreen();
};

export const logOutUser = () => {
  clearStore();
  removeHeader();
  GoToHomeScreen();
};
