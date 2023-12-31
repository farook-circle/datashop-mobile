import React from 'react';
import {Box, HStack, IconButton, useTheme, Text, VStack} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';

export const MomoAgent = ({momoAgentDepositData, onClose}) => {
  const {colors} = useTheme();

  return (
    <Box flex={1} px={'4'}>
      <HStack width={'full'}>
        <IconButton
          onPress={() => onClose()}
          rounded={'full'}
          icon={<Feather name={'x'} color={colors.primary[500]} size={25} />}
        />
        <HStack
          position={'absolute'}
          alignItems={'center'}
          justifyContent={'center'}
          height={'100%'}
          zIndex={-1}
          width={'full'}>
          <Text textAlign={'center'} fontSize={'md'} bgColor={'amber.100'}>
            Momo Agent Deposit
          </Text>
        </HStack>
      </HStack>
      <VStack
        mt={'4'}
        alignItems={'center'}
        bgColor={'primary.100'}
        padding={'4'}
        rounded={'lg'}>
        <Text>Momo Agent Number</Text>
        <HStack alignItems={'center'} space={'1'}>
          <Text fontSize={'2xl'}>{momoAgentDepositData?.phone_number}</Text>
          <IconButton
            rounded={'full'}
            icon={
              <Feather name={'copy'} color={colors.primary[500]} size={20} />
            }
          />
        </HStack>
      </VStack>
      <VStack
        shadow={4}
        rounded={'10'}
        alignItems={'center'}
        bgColor={'white'}
        mt={'4'}
        padding={'4'}>
        <Text mb={'4'} fontSize={'lg'} color={'primary.600'}>
          How to make Momo deposit
        </Text>
        <Text textAlign={'center'} fontSize={'md'}>
          {momoAgentDepositData?.instructions}
        </Text>
        <Text
          textAlign={'center'}
          mt={'4'}
          color={'primary.500'}
          fontSize={'lg'}
          fontWeight={'bold'}>
          {momoAgentDepositData?.ussd}
        </Text>
        <HStack
          justifyContent={'center'}
          mt={'4'}
          width={'full'}
          bgColor={'primary.100'}
          p={2}
          space={2}
          rounded={'full'}>
          <Feather name={'info'} color={colors.primary[500]} size={20} />
          <Text>
            Processing fee is{' '}
            <Text color={'primary.500'}>{momoAgentDepositData?.fee}</Text>
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};
