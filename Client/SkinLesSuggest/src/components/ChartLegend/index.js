import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../CustomButton';
import generalStyles from '../../generalStyle';

const ChartLegend = ({ onPressOk }) => {
  const contentToRender = (
    <>
      <View style={generalStyles.modalView}>
        <Text style={generalStyles.modalTitle}>Chart Legend</Text>
        <Text style={generalStyles.modalSubtitle}>
          This chart display the app suggestion, alongside of all other types of injuries that can be identified by the application.
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          akiec - Actinic keratoses
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          bcc - Basal cell carcinoma
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          bkl - Benign keratosis-like lesions
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          df - Dermatofibroma
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          nv - Melanocytic nevi
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          mel - Melanoma
        </Text>
        <Text style={generalStyles.instrBullet}>
          {'\u25CF'}
          {' '}
          {' '}
          {' '}
          vasc - Vascular lesions
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

export default ChartLegend;
