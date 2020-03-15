import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './style';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { TestEmail } from '../../utils/regexs';
import { isNil } from '../../utils/functions';
import { post } from '../../utils/requests';

const defaultErrors = {
  email: false,
  password: false,
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dynamicValidate, setDynamicValidate] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);

  useEffect(() => {
    if (dynamicValidate === true) {
      validateFields();
    }
  }, [email, password]);

  const login = () => {
    if (dynamicValidate === false) { setDynamicValidate(true); }

    if (validateFields()) {
      const endpoint = '/User/register';
      const userData = {
        email, password
      };

      post(endpoint, userData)
        .then((response) => response.data)
        .then((response) => {
          console.log('registerResponse: ', response);
        })
        .catch((err) => {
          console.log('registerError', err);
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

      <CustomButton
        text="Sign Up"
        onPress={login}
      />
    </>
  );

  return contentToRender;
};

export default Register;
