import React from 'react';
import { Button, SafeAreaView } from 'react-native';

import { signOut } from '../../services/FirebaseService';
import layoutStyles from '../../styles/layout';

function DashboardScreen() {
  return (
    <SafeAreaView style={layoutStyles.center}>
      <Button onPress={signOut} title="Sign Out" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
