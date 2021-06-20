import React, { useState, useMemo, useCallback } from 'react';
import { View, Platform } from 'react-native';
import { Button, Modal } from 'react-native-magnus';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './styles';

function ModalDatePicker({
  id,
  value,
  visible,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) {
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  const onChange = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;

      setDate(currentDate);
    },
    [date]
  );

  const onAndroidChange = useCallback(
    (event, selectedDate) => {
      if (event.type === 'set') {
        const currentDate = selectedDate || date;
        onConfirm(currentDate);
      } else {
        onCancel();
      }
    },
    [date, onCancel, onConfirm]
  );

  return useMemo(
    () =>
      Platform.OS === 'android' ? (
        visible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="spinner"
            onChange={onAndroidChange}
          />
        )
      ) : (
        <Modal
          isVisible={visible}
          h={300}
          style={styles.dateModal}
          useNativeDriver
        >
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
              testID={id}
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
            />
          </View>
        </Modal>
      ),
    [
      cancelText,
      confirmText,
      date,
      id,
      onAndroidChange,
      onCancel,
      onChange,
      onConfirm,
      visible,
    ]
  );
}

export default ModalDatePicker;
