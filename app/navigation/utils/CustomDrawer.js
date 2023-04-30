import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Linking,
  Text,
  Alert,
} from 'react-native';
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Pressable,
  VStack,
} from 'native-base';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {hp} from '../../config/dpTopx';
import {useDispatch, useSelector} from 'react-redux';
import {USER_LOGOUT} from '../../redux/constants/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../../assets/colors/colors';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const MenuItem = ({icon, title, onPress}) => (
  <Pressable onPress={onPress}>
    {({isPressed, isHovered, isFocused}) => (
      <HStack
        alignItems={'center'}
        space={'2'}
        bgColor={isPressed ? 'primary.100' : 'transparent'}
        rounded={'lg'}
        p={'2'}>
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

  const hanldeChangePassword = () => {
    props.navigation.navigate('Profile');
    props.navigation.closeDrawer();
  };

  const navigateToDrawerScreen = screen => {
    props.navigation.navigate(screen);
    props.navigation.closeDrawer();
  };

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
        {/* <Box w={'100%'} bgColor={'yellow.400'} p={'3'}>
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
        </Box> */}
        <VStack mt={'4'} px={'2'}>
        <MenuItem
            onPress={() => navigateToDrawerScreen('ActivityDetails')}
            title={'Activity Details'}
            icon={<Feather name="pie-chart" color={'white'} size={hp(20)} />}
          />

          <MenuItem
            onPress={() => navigateToDrawerScreen('NetworkScreen')}
            title={'Network'}
            icon={<Feather name="globe" color={'white'} size={hp(20)} />}
          />

          <MenuItem
            onPress={() => navigateToDrawerScreen('ApiDocScreen')}
            title={'API Doc'}
            icon={
              <FontAwesome5Icon name="book" color={'white'} size={hp(20)} />
            }
          />
          <MenuItem
            onPress={() => navigateToDrawerScreen('TalkToUsScreen')}
            title={'Talk to us'}
            icon={<Feather name="send" color={'white'} size={hp(20)} />}
          />
          <MenuItem
            onPress={() => navigateToDrawerScreen('DevelopersInfoScreen')}
            title={"Developer's info"}
            icon={
              <FontAwesome5Icon name="laptop" color={'white'} size={hp(20)} />
            }
          />
          <MenuItem
            onPress={() => navigateToDrawerScreen('AboutUsScreen')}
            title={'About Datashop'}
            icon={<Feather name="info" color={'white'} size={hp(20)} />}
          />
        </VStack>

        <View style={{marginTop: hp(30)}}>
          <Divider />
          <VStack mt={'2'} px={'2'}>
            <MenuItem
              onPress={hanldeChangePassword}
              title={'Change password'}
              icon={<Feather name="unlock" color={'white'} size={hp(20)} />}
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

export default CustomSidebarMenu;
