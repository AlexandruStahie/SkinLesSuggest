import React from 'react';
import { Text, View } from 'react-native';
import styles from './style';
import { GoToHomeScreen } from '../../../navigation';
import { clearStore } from '../../utils/localStorage';
import CustomButton from '../../components/CustomButton';
import { get } from '../../utils/requests';

const Menu = () => {
  const logout = () => {
    clearStore();
    GoToHomeScreen();
  };

  const testAuth = () => {
    get('/User/testAuth');
  };

  const contentToRender = (
    <>
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
