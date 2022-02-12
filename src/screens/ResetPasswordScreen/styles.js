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
  ...layoutStyles,
  ...formStyles,
});

export default styles;
