import { StyleSheet } from 'react-native';

import layoutStyles from '../../styles/layout';
import formStyles from '../../styles/form';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3A559F',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#707070',
  },
  ...layoutStyles,
  ...formStyles,
});

export default styles;
