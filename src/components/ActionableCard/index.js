import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';

export default function RiskStatus({ onPress, title, icon }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.common}>
      <MaterialCommunityIcons name={icon} size={30} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
