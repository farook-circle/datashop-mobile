import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar, Box, Card, HStack, Pressable, VStack} from 'native-base';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';
import {MainLayout} from '../components';
import {ROUTES} from '../lib';

const AccountOption = ({icon, title, onPress}) => (
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
        <Avatar size={'sm'} bgColor={'primary.500'}>
          <Feather name={icon} color="white" size={hp(14)} />
        </Avatar>
        <Text style={styles.actionTitle}>{title}</Text>

        <Feather name="chevron-right" color={'gray'} size={hp(20)} />
      </HStack>
    )}
  </Pressable>
);

export const AccountSetting = ({navigation, router}) => {
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
            title={'Security'}
            icon={'lock'}
            onPress={() => navigation.navigate(ROUTES.SECURITY_LIST_SCREEN)}
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
