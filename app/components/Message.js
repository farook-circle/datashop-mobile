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
import {wp, hp} from '../config/dpTopx';

export default function Message() {
  const messages = useSelector(state => state.messages.messages);
  const alertNotification = message => {
    Alert.alert(message.title, message.message, [{text: 'Close'}]);
  };

  const renderMessagesItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          alertNotification({
            title: item.title,
            message: item.message,
          })
        }>
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>{item.title}</Text>
          <Text style={styles.messageBody}>{item.message.slice(0, 50)}...</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {messages.length === 0 ? (
        <View style={styles.noData}>
          <Text style={styles.noDataTitle}>There is no message</Text>
        </View>
      ) : (
        <FlatList
          // eslint-disable-next-line react-native/no-inline-styles
          style={{paddingHorizontal: 30}}
          data={messages}
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
    fontSize: hp(16),
  },
  messageContainer: {
    paddingVertical: 5,
    marginTop: hp(4),
    borderBottomWidth: 2,
    borderColor: colors.textLight,
  },
  messageTitle: {
    fontFamily: 'Poppins-Bold',
    color: colors.secondary,
    fontSize: hp(20),
  },
  messageBody: {
    fontFamily: 'Poppins-Light',
    fontSize: hp(14),
  },
});
