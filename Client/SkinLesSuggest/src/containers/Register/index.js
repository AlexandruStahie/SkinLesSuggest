import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { TestEmail } from '../../utils/regexs';
import { colors } from '../../utils/consts';
import { isNil } from '../../utils/functions';
import { post } from '../../utils/requests';

const defaultErrors = {
  email: false,
  password: false,
};

const Register = ({ componentId, goToLoginScreen }) => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [dynamicValidate, setDynamicValidate] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);

  useEffect(() => {
    setEmail('test@test.com');
    setPassword('test');
    setErrorMessage('');
    setDynamicValidate(false);
    setErrors(defaultErrors);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (dynamicValidate === true) {
      validateFields();
    }
  }, [email, password]);

  const register = () => {
    if (dynamicValidate === false) {
      setDynamicValidate(true);
    }

    if (validateFields()) {
      const endpoint = '/User/register';
      const userData = {
        email, password
      };

      setIsLoading(true);
      post(endpoint, userData)
        .then((response) => response.data)
        .then((response) => {
          if (response && response.error && response.message) {
            setErrorMessage(response.message);
            setIsLoading(false);
          } else {
            Navigation.pop(componentId);
            if (goToLoginScreen) {
              goToLoginScreen(email, password);
              setIsLoading(false);
            } else {
              setIsLoading(false);
            }
          }
        })
        .catch((err) => {
          console.log('registerError', err);
          const errorMsg = 'Something went wrong, please try again!';
          setErrorMessage(errorMsg);
          setIsLoading(false);
        });
    }
  };

  const setField = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const validateFields = () => {
    let isValid = true;
    const fieldErrors = { ...defaultErrors };

    if (isNil(email) || email.trim().length === 0 || TestEmail(email) === false) {
      isValid = false;
      fieldErrors.email = true;
    }
    if (isNil(password) || password.trim().length === 0) {
      isValid = false;
      fieldErrors.password = true;
    }

    setErrors(fieldErrors);
    return isValid;
  };

  const contentToRender = (
    <>
      <View style={styles.container}>
        <Spinner
          visible={isLoading}
          overlayColor="rgba(255, 255, 255, 0.7)"
          color={colors.customGreen}
        />
        <Text style={styles.logo}>SkinLesSuggest</Text>
        <CustomTextInput
          showError={errors}
          value={email}
          name="email"
          placeholder="Email..."
          setField={setField}
        />
        <CustomTextInput
          showError={errors}
          value={password}
          name="password"
          placeholder="Password..."
          setField={setField}
          secureTextEntry
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        <CustomButton
          text="Register"
          onPress={register}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default Register;