/* eslint-disable react-native/no-inline-styles */
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  ScrollView,
  Text,
  VStack,
  useTheme,
  Image,
  Actionsheet,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {hp} from '../../config/dpTopx';
import {formatCurrency} from '../../utils';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment-timezone';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Clipboard from '@react-native-clipboard/clipboard';
import {useReceipt} from '../../hooks';
import {useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import {ReceiptTemplate} from '../../lib';
import {captureRef} from 'react-native-view-shot';
import {set} from 'react-native-reanimated';
import Share from 'react-native-share';

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
  const [receiptHtml, setReceiptHtml] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPdf, setReceiptPdf] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const webviewRef = React.useRef(null);

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

  function maskPhoneNumber(phoneNumber) {
    if (/^\d{11}$/.test(phoneNumber)) {
      const maskedNumber = phoneNumber.replace(
        /^(\d{4})\d+(\d{2})$/,
        '$1*****$2',
      );
      return maskedNumber;
    } else {
      console.error(
        'Invalid phone number format. Please provide a valid 11-digit number.',
      );
      return null;
    }
  }

  const handlePdfReceipt = async () => {
    const pdfResult = await generateAndDownloadPDF({
      ...transaction,
      agent: maskPhoneNumber(user.username),
    });

    if (pdfResult) {
      setReceiptPdf(pdfResult);
    }
  };

  const generateReceiptHtml = useCallback(async () => {
    const result = ReceiptTemplate({
      ...transaction,
      agent: maskPhoneNumber(user.username),
      whatsapp_number: '',
    });

    setReceiptHtml(result);
  }, [transaction, user.username]);

  const copyToClipboard = text => {
    setCopied(true);
    Clipboard.setString(text);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
    // eslint-disable-next-line no-alert
    alert('Copied');
  };

  const handleCloseShare = () => {
    setIsShareOpen(false);
  };

  const generateReceiptImage = async () => {
    captureRef(webviewRef, {
      format: 'jpg',
      quality: 0.8,
    }).then(
      uri => setReceiptImage(uri),
      error => console.error('Snapshot failed', error),
    );
  };

  const handleShareReceipt = () => {
    setIsShareOpen(true);
    generateReceiptImage();
    handlePdfReceipt();
  };

  const sharePdf = () => {
    const shareOptions = {
      title: 'Share via',
      message: `Share Datashop_${Date.now()}`,
      url: receiptPdf,
    };
    handleCloseShare();
    Share.open(shareOptions);
  };

  const shareImage = () => {
    const shareOptions = {
      title: 'Share via',
      message: `Share Datashop_${Date.now()}`,
      url: receiptImage,
    };
    handleCloseShare();

    Share.open(shareOptions);
  };

  useEffect(() => {
    generateReceiptHtml();
  }, [generateReceiptHtml]);

  return (
    <>
      <ScrollView flex={1} bgColor={'white'}>
        <VStack safeArea alignItems={'center'}>
          <Box
            bgColor={'primary.500'}
            position={'absolute'}
            // zIndex={1}
            width={'100%'}
            height={hp(400)}
          />
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
        <VStack bgColor={'white'} />
        <Box px={'4'} width={'100%'}>
          <Box
            rounded={'xl'}
            bgColor={'white'}
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
                  {transaction?.status}
                </Text>
                <Text>{moment(transaction.created_at).calendar()}</Text>
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
                onPress={handleShareReceipt}
                variant={'outline'}
                size={'lg'}
                py={'3'}
                rounded={'full'}>
                Generate Receipt
              </Button>
            </VStack>
          </Box>
        </Box>
        <Actionsheet
          height={'100%'}
          isOpen={isShareOpen}
          onClose={handleCloseShare}>
          <Actionsheet.Content width={'100%'}>
            <Box width={'100%'} height={'100%'}>
              <HStack
                position={'absolute'}
                width={'100%'}
                zIndex={1}
                justifyContent={'flex-end'}>
                <IconButton
                  onPress={handleCloseShare}
                  variant={'solid'}
                  rounded={'full'}
                  icon={<Feather name={'x'} size={20} color={'white'} />}
                />
              </HStack>
              <Image
                alt={'receipt'}
                source={{uri: receiptImage}}
                width={'100%'}
                height={'100%'}
                resizeMode={'contain'}
              />
            </Box>
            <HStack
              px={'6'}
              width={'100%'}
              position={'absolute'}
              bottom={'0'}
              space={'4'}
              bgColor={'white'}
              pb={hp(26)}>
              <Button onPress={shareImage} flex={1}>
                Image
              </Button>
              <Button onPress={sharePdf} flex={1}>
                PDF
              </Button>
            </HStack>
          </Actionsheet.Content>
        </Actionsheet>
      </ScrollView>
      {/* Receipt to image content  */}
      <Box
        position={'absolute'}
        zIndex={-1}
        ref={webviewRef}
        width={'100%'}
        height={hp(800)}>
        <WebView
          ref={webviewRef}
          source={{html: receiptHtml}}
          style={{width: '100%', height: '100%'}}
        />
      </Box>
    </>
  );
};
