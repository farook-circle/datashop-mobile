import React from 'react';
import {MainLayout} from '../../components';
import {Avatar, Box, Button, HStack, Pressable, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../lib';
import Feather from 'react-native-vector-icons/Feather';

const options = [
  {
    id: 1,
    name: 'Change password',
    screen: ROUTES.PROFILE_SCREEN,
    icon: 'lock',
  },
  {
    id: 2,
    name: 'Two factor Authentication (2FA)',
    screen: ROUTES.MULTIFACTOR_SCREEN,
    icon: 'key',
  },
];

export const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <MainLayout showHeader={true} headerTitle={'Settings'}>
      <Box flex={1} px={'4'}>
        {options.map((option, key) => (
          <Pressable
            key={key}
            onPress={() => navigation.navigate(option.screen)}>
            <HStack
              mt={'2'}
              space={'2'}
              alignItems={'center'}
              p={1}
              bgColor={'primary.100'}
              rounded={'full'}>
              <Avatar bgColor={'primary.100'} size={'sm'} borderWidth={2}>
                <Feather name={option.icon} size={16} color={'black'} />
              </Avatar>
              <Text fontSize={'md'}>{option.name}</Text>
            </HStack>
          </Pressable>
        ))}
      </Box>
    </MainLayout>
  );
};
