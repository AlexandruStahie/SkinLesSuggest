import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../CustomButton';
import generalStyles from '../../generalStyle';

const Disclaimer = ({ onPressOk }) => {
  const contentToRender = (
    <>
      <View style={generalStyles.modalView}>
        <Text style={generalStyles.modalTitle}>Disclaimer</Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          Please notice that the application offers only suggestions regarding the categorization of your injuries.
        </Text>
        <Text style={[generalStyles.instrBullet, { marginTop: 10 }]}>
          {'\u25CF'}
          {' '}
          {' '}
          The received result is not a real diagnostic, just an suggestion. For a valid diagnostic please contact a medic.
        </Text>
        <CustomButton
          customStyle={generalStyles.okCustomButton}
          text="Ok"
          onPress={onPressOk}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default Disclaimer;
