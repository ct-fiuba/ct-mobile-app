import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';

export default function ActionableCard({ onPress, title, icon, main }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.common, main ? styles.mainContainer : null]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={main ? 'white' : 'black'}
      />
      <Text style={[styles.title, main ? styles.mainTitle : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
