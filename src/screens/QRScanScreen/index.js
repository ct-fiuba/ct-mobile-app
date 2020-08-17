import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaView } from 'react-navigation';

import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

function QRScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const goBack = () => navigation.navigate('DashboardScreen');

  return (
    <SafeAreaView style={[styles.center, styles.barcodeContainer]}>
      {hasPermission ? (
        <>
          <BarCodeScanner
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
              <TouchableOpacity onPress={goBack} style={styles.button}>
                <Text style={styles.buttonText}>Go back</Text>
              </TouchableOpacity>
            </View>
          </BarCodeScanner>
        </>
      ) : (
        <Text>No access to camera</Text>
      )}
    </SafeAreaView>
  );
}

export default QRScanScreen;
