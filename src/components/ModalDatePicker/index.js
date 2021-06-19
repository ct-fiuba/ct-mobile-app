import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Modal } from 'react-native-magnus';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './styles';

function ModalDatePicker({
  value,
  visible,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) {
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
  };

  return (
    <Modal isVisible={visible} h={300} style={styles.dateModal} useNativeDriver>
      <View style={styles.modalContent}>
        <View style={styles.modalButtons}>
          <Button bg="red400" rounded="circle" onPress={onCancel}>
            {cancelText}
          </Button>
          <Button
            bg="green400"
            rounded="circle"
            onPress={() => onConfirm(date)}
          >
            {confirmText}
          </Button>
        </View>

        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="spinner"
          onChange={onChange}
        />
      </View>
    </Modal>
  );
}

export default ModalDatePicker;
