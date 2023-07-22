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
import Airtime from '../screens/Airtime';
import ElectricityPayment from '../screens/ElectricityPayment';
import OtherScreen from '../screens/OtherScreen';
import ComplainScreen from '../screens/ComplainScreen';
import CollaboratorHome from '../screens/CollaboratorHome';
import Withdraw from '../screens/WithDrawScreen';
import DataManagement from '../screens/DataManagement';
import AddTypePin from '../screens/AddTypePin';
import AgentManagement from '../screens/AgentManagement';
import EditProfile from '../screens/EditProfile';
import ForgotPasswordRequest from '../screens/ForgotPasswordRequest';
import ResetPassword from '../screens/ResetPassword';

import InAppUpdate from '../utils/InAppUpdate';
import DrawerNavigator from './drawerNavigator';
import VerifyEmailScreen from '../screens/VerifyEmail';
import ConfirmPasswordReset from '../screens/ConfirmPasswordReset';
import CompletePasswordReset from '../screens/CompletePasswordReset';
import NetworkScreen from '../screens/DrawerScreens/NetworkScreen';
import ApiDocScreen from '../screens/DrawerScreens/ApiDocScreen';
import TalkToUsScreen from '../screens/DrawerScreens/TalkToUsScreen';
import DevelopersInfoScreen from '../screens/DrawerScreens/DevelopersInfoScreen';
import AboutUsScreen from '../screens/DrawerScreens/AboutUsScreen';
import ActivityDetails from '../screens/DrawerScreens/ActivityDetails';
import ElectricityPaymentScreen from '../screens/OtherServiceScreens/ElectricityPaymentScreen';
import AirtimeToCashScreen from '../screens/OtherServiceScreens/AirtimeToCashScreen';
import TvSubscriptionScreen from '../screens/OtherServiceScreens/TvSubscriptionScreen';
import WalletTransferScreen from '../screens/OtherServiceScreens/WalletTransferScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    InAppUpdate.checkUpdate();

    dispatch(getContactInfo());
    async function getUserSession() {
      try {
        const user_session = await EncryptedStorage.getItem('user_session');
        if (user_session !== undefined) {
          dispatch({type: RESTORE_TOKEN, payload: JSON.parse(user_session)});
        }
      } catch (error) {
        // There was an error on the native side
      }
      dispatch(restoreUser());
    }
    getUserSession();
  }, []);

  if (auth.isRestoringUser) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
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
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            <Stack.Screen
              name="ForgotPasswordRequest"
              component={ForgotPasswordRequest}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotPasswordConfirm"
              component={ConfirmPasswordReset}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotPasswordComplete"
              component={CompletePasswordReset}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Auth"
              component={AddTypePin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={DrawerNavigator}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Deposit"
              component={DepositToWallet}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Withdraw"
              component={Withdraw}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DataCategory"
              component={DataCategoryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DataManagement"
              component={DataManagement}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AgentManagement"
              component={AgentManagement}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DataPlan"
              component={DataPlan}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Airtime"
              component={Airtime}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ElectricityPayment"
              component={ElectricityPayment}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Other"
              component={OtherScreen}
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
              name="Complain"
              component={ComplainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messages"
              component={Messages}
              options={{headerShown: false}}
            />

            {/* other services screen  */}
            <Stack.Screen
              name="ElectricityPaymentScreen"
              component={ElectricityPaymentScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AirtimeToCashScreen"
              component={AirtimeToCashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TvSubscriptionScreen"
              component={TvSubscriptionScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WalletTransferScreen"
              component={WalletTransferScreen}
              options={{headerShown: false}}
            />

            {/* drawer navigations screens  */}
            <Stack.Screen
              name="NetworkScreen"
              component={NetworkScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ActivityDetails"
              component={ActivityDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ApiDocScreen"
              component={ApiDocScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TalkToUsScreen"
              component={TalkToUsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DevelopersInfoScreen"
              component={DevelopersInfoScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AboutUsScreen"
              component={AboutUsScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
