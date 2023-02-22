import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

// screens
import HomeScreen from '../screens/Home';
import CustomSidebarMenu from './utils/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen name="Dasboard" component={HomeScreen} />
    </Drawer.Navigator>
  );
}
