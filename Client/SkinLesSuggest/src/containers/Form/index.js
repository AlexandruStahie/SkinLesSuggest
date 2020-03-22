/* eslint-disable no-else-return */
import React, { useState, useEffect } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, Linking, Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style';
import CustomButton from '../../components/CustomButton';
import colors from '../../utils/colors';

const Form = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          console.log('response: ', response);
          setImage(response);
        }).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert(); }
        });
        break;
      case 'gallery':
        ImagePicker.openPicker(options).then((response) => {
          console.log('response: ', response);
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

  const getSuggestion = () => {
    if (image) {
      console.log('get suggestion');
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

        <CustomButton
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
    </>
  );

  return contentToRender;
};

export default Form;
