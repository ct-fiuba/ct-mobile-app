/* eslint-disable react/prop-types */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import API from '../../utils/Firebase';
import layoutStyles from '../../styles/layout';

const LoadingScreen = ({ navigation }) => {
  const isUserLoggedIn = React.useCallback(() => {
    API.auth().onAuthStateChanged(user =>
      user
        ? navigation.navigate('DashboardScreen')
        : navigation.navigate('LoginScreen')
    );
  }, [navigation]);

  React.useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  return (
    <View style={layoutStyles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
};
export default LoadingScreen;
