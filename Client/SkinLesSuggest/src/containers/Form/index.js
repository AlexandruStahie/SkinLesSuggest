import React, { useState, useEffect, useRef } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, Linking, Image, ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import { Navigation } from 'react-native-navigation';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';
import ModalInfo from '../../components/ModalInfo';
import { instructions } from '../../utils/consts';
import { isNil, compareObjects } from '../../utils/functions';
import { get, post, getHeader } from '../../utils/requests';
import Loader from '../../components/Loader';
import ExtraInfo from '../../components/ExtraInfo';
import UserForm from './userForm';

const defaultUserData = {
  firstName: '',
  lastName: '',
  age: null,
  gender: '',
  localization: ''
};

const Form = ({ componentId }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);
  const [freezedUserData, setFreezedUserData] = useState(defaultUserData);

  const scrollViewRef = useRef();

  useEffect(() => {
    mimeComponentDidMount();
  }, []);
  const mimeComponentDidMount = () => {
    setIsLoading(true);
    checkUserData();
  };

  // User Form Methods
  const checkUserData = () => {
    const checkLoggedInUser = getHeader();
    if (checkLoggedInUser) {
      setUserIsLoggedIn(true);
      get('/UserDetails')
        .then((result) => {
          setUserData(result && result.data ? result.data : defaultUserData);
          setFreezedUserData(result && result.data ? result.data : defaultUserData);
          setIsLoading(false);
        })
        .catch(() => {
          setUserData(defaultUserData);
          setIsLoading(false);
        });
    } else {
      setUserIsLoggedIn(false);
      setIsLoading(false);
    }
  };
  const setField = (field, value) => {
    const userDataClone = { ...userData };

    if (!isNil(field) && !isNil(value)) {
      if (field === 'age') {
        if (value % 1 === 0 && value >= 0 && value < 120 && !value.toString().includes('.')) {
          userDataClone[field] = value;
        }
      } else {
        userDataClone[field] = value;
      }
    }

    setUserData(userDataClone);
  };
  const checkUserFields = () => {
    if (compareObjects(userData.firstName, freezedUserData.firstName)
      || compareObjects(userData.lastName, freezedUserData.lastName)
      || compareObjects(userData.age, freezedUserData.age)
      || compareObjects(userData.gender, freezedUserData.gender)) {
      return true;
    }
    return false;
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
  const timeoutLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
          timeoutLoading();
          setImage(response);
        }).catch((err) => {
          if (err && err.message !== 'User cancelled image selection') { dispalyErrorAlert('Please try again!'); }
        });
        break;
      case 'gallery':
        ImagePicker.openPicker(options).then((response) => {
          timeoutLoading();
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

  // Requests and logic
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
        })
        .catch(() => {
          dispalyErrorAlert('Something went wrong, please try again.');
          setIsLoading(false);
        });
    } else {
      dispalyErrorAlert('Please attach one image');
    }
  };
  const askUserToSaveDetails = (response) => {
    if (userIsLoggedIn && checkUserFields()) {
      Alert.alert('', 'Do you want to update your informations ?',
        [{ text: 'Yes', onPress: () => saveUserData(response) },
          { text: 'No', onPress: () => goToResultScreen(response) }]);
    } else {
      goToResultScreen(response);
    }
    setIsLoading(false);
  };
  const saveUserData = (response) => {
    post('/UserDetails', userData)
      .then(() => {
        goToResultScreen(response);
      });
  };
  const goToResultScreen = (response) => {
    Navigation.push(componentId, {
      component: {
        name: 'Result',
        passProps: {
          response,
          mimeFormComponentDidMount: () => mimeComponentDidMount()
        }
      }
    });

    setImage(null);
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, });
    }
  };

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <View style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef}>
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

            <View style={generalStyles.image}>
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

            <CustomButton
              customStyle={{ marginTop: 15 }}
              text="Get Suggestion"
              onPress={getSuggestion}
            />
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
