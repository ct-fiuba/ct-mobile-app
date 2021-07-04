import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  common: {
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    padding: 15,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    height: 100,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default styles;
