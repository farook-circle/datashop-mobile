import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {screenOptions} from './helpers';
import {ROUTES} from '../lib';
import {
  WelcomeScreen,
  RegistrationScreen,
  LoginScreen,
  VerifyEmailScreen,
  ForgotPasswordRequest,
  ConfirmPasswordReset,
  CompletePasswordReset,
  ResetPassword,
} from '../screens';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={ROUTES.WELCOME_SCREEN}>
      <Stack.Screen
        name={ROUTES.WELCOME_SCREEN}
        component={WelcomeScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.REGISTER_SCREEN}
        component={RegistrationScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.LOGIN_SCREEN}
        component={LoginScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.VERIFY_EMAIL_SCREEN}
        component={VerifyEmailScreen}
      />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD_REQUEST_SCREEN}
        component={ForgotPasswordRequest}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD_CONFIRM_SCREEN}
        component={ConfirmPasswordReset}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD_COMPLETE_SCREEN}
        component={CompletePasswordReset}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.RESET_PASSWORD_SCREEN}
        component={ResetPassword}
        options={screenOptions}
      />
    </Stack.Navigator>
  );
};
