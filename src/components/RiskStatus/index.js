import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/de';

import { getSessionActive } from '../../services/LocalStorageService';

import { RISK_INFO } from '../../constants/risk';
import styles from './styles';

export default function RiskStatus({ risk }) {
  const [sessionInfo, setSessionInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      const session = await getSessionActive();
      setSessionInfo(JSON.parse(session));
    }
    fetchData();
  }, [setSessionInfo]);

  return (
    <View style={[styles.common, styles[RISK_INFO[risk].id]]}>
      <Text
        style={styles.title}
      >{`Nivel de riesgo: ${RISK_INFO[risk].title}`}</Text>
      <Text style={styles.small}>{sessionInfo.email}</Text>
      <Text style={styles.small}>
        {sessionInfo.dni &&
          new Intl.NumberFormat('de-DE').format(sessionInfo.dni)}
      </Text>
    </View>
  );
}
