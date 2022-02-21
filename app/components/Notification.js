import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../assets/colors/colors';
import {useSelector} from 'react-redux';

export default function Notification() {
  const notifications = useSelector(state => state.messages.notifications);
  const alertNotification = notification => {
    Alert.alert(notification.title, notification.notification, [
      {text: 'Close'},
    ]);
  };

  const renderMessagesItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          alertNotification({
            title: item.title,
            notification: item.notification,
          })
        }>
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>{item.title}</Text>
          <Text style={styles.messageBody}>
            {item.notification.slice(0, 50)}...
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.noData}>
          <Text style={styles.noDataTitle}>There is no message</Text>
        </View>
      ) : (
        <FlatList
          // eslint-disable-next-line react-native/no-inline-styles
          style={{paddingHorizontal: 30}}
          data={notifications}
          renderItem={renderMessagesItem}
          keyExtractor={item => item.id}
          // horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDataTitle: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
  },
  messageContainer: {
    paddingVertical: 5,
    marginTop: 4,
    borderBottomWidth: 2,
    borderColor: colors.textLight,
  },
  messageTitle: {
    fontFamily: 'Poppins-Bold',
    color: colors.secondary,
    fontSize: 20,
  },
  messageBody: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
});
