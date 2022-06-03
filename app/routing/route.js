import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';

// My Screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/Home';
import DataPlan from '../screens/DataPlans';
import History from '../screens/History';
import CheckOut from '../screens/CheckOutScreen';
import Receipt from '../screens/ReceiptScreen';
import {RESTORE_TOKEN, SET_TOKEN, USER_LOADING} from '../redux/constants/auth';
import {restoreUser} from '../redux/actions/auth';
import DepositToWallet from '../screens/DepostToWallet';
import Messages from '../screens/Messages';
import Profile from '../screens/Profile';
import {getContactInfo} from '../redux/actions/config';
import DataCategoryScreen from '../screens/DataCategoryScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getContactInfo());
    async function getUserToken() {
      try {
        const token = await EncryptedStorage.getItem('token');
        if (token !== undefined) {
          dispatch({type: RESTORE_TOKEN, payload: JSON.parse(token)});
        }
      } catch (error) {
        // There was an error on the native side
      }
      dispatch(restoreUser());
    }
    getUserToken();
  }, []);

  if (auth.isRestoringUser) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth.token == null ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegistrationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Deposit"
              component={DepositToWallet}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DataCategory"
              component={DataCategoryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DataPlan"
              component={DataPlan}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CheckOut"
              component={CheckOut}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="Receipt"
              component={Receipt}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messages"
              component={Messages}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
