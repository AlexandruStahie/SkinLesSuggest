import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style';
import colors from '../../utils/colors';
import { GoToHomeScreen } from '../../../navigation';
import { clearStore } from '../../utils/localStorage';
import CustomButton from '../../components/CustomButton';
import { get } from '../../utils/requests';

const Menu = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const logout = () => {
    setIsLoading(true);
    clearStore();
    GoToHomeScreen();
    setIsLoading(false);
  };

  const testAuth = () => {
    get('/User/testAuth');
  };

  const contentToRender = (
    <>
      <Spinner
        visible={isLoading}
        overlayColor="rgba(255, 255, 255, 0.7)"
        color={colors.customGreen}
      />
      <View style={styles.container}>
        <Text style={styles.logo}>SkinLesSuggest</Text>

        <CustomButton
          text="Logout"
          onPress={logout}
        />

        {/* test Auth */}
        <CustomButton
          text="Test Auth"
          onPress={testAuth}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default Menu;
