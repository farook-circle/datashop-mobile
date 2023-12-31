import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';

// screens
import {Home} from '../screens';
import CustomSidebarMenu from './utils/CustomDrawer';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen name="Dashboard" component={Home} />
    </Drawer.Navigator>
  );
};
