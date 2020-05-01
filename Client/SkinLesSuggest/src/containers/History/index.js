import React, { useEffect, useState } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity, Image
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import generalStyles from '../../generalStyle';
import styles from './style';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { get } from '../../utils/requests';

const History = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [historyList, setHistoryList] = useState([]);
  const [detailsHistory, setDetailsHistory] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    get('/Lesion')
      .then((res) => {
        setHistoryList(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const showMoreDetails = (lesionId) => {
    setIsLoading(true);
    get(`/Lesion/${lesionId}`)
      .then((res) => {
        setShowDetailsModal(true);
        setDetailsHistory(res.data);
        setIsLoading(false);
      }).catch(() => {
        setShowDetailsModal(true);
        setDetailsHistory([]);
        setIsLoading(false);
      });
  };

  const historyListToShow = historyList.map((element) => (
    <View key={element.id} style={styles.historyListContainer}>
      <Text style={styles.lesionName}>
        {element.name}
      </Text>
      <Text style={styles.lesionLocalization}>
        {' Localization: '}
        {element.localization}
      </Text>
      <TouchableOpacity onPress={() => showMoreDetails(element.id)}>
        <Text style={styles.link}>
          {'Show More Details '}
        </Text>
      </TouchableOpacity>
    </View>
  ));

  const historyDetails = detailsHistory.map((el) => (
    <View style={styles.historyDetailsListContainer}>
      <Text style={styles.historyDetailsText}>{`Suggestion: ${el.suggestion}`}</Text>
      <Text style={styles.historyDetailsText}>{`Suggestion date: ${moment(el.createdOn).format('d/MM/YYYY, HH:mm:ss')}`}</Text>
      <Image
        source={{ uri: `data:image/jpeg;base64,${el.image}` }}
        style={[generalStyles.image, { marginTop: 10 }]}
        resizeMode="contain"
      />
    </View>
  ));

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <View style={generalStyles.containerBase}>
        <ScrollView style={{ flex: 1 }}>
          <View style={[generalStyles.containerBase, generalStyles.leftContainer]}>
            <Text style={[generalStyles.logoBase, generalStyles.logoMarginTop]}>SkinLesSuggest</Text>
          </View>

          <View style={{ justifyContent: 'flex-start' }}>
            {
                historyList.length > 0 ? (
                  historyListToShow
                ) : <Text style={{ justifyContent: 'center', textAlign: 'center' }}>No history data available</Text>
            }
          </View>
        </ScrollView>
      </View>

      <Modal
        onBackdropPress={() => setShowDetailsModal(false)}
        isVisible={showDetailsModal}
      >
        <View style={generalStyles.modalView}>
          <Text style={[generalStyles.modalTitle, { marginBottom: 10, fontSize: 20 }]}>Lesion Details</Text>
          {historyDetails}

          <CustomButton
            customStyle={[generalStyles.okCustomButton, { width: '90%', height: 40 }]}
            text="Check suggestion again"
            onPress={() => setShowDetailsModal(false)}
          />
          <CustomButton
            customStyle={[generalStyles.okCustomButton, { width: '90%', height: 40 }]}
            text="Cancel"
            onPress={() => setShowDetailsModal(false)}
          />
        </View>
      </Modal>
    </>
  );

  return contentToRender;
};

export default History;
