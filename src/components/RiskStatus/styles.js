import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  common: {
    // alignItems: 'center',
    // borderRadius: 10,
    // elevation: 1,
    // margin: 20,
    padding: 15,
    // shadowOffset: { width: 1, height: 2 },
    // shadowOpacity: 0.2,
    // width: '100%',

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
    backgroundColor: '#ff9999',
  },
  medium: {
    backgroundColor: '#faee87',
  },
  low: {
    backgroundColor: '#42ff6e',
  },
});

export default styles;
