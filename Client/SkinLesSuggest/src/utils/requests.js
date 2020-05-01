/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { getData } from './localStorage';
import { logOutUser } from './functions';

const localTest = true;
const getBaseUrl = () => {
  if (localTest === true) {
    return 'https://localhost:44388/api';
  }

  return 'https://skinlessuggest20200314062341.azurewebsites.net/api';
};

const instance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 1800000,
  headers: { 'Content-Type': 'application/json' }
});

const parseErrors = (error) => error;

const handleErrors = (errors) => {
  console.log('request errors: ', errors);

  getData('token')
    .then((token) => {
      if (token) {
        console.log('token found');
        const decodedToken = jwtDecode(decodeURIComponent(token));
        const { exp } = decodedToken;
        if (exp < new Date().getTime() / 1000) {
          console.log('token expired');
          return logOutUser();
        }
      }
    }).catch(() => {
      console.log('token find error');
      logOutUser();
    });
};

const setHeader = (headerValue) => {
  instance.defaults.headers.common.Authorization = `Bearer ${headerValue}`;
};

const removeHeader = () => {
  instance.defaults.headers.common.Authorization = null;
};

const getHeader = () => instance.defaults.headers.common.Authorization;

const post = async (url, data, config) => {
  try {
    const response = await instance.post(url, data, config || {});
    return response;
  } catch (error) {
    handleErrors(error);
    throw (parseErrors(error));
  }
};

const get = async (url, config) => {
  try {
    const response = await instance.get(url, config || {});
    return response;
  } catch (error) {
    handleErrors(error);
    throw (parseErrors(error));
  }
};

const del = async (url) => {
  try {
    const response = await instance.delete(url);
    return response;
  } catch (error) {
    handleErrors(error);
    throw (parseErrors(error));
  }
};

export {
  instance,
  post,
  get,
  del,
  setHeader,
  removeHeader,
  getHeader
};
