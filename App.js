import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import API from './src/utils/Firebase';
import { DashboardScreen, LoadingScreen, LoginScreen, SignUpScreen } from './src/screens';
import firebaseConfig from './src/utils/FirebaseConfig';

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
