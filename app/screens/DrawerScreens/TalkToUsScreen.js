import {Box, Button, HStack, IconButton, Pressable, VStack} from 'native-base';
import React from 'react';
import {Linking, StyleSheet, Text} from 'react-native';
import {hp} from '../../config/dpTopx';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

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

export default function TalkToUsScreen({navigation, route}) {
  const whatsapp = useSelector(state => state.config.contact_info);

  const openFacebook = () => {
    Linking.openURL('fb://page/DataShopNG');
  };

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

  const openSocialMedia = social => {
    switch (social) {
      case 'facebook':
        openFacebook();
        break;
      case 'whatsapp':
        openWhatsapp();
        break;
      case 'messenger':
        openMessenger();
        break;
      default:
        return;
    }
  };

  return (
    <Box safeArea flex={1} px={'3'} pt={'2'}>
      <HStack alignItems={'center'} space={'2'}>
        <IconButton
          onPress={() => navigation.goBack()}
          rounded={'full'}
          icon={<Feather name={'chevron-left'} size={hp(30)} color={'black'} />}
        />
        <Text style={styles.headerText}>Contact us</Text>
      </HStack>
      <VStack space={'2'} width={'100%'}>
        {SocialMedias.map((data, index) => (
          <Pressable onPress={() => openSocialMedia(data.type)}>
            {({isPressed}) => (
              <HStack
                width={'100%'}
                key={index}
                alignItems={'center'}
                space={'4'}
                bgColor={isPressed ? 'primary.100' : 'transparent'}
                p={'4'}
                rounded={'4'}
                borderWidth={'1'}
                borderColor={'primary.500'}>
                <Box width={hp(30)}>
                  <Fontisto name={data.type} color={data.color} size={hp(25)} />
                </Box>
                <Text
                  style={{flex: 1, color: 'black', fontFamily: 'Poppins-Bold'}}>
                  {data.description}
                </Text>
              </HStack>
            )}
          </Pressable>
        ))}
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(17),
  },
  headerContainer: {},
});
