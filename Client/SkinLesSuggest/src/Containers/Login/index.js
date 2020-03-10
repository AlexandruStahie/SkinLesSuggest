import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './style';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { TestEmail } from '../../utils/regexs';
import { isNil } from '../../utils/functions';

const defaultErrors = {
  email: false,
  password: false,
};

const Login = () => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test');
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
      console.log('Email: ', email);
      console.log('Password: ', password);
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

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <CustomButton
        text="LOGIN"
        onPress={login}
      />
      <TouchableOpacity>
        <Text style={styles.simpleText}>Signup</Text>
      </TouchableOpacity>
    </>
  );

  return contentToRender;
};

export default Login;
