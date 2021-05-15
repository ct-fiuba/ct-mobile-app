import React from 'react';
import { View, Text } from 'react-native';

import { RISK_INFO } from './constants';
import styles from './styles';

export default function RiskStatus({ risk }) {
  return (
    <View style={[styles.common, styles[risk]]}>
      <Text
        style={styles.title}
      >{`Nivel de riesgo: ${RISK_INFO[risk].title}`}</Text>
      <Text>{RISK_INFO[risk].text}</Text>
    </View>
  );
}
