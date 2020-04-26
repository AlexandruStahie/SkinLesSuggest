/* eslint-disable global-require */
import React from 'react';
import { View, Text, Image } from 'react-native';
import CustomButton from '../CustomButton';
import generalStyles from '../../generalStyle';

const ModalInfo = ({
  title, subtitle, infoList, hasImage, onPressOk
}) => {
  let infoListElements = [];
  if (infoList) {
    infoListElements = infoList.map((element) => (
      <Text
        key={element.key}
        style={[generalStyles.instrBullet, element.extraStyle || {}]}
      >
        {'\u25CF    '}
        {element.text}
      </Text>
    ));
  }

  const subTitle = subtitle ? (
    <Text style={generalStyles.modalSubtitle}>
      {subtitle}
    </Text>
  ) : null;

  const image = hasImage ? (
    <Image
      source={require('./example.jpg')}
      style={generalStyles.image}
      resizeMode="contain"
    />
  ) : null;

  const contentToRender = (
    <>
      <View style={generalStyles.modalView}>
        <Text style={generalStyles.modalTitle}>{title}</Text>

        {subTitle}
        {infoListElements}
        {image}

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

export default ModalInfo;
