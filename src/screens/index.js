import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from './DashboardScreen';
import LoginScreen from './LoginScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import SignUpScreen from './SignUpScreen';
import QRScanScreen from './QRScanScreen';
import { getSessionActive } from '../services/LocalStorageService';
import { useSelector, useDispatch } from '../contexts/AuthContext';
import { actionCreators } from '../contexts/AuthContext/reducer';

const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="Inicio"
        component={DashboardScreen}
        options={{
          unmountOnBlur: false,
        }}
      />
      <Stack.Screen
        name="Escanear"
        component={QRScanScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function Screens() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const session = useSelector(state => state.session);

  const dispatch = useDispatch();

  const isUserLoggedIn = useCallback(async () => {
    const savedSession = await getSessionActive();

    if (savedSession) {
      dispatch(actionCreators.setSession(JSON.parse(savedSession)));
    }
    return (session !== null && session.refreshToken) || savedSession
      ? setLoggedIn(true)
      : setLoggedIn(false);
  }, [dispatch, session]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn, session]);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {isLoggedIn ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
