/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {displayNotification} from './app/lib';

function onMessageReceived(message) {
  if (message?.collapseKey) {
    const notification = message?.notification;
    if (notification) {
      displayNotification(notification?.title, notification?.body);
    }
    return;
  }

  notifee.displayNotification(JSON.parse(message.data.notifee));
}

// Register background handler for firebase notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  onMessageReceived(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
