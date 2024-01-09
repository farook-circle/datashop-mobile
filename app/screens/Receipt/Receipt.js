import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  HStack,
  IconButton,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import React, {useState} from 'react';
import {MainLayout} from '../../components';
import {hp} from '../../config/dpTopx';
import {formatCurrency} from '../../utils';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment-timezone';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Clipboard from '@react-native-clipboard/clipboard';
import {useReceipt} from '../../hooks';
import {useSelector} from 'react-redux';

const TRANSACTIONS = {
  DATA_PURCHASE: 'DATA_PURCHASE',
  AIRTIME_PURCHASE: 'AIRTIME_PURCHASE',
  ELECTRICITY_PURCHASE: 'ELECTRICITY_PURCHASE',
  CABLE_PURCHASE: 'CABLE_PURCHASE',
  WALLET_TRANSFER: 'WALLET_TRANSFER',
  EXAM_PURCHASE: 'EXAM_PURCHASE',
  AUTOMATED_FUNDING: 'AUTOMATED_FUNDING',
  MANUAL_DEPOSIT: 'MANUAL_DEPOSIT',
};

const TransactionDetail = ({name, value}) => (
  <VStack width={'100%'}>
    <Text selectable={true}>{name}</Text>
    <Text selectable={true} fontWeight={'bold'}>
      {value}
    </Text>
  </VStack>
);

