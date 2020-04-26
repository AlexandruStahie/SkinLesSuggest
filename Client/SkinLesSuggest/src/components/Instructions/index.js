/* eslint-disable global-require */
import React from 'react';
import { View, Text, Image } from 'react-native';
import CustomButton from '../CustomButton';
import generalStyles from '../../generalStyle';

const Insutrctions = ({ onPressOk }) => {
  const contentToRender = (
    <>
      <View style={generalStyles.modalView}>
        <Text style={{ fontSize: 17, marginBottom: 10 }}>Instructions for better suggestions:</Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          Take clear pictures;
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          Frame the lesion well;
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          Use the custom zoom for a good fit;
          {' '}
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          Example image:
          {' '}
        </Text>
        <Image
          source={require('./example.jpg')}
          style={generalStyles.exampleImage}
          resizeMode="contain"
        />
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

export default Insutrctions;
