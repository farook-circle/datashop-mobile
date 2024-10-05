/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, Platform, TouchableOpacity} from 'react-native';
import {Avatar, Box, Divider, HStack, Pressable, VStack} from 'native-base';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {hp} from '../../config/dpTopx';
import {useDispatch, useSelector} from 'react-redux';
import {USER_LOGOUT} from '../../redux/constants/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../../assets/colors/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import {ROUTES} from '../../lib';
import {formatCurrency} from '../../utils';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {StyleSheet} from 'react-native';

const MenuItem = ({icon, title, onPress}) => (
  <Pressable onPress={onPress}>
    {({isPressed}) => (
      <HStack
        alignItems={'center'}
        space={'2'}
        bgColor={isPressed ? 'primary.100' : 'transparent'}
        rounded={'lg'}
        my={hp(4.5)}
        p={hp(0)}>
        <Avatar shadow={'3'} size={'sm'} bgColor={'primary.500'} rounded={'lg'}>
          {icon}
        </Avatar>
        <Text style={{fontFamily: 'Poppins-Medium', color: colors.primary}}>
          {title}
        </Text>
      </HStack>
    )}
  </Pressable>
);

const CustomSidebarMenu = props => {
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const {wallet_balance} = useSelector(state => state.wallet);

  async function removeUserToken() {
    try {
      await EncryptedStorage.removeItem('user_session');
      await EncryptedStorage.removeItem('userPin');
      // Congrats! You've just removed your first value!
    } catch (error) {
      // There was an error on the native side
    }
    dispatch({type: USER_LOGOUT});
  }

  const handleLogout = () => {
    Alert.alert('Alert', 'Are you sure you want to log-out', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => removeUserToken()},
    ]);
  };

  const handleNavigateSettings = () => {
    props.navigation.navigate(ROUTES.SETTINGS_SCREEN);
    props.navigation.closeDrawer();
  };

  const navigateToDrawerScreen = screen => {
    if (screen === 'TalkToUsScreen') {
      props.navigation.navigate('TalkToUsScreen');
      props.navigation.closeDrawer();
      return;
    }
    props.navigation.navigate(screen);
    props.navigation.closeDrawer();
  };

  const handleVerifyBvn = () => {
    if (!user?.details?.is_bvn_verified) {
      navigateToDrawerScreen(ROUTES.USER_BVN_UPDATE);
    }
  };

  return (
    <Box flex={1} bgColor={'white'}>
      <Box safeArea bgColor={'primary.500'} px={'4'} pb={'4'} pt={'2'}>
        <VStack space={'2'}>
          <HStack space={'3'}>
            <Avatar
              bgColor={'white'}
              borderColor={'amber.700'}
              borderWidth={'2'}>
              <Feather name={'user'} color={'blue'} size={hp(25)} />
            </Avatar>
            <VStack>
              <Text
                style={{
                  color: 'white',
                  fontSize: hp(14),
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {user && `${user.first_name} ${user.last_name}`}
              </Text>
              <Text style={{color: 'white', fontFamily: 'Poppins-Regular'}}>
                {user && user.username}
              </Text>
            </VStack>
          </HStack>
          <VStack>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Regular',
                fontSize: hp(13),
              }}>
              Email: {user && user.email}
            </Text>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Regular',
                fontSize: hp(13),
              }}>
              Date Joined:{' '}
              {user &&
                user.date_joined &&
                new Date(user.date_joined).toDateString()}
            </Text>
          </VStack>
        </VStack>

        <VStack
          bgColor={'primary.800'}
          // shadow={'4'}
          p={'2'}
          mt={2}
          rounded={'4'}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Medium',
              fontSize: hp(13),
            }}>
            BALANCE:
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: hp(20),
              fontFamily: 'Poppins-SemiBold',
            }}>
            {formatCurrency(wallet_balance)}
          </Text>
        </VStack>
      </Box>
      <Box px={2} py={2} flex={1}>
        <DrawerContentScrollView
          {...props}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.drawerContainer}>
          <VStack mt={'4'} px={'2'}>
            <MenuItem
              onPress={() => navigateToDrawerScreen('AccountSetting')}
              title={'Account'}
              icon={<Feather name="user" color={'white'} size={hp(20)} />}
            />
            <MenuItem
              onPress={() => navigateToDrawerScreen('ActivityDetails')}
              title={'Statistics'}
              icon={<Feather name="pie-chart" color={'white'} size={hp(20)} />}
            />

            <MenuItem
              onPress={() => navigateToDrawerScreen('NetworkScreen')}
              title={'Network'}
              icon={<Feather name="globe" color={'white'} size={hp(20)} />}
            />

            <MenuItem
              onPress={() => navigateToDrawerScreen(ROUTES.LIVE_CHAT_SCREEN)}
              title={'Live Chat'}
              icon={<Entypo name="message" color={'white'} size={hp(20)} />}
            />

            <MenuItem
              onPress={() => navigateToDrawerScreen('TalkToUsScreen')}
              title={'Talk to us'}
              icon={<Feather name="send" color={'white'} size={hp(20)} />}
            />
            <MenuItem
              onPress={() => navigateToDrawerScreen('ApiDocScreen')}
              title={'API Doc'}
              icon={
                <FontAwesome5Icon name="book" color={'white'} size={hp(20)} />
              }
            />

            <MenuItem
              onPress={() => navigateToDrawerScreen('AboutUsScreen')}
              title={'About Datashop'}
              icon={<Feather name="info" color={'white'} size={hp(20)} />}
            />
          </VStack>
        </DrawerContentScrollView>

        <View style={{marginBottom: hp(2)}}>
          <Divider />
          <VStack mt={'2'} px={'2'}>
            <MenuItem
              onPress={handleNavigateSettings}
              title={'Settings'}
              icon={<Feather name="settings" color={'white'} size={hp(20)} />}
            />
            <MenuItem
              onPress={handleLogout}
              title={'Log out'}
              icon={<Feather name="log-out" color={'white'} size={hp(20)} />}
            />
          </VStack>
        </View>
      </Box>
    </Box>
  );
};

export const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? -50 : -20,
    zIndex: 10,
  },
});

export default CustomSidebarMenu;
