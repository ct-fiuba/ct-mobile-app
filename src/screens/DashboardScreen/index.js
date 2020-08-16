import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import SignOut from '../../utils/SignOut';
import layoutStyles from '../../styles/layout';

function DashboardScreen() {
  return (
    <SafeAreaView style={layoutStyles.center}>
      <Text>HOLA</Text>
      <Button onPress={SignOut} title="Sign Out" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
