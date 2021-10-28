import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  common: {
    padding: 15,
    height: 150,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
    backgroundColor: 'blue',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 10,
  },
  high: {
    backgroundColor: '#FF8080',
  },
  medium: {
    backgroundColor: '#faee87',
  },
  low: {
    backgroundColor: '#9CF196',
  },
  infected: {
    backgroundColor: '#FFBA92',
  },
});

export default styles;
