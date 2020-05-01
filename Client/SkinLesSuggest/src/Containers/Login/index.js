import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import generalStyles from '../../generalStyle';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { TestEmail } from '../../utils/regexs';
import { isNil, logInUser } from '../../utils/functions';
import { post } from '../../utils/requests';
import Loader from '../../components/Loader';

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
            logInUser(response);
            setIsLoading(false);
          }
        })
        .catch(() => {
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
      {isLoading && <Loader />}
      <View style={[generalStyles.containerBase, generalStyles.centerContainer]}>
        <Text style={generalStyles.logoBase}>SkinLesSuggest</Text>
        <CustomTextInput
          showError={errors}
          value={email}
          name="email"
          placeholder="Email"
          type="email-address"
          setField={setField}
        />
        <CustomTextInput
          showError={errors}
          value={password}
          name="password"
          placeholder="Password"
          setField={setField}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={generalStyles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={generalStyles.errorMessage}>{errorMessage}</Text>
        <CustomButton
          text="Login"
          onPress={login}
        />
        <TouchableOpacity>
          <Text onPress={goToRegisterScreen}>Register</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return contentToRender;
};

export default Login;
