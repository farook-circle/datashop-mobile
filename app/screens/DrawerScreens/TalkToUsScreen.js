import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import {Linking, StyleSheet, Touchable, TouchableOpacity} from 'react-native';
import {hp} from '../../config/dpTopx';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {MainLayout} from '../../components';
import colors from '../../../assets/colors/colors';

const SocialMedias = [
  {
    label: 'Chat',
    type: 'whatsapp',
    color: 'green',
    description: 'WhatsApp',
  },
  {
    label: 'Follow',
    type: 'facebook',
    color: 'blue',
    description: 'Facebook',
  },

  {
    label: 'Chat',
    type: 'messenger',
    color: 'blue',
    description: 'Messenger',
  },
];

export const TalkToUsScreen = ({navigation, route}) => {
  const whatsapp = useSelector(state => state.config.contact_info);

  const openWhatsapp = async () => {
    const isWhatsappInstalled = await Linking.canOpenURL('whatsapp://');
    if (isWhatsappInstalled) {
      Linking.openURL(
        'whatsapp://send?text=' +
          whatsapp.message +
          '&phone=' +
          whatsapp.number,
      );
      return;
    }

    let url = `https://api.whatsapp.com/send?phone=${whatsapp.number}`;
    url += `&text=${encodeURI(whatsapp.message)}&app_absent=0`;
    Linking.openURL(url);
  };

  const openMessenger = () => {
    Linking.openURL('http://m.me/DataShopNG');
  };

  return (
    <MainLayout showHeader={true} headerTitle={'Contact us'}>
      <VStack space={'3'} width={'100%'} px={'6'}>
        <Text fontSize={'md'} my={3}>
          If you have any inquiry, please contact us on any of the following,
          we'll be glad to help you.
        </Text>
        <HStack
          shadow={2}
          backgroundColor={'white'}
          rounded={'4'}
          p={'3'}
          space={'2'}
          alignItems={'center'}>
          <Avatar bgColor={'white'} shadow={1} rounded={'lg'}>
            <Feather name={'phone'} color={'green'} size={hp(20)} />
          </Avatar>
          <VStack>
            <Text>Phone</Text>
            <Text fontWeight={'semibold'}>+234847394843</Text>
          </VStack>
        </HStack>
        <HStack
          shadow={2}
          backgroundColor={'white'}
          rounded={'4'}
          p={'3'}
          space={'2'}
          alignItems={'center'}>
          <Avatar bgColor={'white'} rounded={'lg'} shadow={1}>
            <Feather name={'mail'} color={colors.primary} size={hp(25)} />
          </Avatar>
          <VStack>
            <Text>Email</Text>
            <Text fontWeight={'semibold'}>datashop@farookcircle.com</Text>
          </VStack>
        </HStack>
        <VStack
          shadow={2}
          backgroundColor={'white'}
          rounded={'4'}
          p={'3'}
          space={'2'}>
          <Text fontSize={'md'} fontWeight={'semibold'}>
            Get in touch on social media
          </Text>

          <HStack space={'2'}>
            <TouchableOpacity onPress={openWhatsapp} activeOpacity={0.7}>
              <Avatar bgColor={'white'} shadow={1} rounded={'lg'}>
                <Fontisto name={'whatsapp'} color={'green'} size={hp(25)} />
              </Avatar>
            </TouchableOpacity>
            <TouchableOpacity onPress={openMessenger} activeOpacity={0.7}>
              <Avatar bgColor={'white'} shadow={1} rounded={'lg'}>
                <Fontisto
                  name={'messenger'}
                  color={colors.primary}
                  size={hp(25)}
                />
              </Avatar>
            </TouchableOpacity>
          </HStack>
        </VStack>
      </VStack>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(17),
  },
  headerContainer: {},
});
