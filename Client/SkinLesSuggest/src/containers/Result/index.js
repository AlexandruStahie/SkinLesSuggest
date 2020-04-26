/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Dimensions, ScrollView
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';
import {
  possibleSolutions, possibleSolutionsShortCuts, disclaimers, chartLegend
} from '../../utils/consts';
import ModalInfo from '../../components/ModalInfo';
import ExtraInfo from '../../components/ExtraInfo';

const initialData = [20, 20, 20, 20, 20, 20, 20];

const Results = ({ response, componentId }) => {
  const [data, setData] = useState(initialData);
  const [showLegend, setShowLegend] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [suggestion, setsuggestion] = useState(null);

  const goToSuggestionScreen = () => {
    Navigation.pop(componentId);
  };

  useEffect(() => {
    const dataClone = Object.assign([], initialData);
    if (response && response.data) {
      dataClone[response.data.prediction_class] = 100;
      setsuggestion(possibleSolutions[response.data.prediction_class]);
      setData(dataClone);
    } else {
      setData(initialData);
    }
  }, []);

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
              infoLabel=" Chart Legend"
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
    </>
  );

  return contentToRender;
};

export default Results;
