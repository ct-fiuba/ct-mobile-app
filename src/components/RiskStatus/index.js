import React from 'react';
import { View, Text } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/de';

import { useSelector } from '../../contexts/AuthContext';

import { RISK_INFO } from '../../constants/risk';
import styles from './styles';

export default function RiskStatus({ risk }) {
  const isInfected = useSelector(state => state.infected);

  const sessionInfo = useSelector(state => state.session);

  return (
    <View
      style={[
        styles.common,
        !isInfected ? styles[RISK_INFO[risk].id] : styles.infected,
      ]}
    >
      <Text style={styles.title}>
        {!isInfected
          ? `Nivel de riesgo: ${RISK_INFO[risk].title}`
          : 'Contagiado'}
      </Text>
      <Text style={styles.small}>{sessionInfo.email}</Text>
      <Text style={styles.small}>
        {sessionInfo.dni &&
          new Intl.NumberFormat('de-DE').format(sessionInfo.dni)}
      </Text>
    </View>
  );
}
