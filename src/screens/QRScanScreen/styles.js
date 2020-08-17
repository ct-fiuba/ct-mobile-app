import { StyleSheet } from 'react-native';

import layoutStyles from '../../styles/layout';

const opacity = 'rgba(0, 0, 0, .6)';

const styles = StyleSheet.create({
  barcodeContainer: {
    justifyContent: 'flex-end',
  },
  barcode: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    marginTop: 30,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
    alignItems: 'center',
  },
  layerCenter: {
    flex: 2,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
    justifyContent: 'flex-end',
  },
  ...layoutStyles,
});

export default styles;
