import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import SignOut from '../../utils/SignOut';
import styles from './styles';

function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>HOLA</Text>
      <Button onPress={SignOut} title="Sign Out" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
