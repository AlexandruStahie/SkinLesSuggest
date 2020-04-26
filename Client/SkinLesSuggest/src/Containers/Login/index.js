import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style';
import generalStyles from '../../generalStyle';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { TestEmail } from '../../utils/regexs';
import { isNil } from '../../utils/functions';
import { post, setHeader } from '../../utils/requests';
import { GoToMenuScreen } from '../../../navigation';
import { storeToken } from '../../utils/localStorage';
import { colors } from '../../utils/consts';

const defaultErrors = {
  email: false,
  password: false,
};

const Login = ({ newEmail, newPass }) => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [dynamicValidate, setDynamicValidate] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);

  useEffect(() => {
    setEmail(newEmail || 'test@test.com');
    setPassword(newPass || 'test');
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

  const login = () => {
    if (dynamicValidate === false) { setDynamicValidate(true); }

    if (validateFields()) {
      const endpoint = '/User/authenticate';
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
            storeToken(response.token);
            console.log('response', response);
            setHeader('Authorization', `Bearer ${response.token}`);
            GoToMenuScreen();
            setIsLoading(false);
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

  const goToRegisterScreen = () => {
    Navigation.push('Login', {
      component: {
        name: 'Register',
      }
    });
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
      <Spinner
        visible={isLoading}
        overlayColor="rgba(255, 255, 255, 0.7)"
        color={colors.customGreen}
      />
      <View style={[generalStyles.containerBase, generalStyles.centerContainer]}>
        <Text style={generalStyles.logoBase}>SkinLesSuggest</Text>
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

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <CustomButton
          text="Login"
          onPress={login}
        />
        <TouchableOpacity>
          <Text style={styles.simpleText} onPress={goToRegisterScreen}>Register</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return contentToRender;
};

export default Login;
