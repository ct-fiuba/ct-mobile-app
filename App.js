import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './src/screens/DashboardScreen';
// import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import TabBarIcon from './src/components/TabBarIcon';
import API from './src/config/firebase';

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

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const isUserLoggedIn = useCallback(() => {
    API.auth().onAuthStateChanged(user =>
      user ? setLoggedIn(true) : setLoggedIn(false)
    );
  }, []);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

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
