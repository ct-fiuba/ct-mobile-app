import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateModal: {
    borderRadius: 100,
  },
  modalContent: {
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
});

export default styles;
