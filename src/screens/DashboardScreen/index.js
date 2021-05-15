import React, { useCallback } from 'react';
import { Button, SafeAreaView, Alert } from 'react-native';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import { removeSession, getCodes } from '../../services/LocalStorageService';
import { sendCodes } from '../../services/CTUserAPIService';
import layoutStyles from '../../styles/layout';
import RiskStatus from '../../components/RiskStatus';

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
    <SafeAreaView style={layoutStyles.center}>
      <RiskStatus risk="low" />
      <Button onPress={exposeCodes} title="Compartir códigos" />
      <Button onPress={signOut} title="Sign Out" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
