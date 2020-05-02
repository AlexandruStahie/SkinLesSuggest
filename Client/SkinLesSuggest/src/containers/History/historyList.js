import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './style';

const HistoryList = ({ historyList, showMoreDetails }) => (
  <View style={{ justifyContent: 'flex-start' }}>
    {
        historyList && historyList.length > 0
          ? historyList.map((element) => (
            <View key={element.id} style={styles.historyListContainer}>
              <Text style={styles.lesionName}>
                {element.name}
              </Text>
              <Text style={styles.lesionLocalization}>
                {' Localization: '}
                {element.localization}
              </Text>
              <TouchableOpacity onPress={() => showMoreDetails(element.id)}>
                <Text style={styles.link}>
                  {'Show More Details '}
                </Text>
              </TouchableOpacity>
            </View>
          )) : <Text style={styles.noHistoryMessage}>No history data available</Text>
      }
  </View>
);

export default HistoryList;
