import React, {useEffect} from 'react';
import {
  Box,
  HStack,
  IconButton,
  useTheme,
  Text,
  VStack,
  Button,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import {Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {set} from 'react-native-reanimated';

export const MomoAgent = ({momoAgentDepositData, onClose}) => {
  const {colors} = useTheme();
  const [copiedNumber, setCopiedNumber] = React.useState(false);
  const [copiedUssd, setCopiedUssd] = React.useState(false);

  const handleDialPhone = () => {
    const url = `tel:${momoAgentDepositData?.ussd.replace(
      'phone_number',
      momoAgentDepositData?.phone_number,
    )}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => {});
  };

  const handleCopyClipboard = type => {
    if (type === 'number') {
      setCopiedNumber(true);
      Clipboard.setString(momoAgentDepositData?.phone_number);
      return;
    }

    setCopiedUssd(true);
    Clipboard.setString(
      momoAgentDepositData?.ussd.replace(
        'phone_number',
        momoAgentDepositData?.phone_number,
      ),
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setCopiedNumber(false);
      setCopiedUssd(false);
    }, 3000);
  }, [copiedNumber, copiedUssd]);

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
            onPress={() => handleCopyClipboard('number')}
            rounded={'full'}
            icon={
              <Feather
                name={copiedNumber ? 'check' : 'copy'}
                color={colors.primary[500]}
                size={20}
              />
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
        <VStack>
          <Text
            textAlign={'center'}
            mt={'4'}
            color={'primary.500'}
            fontSize={'lg'}
            fontWeight={'bold'}>
            {momoAgentDepositData?.ussd.replace(
              'phone_number',
              momoAgentDepositData?.phone_number,
            )}
          </Text>
          <HStack width={'100%'} space={2} px={'6'} mt={'3'}>
            <Button
              bgColor={'green.700'}
              onPress={handleDialPhone}
              leftIcon={<Feather name={'phone'} size={20} color={'white'} />}
              flex={1}
            />
            <Button
              bgColor={'primary.100'}
              leftIcon={
                <Feather
                  size={20}
                  name={copiedUssd ? 'check' : 'copy'}
                  color={colors.primary[700]}
                />
              }
              flex={1}
              onPress={() => handleCopyClipboard('ussd')}
            />
          </HStack>
        </VStack>

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
            <Text color={'primary.500'}>{momoAgentDepositData?.fee}</Text>
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};
