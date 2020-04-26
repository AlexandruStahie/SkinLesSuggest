/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Dimensions, ScrollView
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import styles from './style';
import generalStyles from '../../generalStyle';
import CustomButton from '../../components/CustomButton';
import { possibleSolutions, possibleSolutionsShortCuts } from '../../utils/consts';
import Disclaimer from '../../components/Disclaimer';
import ChartLegend from '../../components/ChartLegend';

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

  const contentToRender = (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={[generalStyles.containerBase, generalStyles.leftContainer]}>
            <Text style={[generalStyles.logoBase, { marginTop: 20 }]}>SkinLesSuggest</Text>
            <View style={[styles.legend, { marginBottom: 7 }]}>
              <Text style={styles.checkLegend}>
                Disclaimer
              </Text>
              <Text
                style={[styles.iDispaly, { color: 'red' }]}
                onPress={() => setShowDisclaimer(true)}
                hitSlop={{
                  top: 20, bottom: 20, left: 50, right: 50
                }}
              >
                i
              </Text>
            </View>

            <View style={styles.legend}>
              <Text style={styles.checkLegend}>
                Chart Legend
              </Text>

              <Text
                style={styles.iDispaly}
                onPress={() => setShowLegend(true)}
                hitSlop={{
                  top: 20, bottom: 20, left: 50, right: 50
                }}
              >
                i
              </Text>
            </View>
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

            {
              suggestion && (
              <View style={{ flex: 1, flexDirection: 'row', width: '80%' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: 'left', fontSize: 16 }}>
                    {'\u25CF'}
                    {' '}
                    {' '}
                    {' '}
                    {`Suggestion received : ${suggestion}` }
                  </Text>

                </View>
              </View>
              )
            }

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
        <ChartLegend
          onPressOk={() => setShowLegend(false)}
        />
      </Modal>
      <Modal
        onBackdropPress={() => setShowDisclaimer(false)}
        isVisible={showDisclaimer}
      >
        <Disclaimer
          onPressOk={() => setShowDisclaimer(false)}
        />
      </Modal>
    </>
  );

  return contentToRender;
};

export default Results;
