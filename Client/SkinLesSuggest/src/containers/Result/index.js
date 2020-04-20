/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Dimensions, ScrollView
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import styles from './style';
import CustomButton from '../../components/CustomButton';
import { possibleSolutions, possibleSolutionsShortCuts } from '../../utils/consts';

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
          <View style={styles.container}>
            <Text style={[styles.logo, { marginTop: 20 }]}>SkinLesSuggest</Text>
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
                  <Text style={{ textAlign: 'center', fontSize: 17 }}>
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
        <View style={styles.modalView}>
          <Text style={{ fontSize: 17, marginBottom: 10 }}>Chart Legend</Text>

          <Text style={{ textAlign: 'left', fontSize: 15, marginBottom: 10 }}>
            This chart display the app suggestion, alongside of all other types of injuries that can be identified by the application.
          </Text>

          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            akiec - Actinic keratoses
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            bcc - Basal cell carcinoma
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            bkl - Benign keratosis-like lesions
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            df - Dermatofibroma
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            nv - Melanocytic nevi
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            mel - Melanoma
          </Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            {' '}
            vasc - Vascular lesions
          </Text>
          <CustomButton
            customStyle={styles.okCustomButton}
            text="Ok"
            onPress={() => setShowLegend(false)}
          />
        </View>
      </Modal>
      <Modal
        onBackdropPress={() => setShowDisclaimer(false)}
        isVisible={showDisclaimer}
      >
        <View style={styles.modalView}>
          <Text style={{ fontSize: 17, marginBottom: 10 }}>Disclaimer</Text>
          <Text style={styles.instrBullet}>
            {'\u25CF'}
            {' '}
            {' '}
            Please notice that the application offers only suggestions regarding the categorization of your injuries.
          </Text>
          <Text style={[styles.instrBullet, { marginTop: 10 }]}>
            {'\u25CF'}
            {' '}
            {' '}
            The received result is not a real diagnostic, just an suggestion. For a valid diagnostic please contact a medic.
          </Text>
          <CustomButton
            customStyle={styles.okCustomButton}
            text="Ok"
            onPress={() => setShowDisclaimer(false)}
          />
        </View>
      </Modal>
    </>
  );

  return contentToRender;
};

export default Results;
