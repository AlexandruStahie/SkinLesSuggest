/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, Linking, Image, ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import { Navigation } from 'react-native-navigation';
import jwtDecode from 'jwt-decode';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';
import ModalInfo from '../../components/ModalInfo';
import { getData } from '../../utils/localStorage';
import { instructions } from '../../utils/consts';
import { isNil } from '../../utils/functions';
import { get, post } from '../../utils/requests';
import Loader from '../../components/Loader';
import ExtraInfo from '../../components/ExtraInfo';
import UserForm from './userForm';

const defaultUserData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  localization: ''
};

const Form = ({ componentId, logout }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);
  const [userHadSavedData, setUserHadSavedData] = useState(false);

  useEffect(() => {
    setImage(null);

    getData('token')
      .then((token) => {
        if (token) {
          const decodedToken = jwtDecode(decodeURIComponent(token));
          const { exp, nameid } = decodedToken;
          if (exp >= new Date().getTime() / 1000) {
            setUserIsLoggedIn(true);
            checkUserData(nameid);
          } else if (logout) {
            logout();
            setIsLoading(false);
          }
        }
      })
      .catch(() => {
        if (logout) {
          logout();
        }
        setIsLoading(false);
      });
  }, []);

  // User Form Methods
  const checkUserData = (userId) => {
    get(`/User/userDetails/${userId}`)
      .then((result) => {
        if (result == null || result.data == null) {
          setUserData(defaultUserData);
        } else {
          setUserData(result.data);
          setUserHadSavedData(true);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setUserData(defaultUserData);
        setIsLoading(false);
      });
  };
  const setField = (field, value) => {
    const userDataClone = { ...userData };

    if (!isNil(field) && !isNil(value)) {
      if (field === 'age') {
        if (value % 1 === 0 && value >= 0 && value < 120 && !value.toString().includes('.')) {
          userDataClone[field] = value.trim();
        }
      } else {
        userDataClone[field] = value;
      }
    }

    setUserData(userDataClone);
  };

  // Attach Image Methods
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

  // Errors
  const dispalyErrorAlert = (text) => {
    Alert.alert('Error', text, [{ text: 'ok', onPress: () => { } }]);
  };

  // Requests
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
          askUserToSaveDetails(response);
          setImage(null);
          setUserHadSavedData(true);
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

  const checkUserFields = () => {
    const {
      firstName, lastName, age, gender
    } = userData;

    if ((firstName && firstName.trim().length > 0)
      || (lastName && lastName.trim().length > 0)
      || (age && age.trim().length > 0)
      || (gender && gender.trim().length > 0)) {
      return true;
    }
    return false;
  };
  const askUserToSaveDetails = (response) => {
    const userCompletedFields = checkUserFields();
    if (userCompletedFields && !userHadSavedData) {
      Alert.alert('', 'Do you want to save the compelted informations ?',
        [
          {
            text: 'Yes',
            onPress: () => {
              saveUserData();
              goToResultScreen(response);
            }
          },
          {
            text: 'No',
            onPress: () => goToResultScreen(response)
          }
        ]);
    } else {
      goToResultScreen(response);
    }
  };
  const saveUserData = () => {
    getData('token')
      .then((token) => {
        if (token) {
          const decodedToken = jwtDecode(decodeURIComponent(token));
          const { nameid } = decodedToken;
          post(`/User/userDetails/${nameid}`, userData);
        }
      });
  };
  const goToResultScreen = (response) => {
    Navigation.push(componentId, {
      component: {
        name: 'Result',
        passProps: {
          response
        }
      }
    });
  };

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={[generalStyles.containerBase, generalStyles.leftContainer]}>
            <Text style={[generalStyles.logoBase, generalStyles.logoMarginTop]}>SkinLesSuggest</Text>
            <UserForm
              userIsLoggedIn={userIsLoggedIn}
              userData={userData}
              setField={setField}
            />
            <ExtraInfo
              infoLabel="Attach Image Instructions"
              onInfoPress={() => setShowInstructions(true)}
            />
            <CustomButton
              customStyle={{ marginTop: 10 }}
              text="Attach Image"
              onPress={attachImage}
            />
            <CustomButton
              customStyle={{ marginTop: 15 }}
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
        </ScrollView>
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
