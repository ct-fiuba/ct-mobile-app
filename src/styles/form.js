import { StyleSheet } from 'react-native';

import { COLORS } from './colors';

const formStyles = StyleSheet.create({
  form: {
    width: '86%',
    marginTop: 15,
  },
  input: {
    fontSize: 20,
    borderColor: '#707070',
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 25.5,
  },
  button: {
    // fontWeight: '200',
    fontSize: 18,
    // fontWeight: '500',
    textAlign: 'center',
    color: COLORS.main,
  },
  title: { fontSize: 32, fontWeight: '600', color: COLORS.main },
});

export default formStyles;
