import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Camera } from 'expo-camera';

import { scan } from '../../services/ScanService';

import styles from './styles';

function QRScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Volver a escanear',
          onPress: () => {
            setScanned(false);
          },
        },
        {
          text: 'Volver al inicio',
          onPress: () => {
            navigation.navigate('Inicio');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleBarCodeScanned = async ({ data }) => {
    try {
      setScanned(true);
      const parsedData = JSON.parse(data);
      scan(parsedData.id, parsedData.isExit).catch(error =>
        openAlert('Error', error.response.data.reason)
      );
      openAlert(
        'Éxito',
        `La visita en ${parsedData.space} de ${parsedData.name} se escaneó exitosamente`
      );
    } catch {
      openAlert('Error', 'Ocurrió un error al escanear, vuelva a internarlo');
    }
  };

  return (
    <SafeAreaView style={[styles.center, styles.barcodeContainer]}>
      {hasPermission ? (
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFillObject, styles.barcode]}
        >
          <View style={styles.layerTop}>
            <Text style={styles.title}>Escanear QR</Text>
          </View>
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom}></View>
        </Camera>
      ) : (
        <Text>No access to camera</Text>
      )}
    </SafeAreaView>
  );
}

export default QRScanScreen;
