import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';

import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

function QRScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
          <View style={styles.layerBottom}>
            {scanned && (
              <TouchableOpacity
                onPress={() => setScanned(false)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </Camera>
      ) : (
        <Text>No access to camera</Text>
      )}
    </SafeAreaView>
  );
}

export default QRScanScreen;
