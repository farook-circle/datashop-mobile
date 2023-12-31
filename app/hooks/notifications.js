import {useCallback, useEffect} from 'react';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const useNotification = () => {
  const navigation = useNavigation();

  const requestNotificationPermission = async () => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus <= AuthorizationStatus.DENIED) {
      Alert.alert(
        'Permission',
        "We're sorry, but you have denied the notification permission. In order to receive important updates and notifications, please enable notification permission in your device settings.",
      );
    }
  };

  const displayNotification = async (title, body) => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const handleNavigation = (screen, payload) => {
    navigation.navigate(screen, payload);
  };

  const onMessageReceived = useCallback(message => {
    if (message?.collapseKey) {
      const notification = message?.notification;
      if (notification) {
        displayNotification(notification?.title, notification?.body);
      }
      return;
    }

    notifee.displayNotification(JSON.parse(message.data.notifee));
  }, []);

  return {
    onMessageReceived,
    requestNotificationPermission,
    displayNotification,
    handleNavigation,
  };
};
