import React, { useCallback, useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { CT_BILLBOARD_INTERVAL } from 'react-native-dotenv';

import { useDispatch, useSelector } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import {
  removeSession,
  getCodes,
  getRisk,
  getInfected,
} from '../../services/LocalStorageService';
import { updateRisk } from '../../services/BillboardService';
import { sendCodes } from '../../services/CTUserAPIService';
import RiskStatus from '../../components/RiskStatus';
import ActionableCard from '../../components/ActionableCard';

import useInterval from '../../utils/useInterval';

import styles from './styles';
import UserInfo from '../../components/UserInfo';

function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();

  const [risk, setRisk] = useState(0);
  const [loading, setLoading] = useState(false);

  const isInfected = useSelector(state => state.infected);

  useEffect(() => {
    async function fetchData() {
      const savedRisk = parseInt(await getRisk(), 10) || 0;
      setRisk(savedRisk);

      const infected = await getInfected();
      dispatch(actionCreators.setInfected(infected));
    }
    fetchData();
  }, [dispatch]);

  const openAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Ok',
        },
      ],
      { cancelable: false }
    );
  };

  const askQuestion = (title, message, onAccept) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Aceptar',
          onPress: onAccept,
        },
        {
          text: 'Cancelar',
        },
      ],
      { cancelable: false }
    );
  };

  useInterval(async () => {
    await updateRisk(
      risk,
      newRisk => {
        setRisk(newRisk);
        openAlert('Alerta', 'El riesgo de contagio ha cambiado.');
      },
      error => openAlert('Error', error.reason)
    );
  }, parseInt(CT_BILLBOARD_INTERVAL));

  const exposeCodes = useCallback(async () => {
    setLoading(true);
    const codes = await getCodes();
    sendCodes(codes)
      .then(_res => {
        dispatch(actionCreators.setInfected(true));
        openAlert('Exito', 'Los codigos se compartieron exitosamente');
        setLoading(false);
      })
      .catch(error => {
        openAlert('Error', error.response.data.reason);
        setLoading(false);
      });
  }, [dispatch]);

  const notInfectedAnymore = useCallback(() => {
    dispatch(actionCreators.setInfected(false));
  }, [dispatch]);

  const signOut = useCallback(async () => {
    await removeSession();
    dispatch(actionCreators.resetSession());
  }, [dispatch]);

  const goToScan = useCallback(async () => {
    navigation.navigate('Escanear');
  }, [navigation]);
  return (
    <View>
      <RiskStatus risk={risk} />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <UserInfo />
        <View style={[styles.center, styles.actionables]}>
          {[
            isInfected
              ? {
                  onPress: () =>
                    askQuestion(
                      'Alta medica',
                      'Confirmar el alta médica de la enfermedad.',
                      notInfectedAnymore
                    ),
                  title: 'Alta médica',
                  icon: 'healthy',
                }
              : {
                  onPress: () =>
                    askQuestion(
                      'Compartir códigos',
                      '¿Está seguro que desea compartir sus códigos?',
                      exposeCodes
                    ),
                  title: 'Me contagie',
                  icon: 'pandemic',
                  isLoading: loading,
                },
            {
              onPress: goToScan,
              title: 'Escanear',
              icon: 'scan',
              main: true,
            },
            { onPress: signOut, title: 'Cerrar Sesión', icon: 'logout' },
          ].map(({ onPress, title, icon, main, isLoading }) => (
            <ActionableCard
              key={icon}
              onPress={onPress}
              title={title}
              icon={icon}
              main={main}
              loading={isLoading}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default DashboardScreen;
