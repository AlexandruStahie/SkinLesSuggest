import React from 'react';
import { Text, View, Image } from 'react-native';
import moment from 'moment';
import CustomButton from '../../components/CustomButton';
import styles from './style';
import generalStyles from '../../generalStyle';

const HistoryDetails = ({ detailsHistory, attachImage, closeModal }) => {
  const localAttachImage = () => {
    if (detailsHistory && detailsHistory.length > 0 && detailsHistory[0] && detailsHistory[0].suggestion) {
      attachImage(detailsHistory[0].suggestion);
    }
  };

  return (
    <View style={generalStyles.modalView}>
      <Text style={[generalStyles.modalTitle, { marginBottom: 10, fontSize: 20 }]}>Lesion Details</Text>
      <View style={{ justifyContent: 'flex-start' }}>
        {
        detailsHistory && detailsHistory.length > 0
          ? detailsHistory.map((element) => (
            <View key={element.id} style={styles.historyDetailsListContainer}>
              <Text style={styles.historyDetailsText}>{`Suggestion: ${element.suggestion}`}</Text>
              <Text style={styles.historyDetailsText}>{`Suggestion date: ${moment(element.createdOn).format('DD/MM/YYYY, HH:mm:ss')}`}</Text>
              <Image
                source={{ uri: `data:image/jpeg;base64,${element.image}` }}
                style={[generalStyles.image, { marginTop: 10 }]}
                resizeMode="contain"
              />
            </View>
          )) : <Text style={styles.noHistoryMessage}>No details available</Text>
      }
      </View>

      <CustomButton
        customStyle={[generalStyles.okCustomButton, { width: '90%', height: 40 }]}
        text="Check suggestion again"
        onPress={localAttachImage}
      />
      <CustomButton
        customStyle={[generalStyles.okCustomButton, { width: '90%', height: 40 }]}
        text="Cancel"
        onPress={closeModal}
      />
    </View>
  );
};

export default HistoryDetails;
