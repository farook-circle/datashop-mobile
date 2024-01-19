import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../lib';
import {screenOptions} from './helpers';
import {DrawerNavigator} from './DrawerNavigator';
import {
  AddTypePin,
  Profile,
  AccountSetting,
  AccountStatement,
  EditProfile,
  DepositScreen,
  Withdraw,
  DataCategoryScreen,
  DataManagement,
  AgentManagement,
  DataPlan,
  AirtimeScreen,
  ElectricityPayment,
  OtherScreen,
  CheckOut,
  History,
  Receipt,
  ComplainScreen,
  Messages,
  ElectricityPaymentScreen,
  AirtimeToCashScreen,
  TvSubscriptionScreen,
  ExamPaymentScreen,
  WalletTransferScreen,
  NetworkScreen,
  ActivityDetails,
  ApiDocScreen,
  TalkToUsScreen,
  DevelopersInfoScreen,
  AboutUsScreen,
  BvnUpdateScreen,
  ReceiptScreen,
} from '../screens';
import {TicketListScreen, TicketMessageScreen} from '../screens/ticket';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useNotification} from '../hooks';

const Stack = createNativeStackNavigator();

export const DashboardNavigator = () => {
  const {onMessageReceived, handleNavigation} = useNotification();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async message => {
      onMessageReceived(message);
    });

    return () => {
      unsubscribe();
    };
  }, [onMessageReceived]);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          break;
      }

      if (detail?.pressAction?.id === 'view_ticket') {
        const ticket = detail.notification?.data?.ticket;

        handleNavigation(ROUTES.TICKET_MESSAGE_SCREEN, {ticket});
      }
    });

    notifee.onBackgroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          break;
      }

      if (detail?.pressAction?.id === 'view_ticket') {
        const ticket = detail.notification?.data?.ticket;

        handleNavigation(ROUTES.TICKET_MESSAGE_SCREEN, {ticket});
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.PASSCODE_SCREEN}
      screenOptions={screenOptions}>
      <Stack.Screen
        name={ROUTES.PASSCODE_SCREEN}
        component={AddTypePin}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.HOME_SCREEN}
        component={DrawerNavigator}
        options={screenOptions}
      />

      <Stack.Screen
        name={ROUTES.PROFILE_SCREEN}
        component={Profile}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.ACCOUNT_SETTING_SCREEN}
        component={AccountSetting}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.ACCOUNT_STATEMENT_SCREEN}
        component={AccountStatement}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE_SCREEN}
        component={EditProfile}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.DEPOSIT_SCREEN}
        component={DepositScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.WITHDRAW_SCREEN}
        component={Withdraw}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.DATA_CATEGORY_SCREEN}
        component={DataCategoryScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.DATA_MANAGEMENT_SCREEN}
        component={DataManagement}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.AGENT_MANAGEMENT_SCREEN}
        component={AgentManagement}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.DATA_PLAN_SCREEN}
        component={DataPlan}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.AIRTIME_SCREEN}
        component={AirtimeScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.ELECTRICITY_PAYMENT}
        component={ElectricityPayment}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.OTHER_SCREEN}
        component={OtherScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.TICKET_LIST_SCREEN}
        component={TicketListScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.TICKET_MESSAGE_SCREEN}
        component={TicketMessageScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.CHECKOUT_SCREEN}
        component={CheckOut}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.HISTORY_SCREEN}
        component={History}
        options={screenOptions}
      />

      <Stack.Screen
        name={ROUTES.RECEIPT_SCREEN}
        component={ReceiptScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.COMPLAIN_SCREEN}
        component={ComplainScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.MESSAGES_SCREEN}
        component={Messages}
        options={screenOptions}
      />

      {/* other services screen  */}
      <Stack.Screen
        name={ROUTES.ELECTRICITY_PAYMENT_SCREEN}
        component={ElectricityPaymentScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.AIRTIME_TO_CASH_SCREEN}
        component={AirtimeToCashScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.TV_SUBSCRIPTION_SCREEN}
        component={TvSubscriptionScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.EXAM_PAYMENT_SCREEN}
        component={ExamPaymentScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.WALLET_TRANSFER_SCREEN}
        component={WalletTransferScreen}
        options={screenOptions}
      />

      <Stack.Screen
        name={ROUTES.USER_BVN_UPDATE}
        component={BvnUpdateScreen}
        options={screenOptions}
      />

      {/* drawer navigation screens  */}
      <Stack.Screen
        name={ROUTES.NETWORK_SCREEN}
        component={NetworkScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.ACTIVITY_DETAILS_SCREEN}
        component={ActivityDetails}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.API_DOC_SCREEN}
        component={ApiDocScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.TALK_TO_US_SCREEN}
        component={TalkToUsScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.DEVELOPERS_INFO_SCREEN}
        component={DevelopersInfoScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name={ROUTES.ABOUT_US_SCREEN}
        component={AboutUsScreen}
        options={screenOptions}
      />
    </Stack.Navigator>
  );
};
