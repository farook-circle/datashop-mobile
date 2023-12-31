import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  AuthNavigator,
  DashboardNavigator,
  NetworkNavigator,
  ServerNavigator,
} from '../navigation';
import {SplashScreen, FullPageLoader} from '../components';
import {useSelector} from 'react-redux';
import {useNotification, useSession} from '../hooks';
import {View} from 'native-base';
import {useAuthNavigation} from './hooks';

const MainNavigation = () => {
  const {isAuthenticated, isRestoringUser} = useSelector(state => state.auth);
  const {restoreSession} = useSession();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isRestoringUser) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <DashboardNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export const AppNavigator = ({isConnected, isServerRunning}) => {
  const {panResponder} = useAuthNavigation();

  return (
    <View flex={1} {...panResponder.panHandlers}>
      {isConnected === null || isServerRunning === null ? (
        <FullPageLoader />
      ) : !isConnected ? (
        <NetworkNavigator />
      ) : isConnected && !isServerRunning ? (
        <ServerNavigator />
      ) : (
        <MainNavigation />
      )}
    </View>
  );
};
