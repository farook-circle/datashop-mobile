/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// screen
import {screenOptions} from './helpers';
import TabBar from './utils/Tabbar';
import {History, Home} from '../screens';


const Tab = createBottomTabNavigator();

const More = () => {
  return <></>;
};

const Help = () => {
  return <></>;
};


export default function BottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Help" component={Help} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}
