import React, {useState} from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  IconButton,
  Divider,
  Avatar,
  useTheme,
  Button,
  Image,
  Pressable,
  ScrollView,
  Actionsheet,
} from 'native-base';
import {MainLayout} from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import {Alert, Share} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ManualDeposit, MomoAgent, CardDeposit} from '../../components';
import {useSelector} from 'react-redux';
import CompleteCardPayment from '../../components/CompleteCardPayment';
import {hp} from '../../config/dpTopx';

export const DepositScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const [sheetContent, setSheetContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentLink, setPaymentLink] = useState('');

  const {
    manual_deposit,
    automated_deposit,
    momo_agent_deposit,
    standard_deposit,
  } = useSelector(state => state.wallet);

  const handleClipBoard = text => {
    Clipboard.setString(text);
    Alert.alert('Alert', 'Copied');
  };

  // const handleInitiateStandardPayment = async amount => {
  //   setLoading(true);
  //   const request = await cardWalletDeposit({amount});
  // };

  const depositOptions = [
    {
      title: 'Manual Deposit',
      label: 'Fund your wallet by sending money to our account',
      icon: <FontAwesome name="money" color={colors.primary[500]} size={20} />,
      link: undefined,
      option: 'manual_deposit',
    },
    {
      title: 'Momo Agent',
      label: 'Fund your wallet by sending float to our momo agent number',
      icon: <FontAwesome name="money" color={colors.primary[500]} size={20} />,
      link: 'https://i.postimg.cc/R05gnQjv/unnamed-2.png',
      option: 'momo_agent_deposit',
    },
    {
      title: 'Top-up with Card or Account',
      label: 'Add money directly from your bank card or account',
      icon: (
        <FontAwesome name="credit-card" color={colors.primary[500]} size={20} />
      ),
      link: undefined,
      option: 'standard_deposit',
    },
  ];

  const handleOpenPaymentOptions = option => {
    switch (option) {
      case 'manual_deposit':
        if (!manual_deposit?.available) {
          Alert.alert(
            'Deposit Status',
            'Manual Deposit is not available at the moment',
          );

          break;
        }
        setSheetContent(
          <ManualDeposit
            manualDepositData={manual_deposit}
            onClose={() => setSheetContent(null)}
          />,
        );
        break;
      case 'momo_agent_deposit':
        if (!momo_agent_deposit?.available) {
          Alert.alert(
            'Deposit Status',
            'Momo agent Deposit is not available at the moment',
          );
          break;
        }
        setSheetContent(
          <MomoAgent
            momoAgentDepositData={momo_agent_deposit}
            onClose={() => setSheetContent(null)}
          />,
        );
        break;
      case 'standard_deposit':
        if (!standard_deposit?.available) {
          Alert.alert(
            'Deposit Status',
            'Card Deposit is not available at the moment',
          );
          break;
        }
        setSheetContent(
          <CardDeposit
            cardDepositData={standard_deposit}
            onClose={() => setSheetContent(null)}
          />,
        );
        break;
      default:
        return;
    }
  };

  const handleShareAccountDetails = async () => {
    try {
      const result = await Share.share({
        message: `Account Name: ${automated_deposit?.account_name} \nAccount Number: ${automated_deposit?.account_number} \nBank Name: ${automated_deposit?.bank_name}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <MainLayout headerTitle={'Deposit to wallet'} showHeader={true}>
      {paymentLink && (
        <Box
          safeArea
          position={'absolute'}
          width={'100%'}
          height={'100%'}
          zIndex={100}>
          <CompleteCardPayment link={paymentLink} />
        </Box>
      )}
      <ScrollView flex={1} px={'4'}>
        <VStack alignItems={'center'}>
          <VStack
            width={'100%'}
            mt={hp(5)}
            p={hp(20)}
            space={'3'}
            bgColor={'white'}
            shadow={'4'}
            borderWidth={1}
            rounded={'xl'}>
            <HStack alignItems={'center'} space={2}>
              <Avatar size={'md'} rounded={'xl'} bgColor={'primary.100'}>
                <MaterialCommunityIcons
                  name={'bank'}
                  size={23}
                  color={colors.primary[500]}
                />
              </Avatar>
              <VStack flex={1}>
                <Text>Bank Transfer</Text>
                <Text fontSize={'xs'} color={'gray.500'}>
                  Add money via mobile or internet banking
                </Text>
              </VStack>
            </HStack>
            <Divider />
            <VStack mt={'2'}>
              <Text fontSize={'md'} color={'black'}>
                {automated_deposit?.bank_name}
              </Text>
              <Text>Acccount Name: {automated_deposit?.account_name}</Text>
              <Text fontSize={'3xl'} fontWeight={'medium'}>
                {automated_deposit?.account_number}
              </Text>
              <HStack alignItems={'center'} space={'1'}>
                <Feather name={'info'} color={colors.primary[500]} />
                <Text fontSize={'xs'} color={'primary.500'}>
                  Processing fee {automated_deposit?.fee}
                </Text>
              </HStack>
            </VStack>

            <HStack width={'full'} space={'2'}>
              <Button
                rounded={'xl'}
                colorScheme={'coolGray'}
                flex={1}
                onPress={() =>
                  handleClipBoard(automated_deposit?.account_number)
                }>
                Copy Number
              </Button>
              <Button
                rounded={'xl'}
                flex={1}
                onPress={handleShareAccountDetails}>
                Share Details
              </Button>
            </HStack>
          </VStack>

          <HStack
            space={'4'}
            alignItems={'center'}
            my={hp(4)}
            px={'10'}
            width={'full'}>
            <Divider flex={1} />
            <Text>OR</Text>
            <Divider flex={1} />
          </HStack>
          <VStack width={'full'} space={'4'}>
            {depositOptions.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleOpenPaymentOptions(item.option)}>
                {({isPressed}) => (
                  <HStack
                    width={'full'}
                    bgColor={isPressed ? 'gray.100' : 'white'}
                    shadow={'2'}
                    padding={'3'}
                    space={'3'}
                    alignItems={'center'}
                    rounded={'xl'}>
                    <Avatar rounded={'xl'} bgColor={'primary.100'}>
                      {!item.link ? (
                        item.icon
                      ) : (
                        <Image
                          source={{uri: item.link}}
                          size={'25px'}
                          rounded={'2'}
                          borderWidth={1}
                          alt={'momo'}
                        />
                      )}
                    </Avatar>

                    <VStack flex={1}>
                      <Text>{item.title}</Text>
                      <Text fontSize={'xs'} color={'gray.500'}>
                        {item.label}
                      </Text>
                    </VStack>
                    <Feather name={'chevron-right'} size={25} color={'gray'} />
                  </HStack>
                )}
              </Pressable>
            ))}
          </VStack>
        </VStack>
        <Actionsheet
          isOpen={sheetContent !== null}
          onClose={() => setSheetContent(null)}>
          <Actionsheet.Content>
            <ScrollView
              showsVerticalScrollIndicator={false}
              height={600}
              width={'100%'}>
              {sheetContent ? sheetContent : <></>}
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>
      </ScrollView>
    </MainLayout>
  );
};
