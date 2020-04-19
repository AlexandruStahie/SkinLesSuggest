/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, Linking, Image, Button
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import styles from './style';
import CustomButton from '../../components/CustomButton';
import { colors, possibleSolutions } from '../../utils/consts';
import { post } from '../../utils/requests';

const Form = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
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
        { text: 'OK', onPress: () => { console.log('OK Pressed'); } },
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
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert(); }
        });
        break;
      case 'gallery':
        ImagePicker.openPicker(options).then((response) => {
          setImage(response);
        }).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert(); }
        });
        break;
      default:
        dispalyErrorAlert();
        break;
    }
  };

  const dispalyErrorAlert = () => {
    Alert.alert('Error', 'Please try again!', [{ text: 'ok', onPress: () => { console.log('Ok pressed'); } }]);
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
          console.log('getSuggestion res: ', response);
          console.log('getSuggestion res 2: ', response.data);
          Alert.alert(
            'Suggestion',
            `Possible lesion of type: ${response.data ? possibleSolutions[response.data.prediction_class] : ''}`,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
          );
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('getSuggestion err: ', error);
          Alert.alert(
            'Error',
            'Something went wrong, please try again.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
          );
          setIsLoading(false);
        });
    } else {
      Alert.alert(
        'Error',
        'Please attach one image',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      );
    }
  };

  const contentToRender = (
    <>
      <Spinner
        visible={isLoading}
        overlayColor="rgba(255, 255, 255, 0.7)"
        color={colors.customGreen}
      />
      <View style={styles.container}>
        <Text style={styles.logo}>SkinLesSuggest</Text>
        <View style={styles.instructions}>
          <Text style={styles.checkInstr}>
            Check Instructions
          </Text>
          <Text
            style={styles.iDispaly}
            onPress={() => setShowInstructions(true)}
            hitSlop={{
              top: 20, bottom: 20, left: 50, right: 50
            }}
          >
            i
          </Text>
        </View>
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
              style={styles.image}
              resizeMode="contain"
            />
          ) : null
        }

      </View>
      <Modal
        onBackdropPress={() => setShowInstructions(false)}
        isVisible={showInstructions}
      >
        <View style={styles.modalView}>
          <Text style={{ fontSize: 17, marginBottom: 10 }}>Instructions for better suggestions:</Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            Take clear pictures;
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            Frame the lesion well;
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            Use the custom zoom for a good fit;
            {' '}
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            Example image:
            {' '}
          </Text>
          <Image
            source={require('../../../example.jpg')}
            style={[styles.image, { marginTop: 10 }]}
            resizeMode="contain"
          />
          <CustomButton
            customStyle={styles.okCustomButton}
            text="Ok"
            onPress={() => setShowInstructions(false)}
          />
        </View>
      </Modal>
    </>
  );

  return contentToRender;
};

export default Form;
