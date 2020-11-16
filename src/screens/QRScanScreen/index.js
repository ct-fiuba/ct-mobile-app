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
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    scan(data)
      .then(_res => openAlert('Exito', 'La visita se guardó exitosamente'))
      .catch(error => openAlert('Error', error.response.data.reason));
  };

  return (
    <SafeAreaView style={[styles.center, styles.barcodeContainer]}>
      {hasPermission ? (
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFillObject, styles.barcode]}
        >
          <View style={styles.layerTop}>
            <Text style={styles.title}>Scan QR</Text>
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
