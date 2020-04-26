import React, { useState, useEffect } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, Linking, Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import { Navigation } from 'react-native-navigation';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';
import ModalInfo from '../../components/ModalInfo';
import { instructions } from '../../utils/consts';
import { post } from '../../utils/requests';
import Loader from '../../components/Loader';
import ExtraInfo from '../../components/ExtraInfo';

const Form = ({ componentId }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setImage(null);
    setIsLoading(false);
  }, []);

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

  const attachImage = () => {
    checkPermissions((permissionsGranted) => {
      if (permissionsGranted) {
        Alert.alert(
          'Attach Image',
          'Select the source of your picture:',
          [
            { text: 'Cancel', onPress: () => { } },
            { text: 'Choose From Library', onPress: () => { getImage('gallery'); } },
            { text: 'Take Photo', onPress: () => { getImage('camera'); } },
          ],
        );
      }
    });
  };

  const getImage = (source) => {
    const options = {
      cropping: true,
      includeBase64: true,
      includeExif: true,
      mediaType: 'photo'
    };

    switch (source) {
      case 'camera':
        ImagePicker.openCamera(options).then((response) => {
          setImage(response);
        }).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert('Please try again!'); }
        });
        break;
      case 'gallery':
        ImagePicker.openPicker(options).then((response) => {
          setImage(response);
        }).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert('Please try again!'); }
        });
        break;
      default:
        dispalyErrorAlert('Please try again!');
        break;
    }
  };

  const dispalyErrorAlert = (text) => {
    Alert.alert('Error', text, [{ text: 'ok', onPress: () => { } }]);
  };

  const getImageBody = () => {
    const pathV = image.path.split('/');
    return {
      uri: image.path,
      name: pathV[pathV.length - 1],
      type: image.mime,
      data: image.data,
    };
  };

  const getSuggestion = () => {
    if (image) {
      setIsLoading(true);
      const endpoint = 'https://skinlessuggest-predapp.herokuapp.com/predict';
      const imageBody = getImageBody();
      const config = { 'Content-Type': 'multipart/form-data' };

      post(endpoint, imageBody, config)
        .then((response) => {
          Navigation.push(componentId, {
            component: {
              name: 'Result',
              passProps: {
                response
              }
            }
          });
          setImage(null);
          setIsLoading(false);
        })
        .catch(() => {
          dispalyErrorAlert('Something went wrong, please try again.');
          setIsLoading(false);
        });
    } else {
      dispalyErrorAlert('Please attach one image');
    }
  };

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <View style={[generalStyles.containerBase, generalStyles.leftContainer]}>
        <Text style={[generalStyles.logoBase, generalStyles.logoMarginTop]}>SkinLesSuggest</Text>
        <ExtraInfo
          infoLabel="Check Instructions"
          onInfoPress={() => setShowInstructions(true)}
        />
        <CustomButton
          customStyle={{ marginTop: 10 }}
          text="Attach Image"
          onPress={attachImage}
        />
        <CustomButton
          text="Get Suggestion"
          onPress={getSuggestion}
        />

        {
          image ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${image.data}`,
              }}
              style={generalStyles.image}
              resizeMode="contain"
            />
          ) : null
        }

      </View>

      <Modal
        onBackdropPress={() => setShowInstructions(false)}
        isVisible={showInstructions}
      >
        <ModalInfo
          title="Instructions for better suggestions"
          infoList={instructions}
          hasImage
          onPressOk={() => setShowInstructions(false)}
        />
      </Modal>
    </>
  );

  return contentToRender;
};

export default Form;
