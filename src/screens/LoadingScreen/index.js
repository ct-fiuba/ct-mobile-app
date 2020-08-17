/* eslint-disable react/prop-types */
import React, { useCallback, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import API from '../../config/firebase';

import layoutStyles from '../../styles/layout';

const LoadingScreen = ({ navigation }) => {
  const isUserLoggedIn = useCallback(() => {
    API.auth().onAuthStateChanged(user =>
      user
        ? navigation.navigate('DashboardScreen')
        : navigation.navigate('LoginScreen')
    );
  }, [navigation]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  return (
    <View style={layoutStyles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
};
export default LoadingScreen;
