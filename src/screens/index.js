import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './DashboardScreen';
// import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import QRScanScreen from './QRScanScreen';
import TabBarIcon from '../components/TabBarIcon';
import { getSessionActive } from '../services/LocalStorageService';
import { useSelector, useDispatch } from '../contexts/AuthContext';
import { actionCreators } from '../contexts/AuthContext/reducer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigatorScreen() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon name="md-home" focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={QRScanScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon name="md-qr-scanner" focused={focused} size={size} />
          ),
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
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
    return session !== null || savedSession
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
          <Stack.Screen name="App" component={TabNavigatorScreen} />
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
