import { StyleSheet } from 'react-native';

import layoutStyles from '../../styles/layout';

const styles = StyleSheet.create({
  actionables: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    margin: 0,
  },
  center: {
    ...layoutStyles.center,
    margin: 10,
  },
});

export default styles;
