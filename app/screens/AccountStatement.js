import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  HStack,
  Input,
  Pressable,
  VStack,
} from 'native-base';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {requestForStatement} from '../api/account.api';
import {useSelector} from 'react-redux';

export const AccountStatement = ({navigation, router}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const {user} = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(user?.email);

  const handleDownloadStatement = async () => {
    setLoading(true);
    const request = await requestForStatement({startDate, endDate, email});

    if (request.ok) {
      Alert.alert('Success', request.data.message);
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Error',
      request.data?.message || 'Error has occur please try again',
    );
    setLoading(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleCalendar = (currentDate, setDateTo) => {
    DateTimePickerAndroid.open({
      mode: 'date',
      value: currentDate,
      onChange: (evt, value) => setDateTo(value),
    });
  };

  const DatePickerComp = ({title, onPress}) => (
    <Pressable onPress={onPress}>
      <HStack borderWidth={'1'} borderColor={'gray.400'} p={'3'} rounded={'lg'}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Feather name="chevron-down" color={'black'} size={hp(20)} />
      </HStack>
    </Pressable>
  );

  return (
    <Box flex={1} safeArea px={'4'}>
      <Header title={'Download Statement'} onBackButtonPress={handleGoBack} />
      <VStack pt={'4'} space={'3'}>
        <FormControl>
          <FormControl.Label>Start Date</FormControl.Label>
          <DatePickerComp
            title={startDate.toDateString()}
            onPress={() => handleToggleCalendar(startDate, setStartDate)}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>End Date</FormControl.Label>
          <DatePickerComp
            title={endDate.toDateString()}
            onPress={() => handleToggleCalendar(endDate, setEndDate)}
          />
        </FormControl>
        <Text>Date range for account statement cannot exceed 3 Months</Text>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Email"
          />
        </FormControl>
        <Button p={'4'} onPress={handleDownloadStatement} isLoading={loading}>
          Send
        </Button>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    flex: 1,
  },
});
