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
import {Alert} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ManualDeposit = ({manualDepositData, onClose}) => {
  const {colors} = useTheme();

  const handleClipBoard = text => {
    Clipboard.setString(text);
    Alert.alert('Alert', 'Copied');
  };

  return (
    <Box flex={1} px={'4'}>
      <HStack width={'full'}>
        <IconButton
          onPress={() => onClose()}
          rounded={'full'}
          icon={<Feather name={'x'} color={colors.primary[500]} size={25} />}
        />
      </HStack>
      <VStack
        width={'100%'}
        mt={'2'}
        p={'4'}
        space={'3'}
        bgColor={'white'}
        shadow={'1'}
        rounded={'xl'}>
        <HStack alignItems={'center'} space={2}>
          <Avatar size={'md'} rounded={'xl'} bgColor={'primary.100'}>
            <Feather name={'hash'} size={20} color={colors.primary[500]} />
          </Avatar>
          <VStack flex={1}>
            <Text fontSize={'sm'} color={'gray.500'}>
              {manualDepositData?.bank_name} Account Number
            </Text>
            <Text fontSize={'xl'} fontWeight={'medium'}>
              {manualDepositData?.account_number}
            </Text>
          </VStack>
        </HStack>
        <Divider my={'1'} />
        <HStack alignItems={'center'} space={2}>
          <Avatar size={'md'} rounded={'xl'} bgColor={'primary.100'}>
            <MaterialCommunityIcons
              name={'bank'}
              size={20}
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
            <Feather name={'user'} size={25} color={colors.primary[500]} />
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
          <Button rounded={'xl'} flex={1}>
            Share Details
          </Button>
        </HStack>
      </VStack>
      <VStack
        width={'100%'}
        mt={'5'}
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
