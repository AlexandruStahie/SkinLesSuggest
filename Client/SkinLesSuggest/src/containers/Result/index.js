/* eslint-disable global-require */
import React from 'react';
import {
  ScrollView, View, Text, Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { BarChart } from 'react-native-chart-kit';
import styles from './style';
import CustomButton from '../../components/CustomButton';
import { possibleSolutions } from '../../utils/consts';

const Results = ({ /* response, */ componentId }) => {
  const goToSuggestionScreen = () => {
    Navigation.pop(componentId);
  };

  const response = {
    data: {
      prediction_class: 4
    }
  };

  const data = {
    labels: possibleSolutions,
    datasets: [{
      data: [0, 0, 0, 0, 1, 0, 0],
    }],
    legend: ['Rainy Days', 'Sunny Days', 'Snowy Days']
  };

  const contentToRender = (
    <>
      <View style={styles.container}>
        <Text style={styles.logo}>SkinLesSuggest</Text>

        <BarChart
          withHorizontalLabels={false}
          withInnerLines={false}
          withOuterLines={false}
          showBarTops={false}
          data={data}
          verticalLabelRotation={45}
          width={Dimensions.get('window').width - 100}
          height={250}
          chartConfig={{
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            color: () => 'rgba(18, 140, 130, 1)',
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            borderColor: 'black'
          }}
        />

        <CustomButton
          text="Get Another Suggestion"
          onPress={goToSuggestionScreen}
        />
      </View>
    </>
  );

  return contentToRender;
};

export default Results;
