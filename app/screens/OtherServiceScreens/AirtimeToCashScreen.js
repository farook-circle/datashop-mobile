/* eslint-disable react-native/no-inline-styles */
import {Box, Button, IconButton} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import {hp} from '../../config/dpTopx';
import {MainLayout} from '../../components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useSelector} from 'react-redux';
import {Linking} from 'react-native';

export const AirtimeToCashScreen = ({navigation}) => {
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

  return (
    <MainLayout headerTitle={'Airtime to Cash'} showHeader={true}>
      <Box flex={1} px={'4'} safeArea alignItems={'center'}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
            color: 'black',
            fontSize: hp(14),
          }}>
          Service coming soon. However, you can always contact our customer care
          to convert your airtime to cash manually.
        </Text>

        <Box flex={1} justifyContent={'flex-end'} width={'full'}>
          <Button
            width={'full'}
            onPress={openWhatsapp}
            leftIcon={<Fontisto name={'whatsapp'} size={18} color={'white'} />}
            size={'lg'}
            mt={'4'}>
            Talk to us
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};
