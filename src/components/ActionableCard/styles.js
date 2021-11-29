import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    padding: 15,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    height: 85,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  mainContainer: {
    backgroundColor: COLORS.secondary,
  },
  disabled: {
    backgroundColor: '#ababa4',
  },
  title: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  mainTitle: {
    color: 'white',
  },
  loader: {
    marginTop: 10,
    padding: 25,
  },
});

export default styles;
