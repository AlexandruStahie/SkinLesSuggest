import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style';
import { colors } from '../../utils/consts';
import { GoToHomeScreen } from '../../../navigation';
import { clearStore } from '../../utils/localStorage';
import CustomButton from '../../components/CustomButton';
import { get } from '../../utils/requests';
import generalStyles from '../../generalStyle';

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
      <View style={[generalStyles.containerBase, generalStyles.centerContainer]}>
        <Text style={generalStyles.logoBase}>SkinLesSuggest</Text>

        <CustomButton
          text="Logout"
          onPress={logout}
        />

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
