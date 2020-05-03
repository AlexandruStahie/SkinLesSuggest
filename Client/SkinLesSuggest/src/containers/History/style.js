import { StyleSheet } from 'react-native';
import { colors } from '../../utils/consts';

export default StyleSheet.create({
  historyList: {
    marginHorizontal: '5%',
    backgroundColor: colors.white
  },
  historyListContainer: {
    height: 150,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 3,
    marginBottom: 15,
  },
  link: {
    textAlign: 'right',
    marginTop: 45,
    color: colors.darkBlue
  },
  lesionName: {
    fontWeight: 'bold',
    fontSize: 27,
    textAlign: 'center'
  },
  lesionLocalization: {
    fontSize: 17,
    marginTop: 15
  },
  historyDetailsListContainer: {
    justifyContent: 'center'
  },
  historyDetailsText: {
    marginLeft: '10%',
    fontSize: 15,
  },
  noHistoryMessage: {
    justifyContent: 'center',
    textAlign: 'center'
  }
});
