import React from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { signOut } from '../../services/FirebaseService';
import layoutStyles from '../../styles/layout';

function DashboardScreen({ navigation }) {
  const scanQr = () => {
    navigation.navigate('QRScanScreen');
  };

  return (
    <SafeAreaView style={layoutStyles.center}>
      <Button title="Scan QR" onPress={scanQr} />
      <Button onPress={signOut} title="Sign Out" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
