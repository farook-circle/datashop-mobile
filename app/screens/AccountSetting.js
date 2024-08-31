import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar, Box, Card, HStack, Pressable, VStack} from 'native-base';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';
import {MainLayout} from '../components';
import {ROUTES} from '../lib';
import {useDispatch} from 'react-redux';
import {USER_LOGOUT} from '../redux/constants/auth';

const AccountOption = ({icon, title, color = 'primary.500', onPress}) => (
  <Pressable onPress={onPress} width={'100%'}>
    {({isPressed}) => (
      <HStack
        alignItems={'center'}
        justifyContent={'space-between'}
        rounded={'lg'}
        space={'4'}
        p={'2'}
        bgColor={isPressed ? 'rgba(0,0,0,0.1)' : 'transparent'}
        borderBottomWidth={1}
        borderBottomColor={'gray.200'}
        py={'4'}
        width={'100%'}>
        <Avatar size={'sm'} bgColor={color}>
          <Feather name={icon} color="white" size={hp(14)} />
        </Avatar>
        <Text style={styles.actionTitle}>{title}</Text>
        <Feather name="chevron-right" color={'gray'} size={hp(20)} />
      </HStack>
    )}
  </Pressable>
);

export const AccountSetting = ({navigation, router}) => {
  const dispatch = useDispatch();

  const requestAccountRemoval = () => {
    Alert.alert(
      'Account Removal Request',
      'Are you sure you want to remove your account? This action cannot be undone. After your request, the account removal process will begin. It will take 30 days to complete. You can cancel the request by logging in within this period.',
      [
        {
          text: 'Cancel',

          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleAccountRemoval(),
        },
      ],
      {cancelable: false},
    );
  };

  const handleAccountRemoval = () => {
    dispatch({type: USER_LOGOUT});
  };

  return (
    <MainLayout showHeader={true} headerTitle={'Account'}>
      <VStack
        alignItems={'center'}
        pt={'20'}
        flex={'1'}
        pb={'10'}
        space={'5'}
        width={'100%'}>
        <Avatar size={'xl'} bgColor={'primary.400'}>
          <Feather name="user" color={'white'} size={hp(40)} />
        </Avatar>

        <VStack
          bgColor={'white'}
          flex={'1'}
          width={'100%'}
          rounded={'2xl'}
          p={'4'}>
          <AccountOption
            title={'Download Statement'}
            icon={'download-cloud'}
            onPress={() => navigation.navigate('AccountStatement')}
          />
          <AccountOption
            title={'Delete Account'}
            icon={'trash-2'}
            color={'red.500'}
            onPress={requestAccountRemoval}
          />
        </VStack>
      </VStack>
    </MainLayout>
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
