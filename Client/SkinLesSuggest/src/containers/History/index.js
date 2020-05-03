import React, { useEffect, useState } from 'react';
import {
  Text, View, ScrollView, Alert, Linking, PermissionsAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import CustomButton from '../../components/CustomButton';
import generalStyles from '../../generalStyle';
import Loader from '../../components/Loader';
import { get, post } from '../../utils/requests';
import { possibleSolutions } from '../../utils/consts';
import HistoryList from './historyList';
import HistoryDetails from './historyDetails';

const History = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [historyList, setHistoryList] = useState([]);
  const [detailsHistory, setDetailsHistory] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecheckSuggestion, setShowRecheckSuggestion] = useState(false);
  const [newSuggestionMsg, setNewSuggestionMsg] = useState('');

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

  const attachImage = (oldSuggestion) => {
    checkPermissions((permissionsGranted) => {
      if (permissionsGranted) {
        Alert.alert(
          'Attach Image',
          'Select the source of your picture:',
          [
            { text: 'Cancel', onPress: () => { } },
            { text: 'Choose From Library', onPress: () => { getImage('gallery', oldSuggestion); } },
            { text: 'Take Photo', onPress: () => { getImage('camera', oldSuggestion); } },
          ],
        );
      }
    });
  };
  const getImage = (source, oldSuggestion) => {
    const options = {
      cropping: true,
      includeBase64: true,
      includeExif: true,
      mediaType: 'photo'
    };

    switch (source) {
      case 'camera':
        ImagePicker.openCamera(options).then((response) => getSuggestion(response, oldSuggestion)).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert('Please try again!'); }
        });
        break;
      case 'gallery':
        ImagePicker.openPicker(options).then((response) => getSuggestion(response, oldSuggestion)).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert('Please try again!'); }
        });
        break;
      default:
        dispalyErrorAlert('Please try again!');
        break;
    }
  };
  const checkPermissions = (callback) => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ];

    PermissionsAndroid.requestMultiple(permissions)
      .then((result) => {
        if (result
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
          && result['android.permission.CAMERA'] === 'granted') {
          return callback(true);
        }
        alertPermissionIssue();
        return callback(false);
      }).catch(() => {
        alertPermissionIssue();
        return callback(false);
      });
  };
  const dispalyErrorAlert = (text) => {
    Alert.alert('Error', text, [{ text: 'ok', onPress: () => { } }]);
  };
  const alertPermissionIssue = () => {
    Alert.alert(
      'Error',
      'The SkinLesSuggest app does not have permissions to access this phone resource. Please enable the required Permissions in order to use this function.',
      [
        { text: 'OK', onPress: () => { } },
        { text: 'Settings', onPress: () => { Linking.openSettings(); } },
      ],
    );
  };

  const getSuggestion = (image, oldSuggestion) => {
    if (image) {
      setIsLoading(true);
      const endpoint = 'https://skinlessuggest-predapp.herokuapp.com/predict';
      const imageBody = { data: image.data };
      const config = { 'Content-Type': 'multipart/form-data' };

      post(endpoint, imageBody, config)
        .then((response) => {
          if (response && response.data) {
            const solution = possibleSolutions[response.data.prediction_class];
            if (solution === oldSuggestion) {
              setNewSuggestionMsg(
                `\u25CF The suggestion received is the same as the old one: ${solution}
                \n\u25CF Please contact a dermathologist for a valid diagnostic!`
              );
            } else {
              setNewSuggestionMsg(
                `\u25CF The suggestion received changed. 
                \n\u25CF New Suggestion: ${solution}
                \n\u25CF Please contact a dermathologist for a valid diagnostic!`
              );
            }
            setShowRecheckSuggestion(true);
          }
          setIsLoading(false);
        })
        .catch(() => {
          dispalyErrorAlert('Something went wrong, please try again.');
          setIsLoading(false);
        });
    } else {
      dispalyErrorAlert('Please try again to attach one image');
    }
  };

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={generalStyles.containerBase}>
          <Text style={[generalStyles.logoBase, generalStyles.logoMarginTop, { marginBottom: 0 }]}>SkinLesSuggest</Text>
          <Text style={generalStyles.logoSubtitle}>History</Text>
        </View>

        <HistoryList
          historyList={historyList}
          showMoreDetails={showMoreDetails}
        />
      </ScrollView>

      <Modal
        onBackdropPress={() => setShowDetailsModal(false)}
        isVisible={showDetailsModal}
      >
        <HistoryDetails
          detailsHistory={detailsHistory}
          attachImage={attachImage}
          closeModal={() => setShowDetailsModal(false)}
        />
      </Modal>
      <Modal
        onBackdropPress={() => setShowRecheckSuggestion(false)}
        isVisible={showRecheckSuggestion}
      >
        <View style={generalStyles.modalView}>
          <Text style={generalStyles.modalTitle}>{newSuggestionMsg}</Text>
          <CustomButton
            customStyle={generalStyles.okCustomButton}
            text="Ok"
            onPress={() => setShowRecheckSuggestion(false)}
          />
        </View>
      </Modal>
    </>
  );

  return contentToRender;
};

export default History;
