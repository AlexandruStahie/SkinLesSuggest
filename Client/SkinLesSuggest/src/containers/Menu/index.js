import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { GoToHomeScreen } from '../../../navigation';
import { clearStore } from '../../utils/localStorage';
import CustomButton from '../../components/CustomButton';
import { get } from '../../utils/requests';
import generalStyles from '../../generalStyle';
import Loader from '../../components/Loader';

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
      {isLoading && <Loader />}
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
