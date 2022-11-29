import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';

import { scan } from '../../services/ScanService';

import styles from './styles';

function QRScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const [camera, setCamera] = useState(null);

  const [isRatioSet, setIsRatioSet] = useState(false);

  const { height, width } = useMemo(() => Dimensions.get('window'), []);
  const screenRatio = useMemo(() => height / width, [height, width]);

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      const distances = {};
      const realRatios = {};
      let minDistance = null;
      for (const r of ratios) {
        const parts = r.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[r] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[r] = realRatio;
        if (minDistance == null) {
          minDistance = r;
        } else if (distance >= 0 && distance < distances[minDistance]) {
          minDistance = r;
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height

      // set the preview padding and preview ratio
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to
  // access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

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
      const { id, isExit, estimatedVisitDuration, space, name } = parsedData;
      try {
        scan(id, isExit, estimatedVisitDuration).catch(error =>
          openAlert('Error', error.response.data.reason)
        );
        openAlert(
          'Éxito',
          `La ${
            isExit ? 'salida' : 'entrada'
          } de ${space} de ${name} se escaneó exitosamente`
        );
      } catch {
        openAlert(
          'Error',
          'Ocurrió un error al escanear, vuelva a internarlo.'
        );
      }
    } catch {
      openAlert('Error', 'QR Inválido.');
    }
  };

  return (
    <SafeAreaView style={[styles.center, styles.barcodeContainer]}>
      {hasPermission ? (
        <Camera
          onCameraReady={setCameraReady}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFillObject, styles.barcode]}
          ref={ref => {
            setCamera(ref);
          }}
          ratio={ratio}
        >
          <View style={styles.layerTop}>
            <Text style={styles.title}>Escanear QR</Text>
          </View>
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Inicio');
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Text>No hay acceso a la camara</Text>
      )}
    </SafeAreaView>
  );
}

export default QRScanScreen;
