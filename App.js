import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import DashboardScreen from './src/screens/DashboardScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import QRScanScreen from './src/screens/QRScanScreen';

export default createAppContainer(
  createSwitchNavigator(
    {
      LoadingScreen,
      LoginScreen,
      SignUpScreen,
      DashboardScreen,
      QRScanScreen,
    },
    {
      initialRouteName: 'LoadingScreen',
    }
  )
);
