import Clipboard from '@react-native-clipboard/clipboard';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  Button,
  useTheme,
  IconButton,
} from 'native-base';
import React from 'react';
import {Share} from 'react-native';
import {Alert} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {hp} from '../../config/dpTopx';

export const ManualDeposit = ({manualDepositData, onClose}) => {
  const {colors} = useTheme();

  const handleClipBoard = text => {
    Clipboard.setString(text);
    Alert.alert('Alert', 'Copied');
  };

  const handleShareAccountDetails = async () => {
    try {
      const result = await Share.share({
        message: `Account Name: ${manualDepositData?.account_name} \n Account Number: ${manualDepositData?.account_number} \n Bank: ${manualDepositData?.bank_name}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          
        } else {
          
        }
      } else if (result.action === Share.dismissedAction) {
        
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box flex={1}>
      <HStack width={'full'}>
        <IconButton
          onPress={() => onClose()}
          rounded={'full'}
          icon={<Feather name={'x'} color={colors.primary[500]} size={25} />}
        />
      </HStack>
      <VStack
        width={'100%'}
        p={'3'}
        space={'3'}
        bgColor={'white'}
        shadow={'1'}
        rounded={'xl'}>
        <HStack alignItems={'center'} space={2}>
          <Avatar size={hp(45)} rounded={'xl'} bgColor={'primary.100'}>
            <Feather name={'hash'} size={20} color={colors.primary[500]} />
          </Avatar>
          <VStack flex={1}>
            <Text fontSize={'sm'} color={'gray.500'}>
              {manualDepositData?.bank_name}
            </Text>
            <Text fontSize={'lg'} fontWeight={'medium'}>
              {manualDepositData?.account_number}
            </Text>
          </VStack>
        </HStack>
        <Divider my={'1'} />
        <HStack alignItems={'center'} space={2}>
          <Avatar size={'md'} rounded={'xl'} bgColor={'primary.100'}>
            <MaterialCommunityIcons
              name={'bank'}
              size={hp(20)}
              color={colors.primary[500]}
            />
          </Avatar>
          <VStack flex={1}>
            <Text fontSize={'sm'} color={'gray.500'}>
              Bank
            </Text>
            <Text fontSize={'lg'} fontWeight={'medium'}>
              {manualDepositData?.bank_name}
            </Text>
          </VStack>
        </HStack>
        <Divider my={'1'} />
        <HStack alignItems={'center'} space={2}>
          <Avatar size={'md'} rounded={'xl'} bgColor={'primary.100'}>
            <Feather name={'user'} size={20} color={colors.primary[500]} />
          </Avatar>
          <VStack flex={1}>
            <Text fontSize={'sm'} color={'gray.500'}>
              Name
            </Text>
            <Text fontSize={'lg'} fontWeight={'medium'}>
              {manualDepositData?.account_name}
            </Text>
          </VStack>
        </HStack>

        <HStack width={'full'} space={'2'} mt={'3'}>
          <Button
            rounded={'xl'}
            colorScheme={'coolGray'}
            flex={1}
            onPress={() => handleClipBoard(manualDepositData?.account_number)}>
            Copy Number
          </Button>
          <Button rounded={'xl'} flex={1} onPress={handleShareAccountDetails}>
            Share Details
          </Button>
        </HStack>
      </VStack>
      <VStack
        width={'100%'}
        mt={hp(2)}
        p={'4'}
        space={'3'}
        bgColor={'white'}
        shadow={'1'}
        rounded={'xl'}>
        <Text fontSize={'xl'}>Instructions</Text>
        <Text fontSize={'md'} lineHeight={'xl'}>
          {manualDepositData?.instructions}
        </Text>
      </VStack>
    </Box>
  );
};
