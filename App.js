import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import API from './src/utils/Firebase';
import DashboardScreen from './src/screens/DashboardScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

import { firebaseConfig } from './src/utils/FirebaseConfig';

API.initializeApp(firebaseConfig);

export default createAppContainer(
  createSwitchNavigator(
    {
      LoadingScreen,
      LoginScreen,
      SignUpScreen,
      DashboardScreen,
    },
    {
      initialRouteName: 'LoadingScreen',
    }
  )
);
