/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Dimensions, ScrollView, BackHandler, Alert
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import moment from 'moment';
import CustomDropDown from '../../components/CustomDropDown';
import CustomTextInput from '../../components/CustomTextInput';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';
import {
  possibleSolutions, possibleSolutionsShortCuts, disclaimers, chartLegend, localizationValues
} from '../../utils/consts';
import ModalInfo from '../../components/ModalInfo';
import ExtraInfo from '../../components/ExtraInfo';
import { isNil } from '../../utils/functions';
import { GoToMenuScreen } from '../../../navigation';
import { post } from '../../utils/requests';
import Loader from '../../components/Loader';

const initialData = [20, 20, 20, 20, 20, 20, 20];

const Results = ({
  response, userIsLoggedIn, imageData, mimeFormComponentDidMount, componentId
}) => {
  const [data, setData] = useState(initialData);
  const [showLegend, setShowLegend] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [suggestion, setsuggestion] = useState(null);
  const [showSaveToHistoryModal, setShowSaveToHistoryModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(null);
  const [hideSaveButton, setHideSaveButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lesionData, setLesionData] = useState({
    name: '',
    localization: '',
    suggestion: '',
    image: ''
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleAndroidBackButton);
    if (response && response.data) {
      const dataClone = Object.assign([], initialData);
      dataClone[response.data.prediction_class] = 100;

      setsuggestion(possibleSolutions[response.data.prediction_class]);
      setData(dataClone);

      if (userIsLoggedIn) {
        setLesionData({
          name: '',
          localization: '',
          suggestion: possibleSolutions[response.data.prediction_class],
          image: imageData
        });
      }
    } else {
      GoToMenuScreen();
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackButton);
    };
  }, []);

  const handleAndroidBackButton = () => {
    goToSuggestionScreen();
    return true;
  };

  const goToSuggestionScreen = () => {
    Navigation.pop(componentId);
    mimeFormComponentDidMount();
  };

  const setField = (field, value) => {
    const lesionDataClone = { ...lesionData };
    if (!isNil(field) && !isNil(value)) {
      lesionDataClone[field] = value;
    }
    setLesionData(lesionDataClone);
  };

  const checkLesionData = () => {
    if (lesionData) {
      if (lesionData.name.trim().length > 0
       && lesionData.localization.trim().length > 0) {
        return true;
      }
    }

    return false;
  };
  const saveSuggestion = () => {
    if (checkLesionData()) {
      setIsLoading(true);
      setShowErrorMessage(null);
      post('/Lesion', { ...lesionData, createdOn: moment(new Date()).format() })
        .then(() => {
          setShowSaveToHistoryModal(false);
          setHideSaveButton(true);
          setIsLoading(false);
          Alert.alert('', 'The lesion was saved and it can be seen in history.', [{ text: 'OK', onPress: () => { } }]);
        })
        .catch(() => {
          setShowErrorMessage('Something went wrong, please try again.');
          setIsLoading(false);
        });
    } else {
      setShowErrorMessage('Please complete all fields.');
    }
  };
  const closeSaveModal = () => {
    setLesionData({
      ...lesionData, name: '', localization: '',
    });
    setShowSaveToHistoryModal(false);
  };

  const extraInfo = suggestion ? [
    { text: `Suggestion received : ${suggestion}`, key: 1 },
    { text: 'Please remember that this is just a suggestion', key: 2 },
    { text: 'For a real diagnostic please contact a dermatologist!', key: 3 }
  ] : [];

  const extraInfoToDisplay = extraInfo.map((element) => (
    <Text
      key={element.key}
      style={{ textAlign: 'left', fontSize: 15 }}
    >
      {'\u25CF   '}
      {element.text}
    </Text>
  ));

  const contentToRender = (
    <>
      {isLoading && <Loader />}
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={[generalStyles.containerBase, generalStyles.leftContainer]}>
            <Text style={[generalStyles.logoBase, { marginTop: 20 }]}>SkinLesSuggest</Text>
            <ExtraInfo
              customInfoContainerStyle={{ marginBottom: 7 }}
              customInfoButtonStyle={{ color: 'red' }}
              infoLabel="Disclaimer"
              onInfoPress={() => setShowDisclaimer(true)}
            />
            <ExtraInfo
              infoLabel="Chart Legend"
              onInfoPress={() => setShowLegend(true)}
            />

            <BarChart
              data={{
                labels: possibleSolutionsShortCuts,
                datasets: [{ data }],
              }}
              fromZero
              style={{ paddingRight: 20 }}
              width={Dimensions.get('window').width}
              withInnerLines={false}
              withHorizontalLabels={false}
              height={250}
              chartConfig={{
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                color: (opacity = 1) => `rgba(7, 55, 51, ${opacity})`,
              }}
            />

            <View style={{ flex: 1, width: '94%', marginLeft: '2%' }}>
              {extraInfoToDisplay}
            </View>

            <CustomButton
              customStyle={{ marginTop: 15 }}
              text="Get Another Suggestion"
              onPress={goToSuggestionScreen}
            />

            {userIsLoggedIn === true && hideSaveButton === false && (
              <CustomButton
                customStyle={{ marginTop: 15 }}
                text="Save Suggestion In History"
                onPress={() => setShowSaveToHistoryModal(true)}
              />
            )}
          </View>
        </ScrollView>
      </View>

      <Modal
        onBackdropPress={() => setShowLegend(false)}
        isVisible={showLegend}
      >
        <ModalInfo
          title="Chart Legend"
          subtitle=" This chart display the app suggestion, alongside of all other types of injuries that can be identified by the application."
          infoList={chartLegend}
          onPressOk={() => setShowLegend(false)}
        />
      </Modal>
      <Modal
        onBackdropPress={() => setShowDisclaimer(false)}
        isVisible={showDisclaimer}
      >
        <ModalInfo
          title="Disclaimer"
          infoList={disclaimers}
          onPressOk={() => setShowDisclaimer(false)}
        />
      </Modal>
      <Modal
        onBackdropPress={closeSaveModal}
        isVisible={showSaveToHistoryModal}
      >
        <View style={generalStyles.modalView}>
          <Text style={[generalStyles.modalTitle, { marginBottom: 10 }]}>Add Lesion Details</Text>
          <CustomTextInput
            value={lesionData.name}
            name="name"
            placeholder="Unique lesion name"
            setField={setField}
          />
          <CustomDropDown
            customStyle={{ marginBottom: 0 }}
            customDropDownStyle={{ width: '50%' }}
            name="localization"
            defaultValue="Localization"
            value={lesionData.localization}
            options={localizationValues}
            setField={setField}
          />

          {
            showErrorMessage && (
              <Text style={generalStyles.errorMessage}>{showErrorMessage}</Text>
            )
          }

          <View style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}
          >
            <CustomButton
              customStyle={generalStyles.okCustomButton}
              text="Save"
              onPress={saveSuggestion}
            />
            <CustomButton
              customStyle={generalStyles.okCustomButton}
              text="Cancel"
              onPress={closeSaveModal}
            />
          </View>
        </View>
      </Modal>
    </>
  );

  return contentToRender;
};

export default Results;
