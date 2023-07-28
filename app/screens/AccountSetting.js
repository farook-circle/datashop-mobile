import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar, Box, Card, HStack, Pressable, VStack} from 'native-base';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../config/dpTopx';

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
        width={'100%'}>
        <Feather name={icon} color="black" size={hp(30)} />
        <Text style={styles.actionTitle}>{title}</Text>
        <Feather name="chevron-right" color={'black'} size={hp(30)} />
      </HStack>
    )}
  </Pressable>
);

export default function AccountSetting({navigation, router}) {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <Box flex={1} safeArea px={'4'}>
      <Header title={'Account'} onBackButtonPress={handleGoBack} />
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
        </VStack>
      </VStack>
    </Box>
  );
}

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
