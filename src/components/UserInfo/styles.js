import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  name: {
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
  },
  small: {
    color: 'white',
    marginBottom: 5,
  },
  user: {
    alignContent: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
  },
  form: {
    borderRadius: 10,
    padding: 25,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    backgroundColor: '#fff',
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    margin: 10,
    marginRight: 0,
  },
});

export default styles;
