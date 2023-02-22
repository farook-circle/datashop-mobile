import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Linking,
  Text
} from 'react-native';
import { Avatar, Box, Button, Divider, HStack, Pressable, VStack } from 'native-base';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { hp } from '../../config/dpTopx';
import { useSelector } from 'react-redux';


const MenuItem = ({icon, title}) => (
  <Pressable>
    <HStack alignItems={'center'} space={'2'}>
      {icon}
      <Text style={{fontFamily: 'Poppins-Medium'}}>{title}</Text>
    </HStack>
  </Pressable>
);

const CustomSidebarMenu = (props) => {

    const {user} = useSelector(state => state.auth);
    const {wallet_balance} = useSelector(state => state.wallet);

  return (
    <Box safeArea flex={1} bgColor={'white'}>
      <Box bgColor={'primary.500'} px={'2'} py={'4'}>
        <VStack space={'2'}>
          <HStack space={'3'}>
            <Avatar bgColor={'white'}>
              <Feather name={'user'} color={'blue'} size={hp(25)} />
            </Avatar>
            <VStack>
              <Text
                style={{
                  color: 'white',
                  fontSize: hp(16),
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {user && `${user.first_name} ${user.last_name}`}
              </Text>
              <Text style={{color: 'white'}}>{user && user.username}</Text>
            </VStack>
          </HStack>

          <Text style={{color: 'white'}}>{user && user.email}</Text>
          <Text style={{color: 'white'}}>Date Joined:</Text>
        </VStack>
        <Divider bgColor={'white'} mt={'2'} />
        <VStack>
          <Text style={{color: 'white'}}>BALANCE:</Text>
          <Text style={{color: 'white', fontSize: hp(20)}}>
            ₦ {wallet_balance}
          </Text>
        </VStack>
      </Box>
      <Box px={2} py={2}>
        <Box w={'100%'} bgColor={'yellow.400'} p={'3'}>
          <VStack space={'1'}>
            <Text style={{fontFamily: 'Poppins-SemiBold'}}>
              Upgrade to super agent
            </Text>
            <Text style={{fontFamily: 'Poppins-Regular'}}>
              Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet
              consectetur.
            </Text>
            <Button size={'sm'} w={'40%'}>
              Learn more
            </Button>
          </VStack>
        </Box>
        <VStack mt={'4'} px={'2'} space={'2'}>
          <MenuItem
            title={'About Datashop'}
            icon={<Feather name="info" size={hp(25)} />}
          />
          <MenuItem
            title={'Talk to us 🥰'}
            icon={<Feather name="send" size={hp(25)} />}
          />
          <MenuItem
            title={'Pricing'}
            icon={<FontAwesome5Icon name="chart-pie" size={hp(25)} />}
          />
          <MenuItem
            title={'API Doc'}
            icon={<FontAwesome5Icon name="book" size={hp(25)} />}
          />
          <MenuItem
            title={'Network'}
            icon={<Feather name="globe" size={hp(25)} />}
          />
          <MenuItem
            title={"Developer's info"}
            icon={<FontAwesome5Icon name="laptop" size={hp(25)} />}
          />
        </VStack>
        <Divider mt={'6'} />
        <VStack mt={'2'} px={'2'} space={'2'}>
          <MenuItem
            title={'Change password'}
            icon={<Feather name="unlock" size={hp(25)} />}
          />
          <MenuItem
            title={"Log out"}
            icon={<Feather name="log-out" size={hp(25)} />}
          />
        </VStack>
      </Box>
    </Box>
  );
};



export default CustomSidebarMenu;