export const ReceiptScreen = ({route, navigation}) => {
  const transaction = route.params?.transaction;
  const {colors} = useTheme();
  const [copied, setCopied] = useState(false);

  const {generateAndDownloadPDF, status} = useReceipt();
  const {user} = useSelector(state => state.auth);

  const getDefaultIcon = transaction_type => {
    switch (transaction_type) {
      case TRANSACTIONS.AUTOMATED_FUNDING:
        return (
          <Fontisto
            name={'arrow-swap'}
            color={colors.primary[500]}
            size={hp(25)}
          />
        );
      case TRANSACTIONS.AIRTIME_PURCHASE:
        return (
          <Feather
            name={'smartphone'}
            color={colors.primary[500]}
            size={hp(25)}
          />
        );
      case TRANSACTIONS.DATA_PURCHASE:
        return (
          <Feather name={'globe'} color={colors.primary[500]} size={hp(25)} />
        );
      default:
        return <Feather name="box" color={colors.primary[500]} size={hp(25)} />;
    }
  };

  const handleShareReceipt = async () => {
    await generateAndDownloadPDF({...transaction, agent: user.username});
  };

  const handleReportReceipt = () => {
    navigation.navigate('Complain', {
      ...transaction,
    });
  };

  const copyToClipboard = text => {
    setCopied(true);
    Clipboard.setString(text);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
    alert('Copied');
  };

  return (
    <Box flex={1} paddingBottom={'0'}>
      <VStack safeArea flex={2} bgColor={'primary.500'} alignItems={'center'}>
        <HStack
          pt={'2'}
          width={'full'}
          justifyContent={'space-between'}
          px={'6'}>
          <IconButton
            onPress={() => navigation.goBack()}
            variant={'solid'}
            bgColor={'white'}
            rounded={'full'}
            icon={<Feather name={'chevron-left'} size={20} color={'black'} />}
          />
          {/* <IconButton
            variant={'solid'}
            bgColor={'white'}
            rounded={'full'}
            icon={<Feather name={'share-2'} size={20} color={'black'} />}
          /> */}
        </HStack>
        <Avatar
          source={{uri: transaction?.image}}
          bgColor={'white'}
          size={'lg'}
          marginTop={hp(10)}>
          {getDefaultIcon(transaction?.transaction_type)}
        </Avatar>
        <Text fontSize={'2xl'} mt={'4'} fontWeight={'bold'} color={'white'}>
          {formatCurrency(transaction?.amount)}
        </Text>
        <Text color={'gray.200'}>Paid for</Text>
        <Text color={'white'} fontSize={'lg'}>
          {transaction?.name}
        </Text>
        {transaction?.transaction_type === 'ELECTRICITY_PURCHASE' && (
          <VStack alignItems={'center'}>
            <Text color={'white'}>Meter Token</Text>
            <HStack alignItems={'center'}>
              <Text color={'white'} fontWeight={'semibold'} fontSize={'lg'}>
                {transaction?.meta?.token}
              </Text>
              <IconButton
                onPress={() => copyToClipboard(transaction?.meta?.token)}
                rounded={'full'}
                icon={
                  <Feather
                    name={copied ? 'check' : 'copy'}
                    color={'white'}
                    size={20}
                  />
                }
              />
            </HStack>
          </VStack>
        )}
        {transaction?.transaction_type === 'CABLE_SUBSCRIPTION' && (
          <VStack alignItems={'center'}>
            <Text color={'white'}>Cable Pin</Text>
            <HStack alignItems={'center'}>
              <Text color={'white'} fontWeight={'semibold'} fontSize={'lg'}>
                {transaction?.meta?.token}
              </Text>
              <IconButton
                onPress={() => copyToClipboard(transaction?.meta?.token)}
                rounded={'full'}
                icon={
                  <Feather
                    name={copied ? 'check' : 'copy'}
                    color={'white'}
                    size={20}
                  />
                }
              />
            </HStack>
          </VStack>
        )}
        {transaction?.transaction_type === 'EXAM_PURCHASE' && (
          <VStack alignItems={'center'}>
            <Text color={'white'}>Exam PIN</Text>
            <HStack alignItems={'center'}>
              <Text color={'white'} fontWeight={'semibold'} fontSize={'lg'}>
                {transaction?.meta?.data_pin?.pin}
              </Text>
              <IconButton
                onPress={() =>
                  copyToClipboard(transaction?.meta?.data_pin?.pin)
                }
                rounded={'full'}
                icon={
                  <Feather
                    name={copied ? 'check' : 'copy'}
                    color={'white'}
                    size={20}
                  />
                }
              />
            </HStack>
          </VStack>
        )}
      </VStack>
      <VStack flex={2} bgColor={'white'} />
      <Box
        px={'4'}
        width={'100%'}
        // height={hp(400)}
        bottom={hp(40)}
        position={'absolute'}>
        <Box
          rounded={'xl'}
          bgColor={'white'}
          width={'100%'}
          height={'100%'}
          borderColor={'primary.400'}
          borderWidth={1}>
          <HStack px={'4'} pt={'4'} space={'2'} pb={'2'}>
            <Avatar
              bgColor={
                transaction?.status?.toLowerCase() === 'pending'
                  ? 'orange.500'
                  : transaction?.status?.toLowerCase() === 'failed'
                  ? 'red.500'
                  : 'green.500'
              }>
              <Feather
                name={
                  transaction?.status?.toLowerCase() === 'pending'
                    ? 'rotate-cw'
                    : transaction?.status?.toLowerCase() === 'failed'
                    ? 'x'
                    : 'check'
                }
                color={'white'}
                size={20}
              />
            </Avatar>
            <VStack>
              <Text fontSize={'md'} fontWeight={'semibold'}>
                {transaction?.status?.toLowerCase() === 'pending'
                  ? 'Pending'
                  : transaction?.status?.toLowerCase() === 'failed'
                  ? 'Failed'
                  : 'Successful'}
              </Text>
              <Text>{moment(new Date()).calendar()}</Text>
            </VStack>
          </HStack>
          <Divider />
          <VStack flex={1} p={'4'} width={'100%'} space={'2'}>
            <TransactionDetail
              name={'Transaction ID'}
              value={transaction?.transaction_ref}
            />
            <TransactionDetail
              name={'Payment Method'}
              value={transaction?.payment_method}
            />
            <TransactionDetail
              name={'Balance Before'}
              value={formatCurrency(transaction?.balance_before) || 'None'}
            />
            <TransactionDetail
              name={'Balance After'}
              value={formatCurrency(transaction?.balance_after) || 'None'}
            />
            <TransactionDetail name={'Remark'} value={transaction?.remark} />
          </VStack>
          <VStack px={'6'} pb={'4'}>
            <Button
              isLoading={status}
              onPress={handleShareReceipt}
              variant={'outline'}
              size={'lg'}
              py={'3'}
              rounded={'full'}>
              Share Receipt
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};
