import React, { useCallback, useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import { removeSession, getCodes, getRisk , saveRisk} from '../../services/LocalStorageService';

import { sendCodes, getBillboard } from '../../services/CTUserAPIService';
import RiskStatus from '../../components/RiskStatus';
import ActionableCard from '../../components/ActionableCard';

import useInterval from './useInterval';

import styles from './styles';

function DashboardScreen() {
  const dispatch = useDispatch();

  const [risk, setRisk] = useState(0);

  useInterval(async () => {
    try {
      const billboard = await getBillboard();

      const codes = await getCodes();
  
      let newRisk = await getRisk();
  
      codes.forEach(code => {
        let compromisedCode = billboard.find(x => x.userGeneratedCode === code.userGeneratedCode);
  
        if (compromisedCode && compromisedCode.risk > newRisk) {
          newRisk = compromisedCode.risk
        }
      });

      if (newRisk > risk) {
        setRisk(newRisk)
        saveRisk(newRisk)
        openAlert('Alerta', 'El riesgo de contagio ha aumentado');
      }
    }
    catch (error) {
      openAlert('Error', error.response.data.reason)
      console.log(error.response.data)
    }

    
  }, 60000);

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
      <RiskStatus risk={risk}/>
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
