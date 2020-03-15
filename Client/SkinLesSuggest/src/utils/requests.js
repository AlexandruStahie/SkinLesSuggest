/* eslint-disable consistent-return */
import axios from 'axios';
// import jwtDecode from 'jwt-decode';
// import idx from 'idx';

const localTest = true;

const getBaseUrl = () => {
  if (localTest === true) {
    return 'https://localhost:44388/api';
  }

  return 'https://skinlessuggest20200314062341.azurewebsites.net/api';
};

const instance = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' }
});
const parseErrors = (error) => error;

const handleErrors = (errors) => {
  console.log('errors: ', errors);
};

const setHeader = (headerName, headerValue) => {
  instance.defaults.headers.common[headerName] = headerValue;
};

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
};
