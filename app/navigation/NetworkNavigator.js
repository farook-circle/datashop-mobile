import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {screenOptions} from '../navigation';
import {NetworkErrorScreen, ServerErrorScreen} from '../screens';

const Stack = createNativeStackNavigator();

export const NetworkNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'NoConnectionError'}
        screenOptions={screenOptions}>
        <Stack.Screen
          name={'NoConnectionError'}
          component={NetworkErrorScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const ServerNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'ServerError'}
        screenOptions={screenOptions}>
        <Stack.Screen name={'ServerError'} component={ServerErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
