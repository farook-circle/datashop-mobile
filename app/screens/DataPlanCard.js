/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {VStack, HStack, Divider, Avatar, Button} from 'native-base';
import {Text} from 'react-native';
import {hp} from '../config/dpTopx';

import Icon from 'react-native-vector-icons/Feather';
import {formatCurrency} from '../utils';

const getBgColor = text => {
  if (text?.toLowerCase().includes('mtn')) {
    return 'yellow.200';
  }

  if (text?.toLowerCase().includes('9mobile')) {
    return '#D6F26A';
  }

  if (text?.toLowerCase().includes('glo')) {
    return 'green.200';
  }
  if (text?.toLowerCase().includes('airtel')) {
    return 'red.200';
  }

  return 'gray.300';
};

export const DataPlanCard = ({
  item,
  showProceed,
  onPress,
  bgColor = 'white',
}) => {
  return (
    <VStack
      bgColor={getBgColor(item?.service)}
      rounded={'10px'}
      padding={'15px'}
      marginTop={'4'}
      space={1}
      shadow={4}>
      <Text
        style={{
          fontFamily: 'Poppins-SemiBold',
          color: 'black',
          fontSize: hp(16),
        }}
        numberOfLines={1}>
        {'Betamix Bundle Max'}
      </Text>

      <Text
        style={{
          color: 'black',
          fontFamily: 'Poppins-Regular',
          fontSize: hp(13),
        }}
        numberOfLines={2}>
        {item.description} only on datashop
      </Text>
      <HStack
        width={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <Avatar marginLeft={-8} bgColor={bgColor} size={'25px'} />
        <Divider
          bg={'gray.700'}
          thickness={'0.5px'}
          flex={1}
          borderStyle={'dashed'}
        />
        <Avatar marginRight={-8} bgColor={bgColor} size={'25px'} />
      </HStack>
      <HStack justifyContent={'space-between'}>
        <HStack alignItems={'center'} divider={<Divider />} space={'2'}>
          <VStack>
            <HStack alignItems={'center'} space={'0.5'}>
              <Icon name={'clock'} size={hp(10)} color={'gray'} />
              <Text
                style={{
                  color: 'gray',
                  fontSize: hp(13),
                  fontFamily: 'Poppins-Regular',
                }}>
                Validity
              </Text>
            </HStack>

            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: hp(14),
                color: 'black',
              }}>
              {item.validity}
            </Text>
          </VStack>
          <VStack>
            <HStack alignItems={'center'} space={'0.5'}>
              <Icon name={'credit-card'} size={hp(11)} color={'gray'} />
              <Text
                style={{
                  color: 'gray',
                  fontSize: hp(13),
                  fontFamily: 'Poppins-Regular',
                }}>
                Price
              </Text>
            </HStack>

            <Text style={{fontFamily: 'Poppins-SemiBold', color: 'black'}}>
              {formatCurrency(item.price)}
            </Text>
          </VStack>
        </HStack>
        {showProceed && (
          <Button
            onPress={() => onPress(item)}
            _text={{color: 'yellow.600'}}
            borderColor={'yellow.700'}
            rounded={'full'}
            variant={'outline'}
            px={'6'}
            py={'1'}>
            Proceed
          </Button>
        )}
      </HStack>
    </VStack>
  );
};
