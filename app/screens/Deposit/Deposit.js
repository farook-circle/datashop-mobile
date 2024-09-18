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
  Spinner,
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
import {ROUTES} from '../../lib';

const getBankLogo = name => {
  if (!name) {
    return;
  }

  if (name.includes('Wema')) {
    return require('../../../assets/images/wemabank.jpg');
  }

  if (name.includes('Sterling')) {
    return require('../../../assets/images/sterling.png');
  }

  if (name.includes('Moniepoint')) {
    return require('../../../assets/images/moniepoint.png');
  }

  if (name.includes('GTBank')) {
    return require('../../../assets/images/gtbank.png');
  }

  return require('../../../assets/images/logo_new.png');
};

export const DepositScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [sheetContent, setSheetContent] = useState(null);

  const [paymentLink, setPaymentLink] = useState('');

  const {
    manual_deposit,
    momo_agent_deposit,
    standard_deposit,
    accounts,
    isLoading,
  } = useSelector(state => state.wallet);

  const [selectedAccount, setSelectedAccount] = useState(0);

  const handleClipBoard = text => {
    Clipboard.setString(text);
    Alert.alert('Alert', 'Copied');
  };

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
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <Box flex={1} justifyContent={'center'} alignItems={'center'}>
        <Spinner />
      </Box>
    );
  }

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
            position={'relative'}
            shadow={'4'}
            borderWidth={1}
            rounded={'xl'}>
            {accounts.length < 1 ? (
              <Box
                minHeight={hp(140)}
                backgroundColor={'white'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Text textAlign={'center'}>
                  Thank you for choosing Datashop. To generate an account number
                  with our banking partners, we will need to verify your
                  information.
                </Text>
                <Button
                  onPress={() =>
                    navigation.navigate(ROUTES.ACCOUNT_NUMBER_SCREEN)
                  }
                  mt={'4'}
                  size={'sm'}
                  width={'70%'}
                  variant={'outline'}>
                  Verify Using BVN
                </Button>
                <Button
                  onPress={() =>
                    navigation.navigate(ROUTES.ACCOUNT_NUMBER_NIN_SCREEN)
                  }
                  mt={'2'}
                  size={'sm'}
                  width={'70%'}
                  variant={'outline'}>
                  Verify Using NIN
                </Button>
              </Box>
            ) : (
              <>
                <HStack space={'2'}>
                  {accounts?.map((account, index) => (
                    <Pressable
                      key={index}
                      borderWidth={1}
                      borderColor={
                        selectedAccount === index ? 'primary.500' : 'gray.500'
                      }
                      rounded={'full'}
                      onPress={() => setSelectedAccount(index)}
                      overflow={'hidden'}
                      width={'35px'}
                      height={'35px'}>
                      <Image
                        source={getBankLogo(account?.bank_name)}
                        width={'100%'}
                        height={'100%'}
                        alt="bank logo"
                        resizeMode="contain"
                      />
                    </Pressable>
                  ))}
                </HStack>
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
                    {accounts[selectedAccount]?.bank_name}
                  </Text>
                  <Text>
                    Acccount Name: {accounts[selectedAccount]?.account_name}
                  </Text>
                  <Text fontSize={'3xl'} fontWeight={'medium'}>
                    {accounts[selectedAccount]?.account_number}
                  </Text>
                  <HStack alignItems={'center'} space={'1'}>
                    <Feather name={'info'} color={colors.primary[500]} />
                    <Text fontSize={'xs'} color={'primary.500'}>
                      Processing fee {50}
                    </Text>
                  </HStack>
                </VStack>

                <HStack width={'full'} space={'2'}>
                  <Button
                    rounded={'xl'}
                    colorScheme={'coolGray'}
                    flex={1}
                    onPress={() =>
                      handleClipBoard(accounts[selectedAccount]?.account_number)
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
              </>
            )}
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
