import React, { useCallback } from 'react';
import { Button, SafeAreaView } from 'react-native';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import { removeSession } from '../../services/LocalStorageService';
import layoutStyles from '../../styles/layout';

function DashboardScreen() {
  const dispatch = useDispatch();

  const signOut = useCallback(() => {
    removeSession();
    dispatch(actionCreators.resetSession());
  }, [dispatch]);
  return (
    <SafeAreaView style={layoutStyles.center}>
      <Button onPress={signOut} title="Sign Out" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
