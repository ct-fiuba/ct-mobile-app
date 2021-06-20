import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import { removeSession, getCodes } from '../../services/LocalStorageService';
import { sendCodes } from '../../services/CTUserAPIService';
import RiskStatus from '../../components/RiskStatus';
import ActionableCard from '../../components/ActionableCard';

import styles from './styles';

function DashboardScreen() {
  const dispatch = useDispatch();

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

  const exposeCodes = useCallback(async () => {
    const codes = await getCodes();
    sendCodes(codes)
      .then(_res => {
        openAlert('Exito', 'Los codigos se compartieron exitosamente');
      })
      .catch(error => openAlert('Error', error.response.data.reason));
  }, []);

  const signOut = useCallback(async () => {
    await removeSession();
    dispatch(actionCreators.resetSession());
  }, [dispatch]);
  return (
    <View>
      <RiskStatus risk="high" />
      <View style={styles.center}>
        <FlatGrid
          itemDimension={110}
          style={styles.actionables}
          data={[
            { onPress: exposeCodes, title: 'Compartir codigos', icon: 'share' },
            { onPress: signOut, title: 'Salir', icon: 'logout' },
          ]}
          renderItem={({ item: { onPress, title, icon } }) => (
            <ActionableCard onPress={onPress} title={title} icon={icon} />
          )}
        />
      </View>
    </View>
  );
}

export default DashboardScreen;
