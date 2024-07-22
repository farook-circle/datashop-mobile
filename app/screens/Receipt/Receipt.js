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
import {hp, wp} from '../../config/dpTopx';
import {formatCurrency} from '../../utils';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment-timezone';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Clipboard from '@react-native-clipboard/clipboard';
import {useReceipt} from '../../hooks';
import {useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import {ReceiptTemplate} from '../../lib';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {set} from 'react-native-reanimated';
import Share from 'react-native-share';
import {Dimensions, SafeAreaView, View} from 'react-native';
import colors from '../../../assets/colors/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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

const NameValue = ({name, value}) => (
  <View
    style={{
      paddingVertical: hp(15),
      borderBottomWidth: 0.2,
      paddingHorizontal: wp(20),
      borderBottomColor: colors.textLight,
      borderStyle: 'solid',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
    <Text fontSize={hp(10)} color={'gray.500'}>
      {name}
    </Text>
    <Text fontSize={hp(10)} color={'primary.500'} fontWeight={'semibold'}>
      {value}
    </Text>
  </View>
);

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

  const webviewRef = React.useRef();

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
    webviewRef?.current?.capture().then(uri => {
      shareImage(uri);
    });
  };

  const handleShareReceipt = () => {
    setIsShareOpen(true);
    generateReceiptHtml();
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

  const shareImage = receiptImages => {
    const shareOptions = {
      title: 'Share via',
      message: `Share Datashop_${Date.now()}`,
      url: receiptImages,
    };
    handleCloseShare();

    Share.open(shareOptions);
  };

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
          <Text selectable={true} color={'white'} fontSize={'lg'}>
            {transaction?.name}
          </Text>
          {transaction?.transaction_type === 'ELECTRICITY_PURCHASE' && (
            <VStack alignItems={'center'}>
              <Text selectable={true} color={'white'}>
                Meter Token
              </Text>
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
                <Text
                  selectable={true}
                  color={'white'}
                  fontWeight={'semibold'}
                  fontSize={'lg'}>
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
                <Text
                  selectable={true}
                  color={'white'}
                  fontWeight={'semibold'}
                  fontSize={'lg'}>
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
          // height={'100%'}
          isOpen={isShareOpen}
          onClose={handleCloseShare}>
          {/* <Actionsheet.Content bgColor={'white'}> */}

          <View
            style={{
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
              height: '92%',
              width: '100%',
              backgroundColor: 'white',
            }}>
            <HStack p={'2'} justifyContent={'flex-end'}>
              <IconButton
                onPress={handleCloseShare}
                rounded={'full'}
                variant={'solid'}
                icon={<Feather size={20} name={'x'} color={'white'} />}
              />
            </HStack>
            <ViewShot
              ref={webviewRef}
              options={{
                fileName: `Datashop_${Date.now()}`,
                format: 'jpg',
                quality: 0.9,
              }}>
              <View
                style={{
                  paddingHorizontal: wp(15),
                  backgroundColor: 'white',
                }}>
                <View>
                  <Image
                    width={wp(90)}
                    height={hp(70)}
                    alt="logo"
                    tintColor={'primary.500'}
                    source={require('../../../assets/images/logo_new.png')}
                  />
                  <Text>Payment Receipt</Text>
                </View>
                <Text
                  color={
                    transaction?.status.toLowerCase() === 'pending'
                      ? 'orange.500'
                      : transaction?.status.toLowerCase() === 'failed'
                      ? 'red.500'
                      : 'green.500'
                  }
                  fontWeight={'semibold'}
                  textAlign={'center'}
                  mt={hp(20)}
                  marginBottom={hp(20)}
                  fontSize={'xl'}>
                  PAYMENT {transaction?.status?.toUpperCase()}
                </Text>

                <NameValue
                  name={'AGENT'}
                  value={maskPhoneNumber(user?.username)}
                />
                {transaction?.name && (
                  <NameValue name={'NAME'} value={transaction?.name} />
                )}
                {transaction?.customer && (
                  <NameValue name={'CUSTOMER'} value={transaction?.customer} />
                )}
                <NameValue
                  name={'TRANSACTION ID'}
                  value={transaction?.transaction_ref}
                />
                <NameValue
                  name={'PAYMENT METHOD'}
                  value={transaction?.payment_method?.toUpperCase()}
                />
                <NameValue name={'REMARK'} value={transaction?.remark} />
                <NameValue
                  name={'TIME'}
                  value={moment(transaction?.created_at).format('h:mm a')}
                />
                <NameValue
                  name={'DATE'}
                  value={moment(transaction?.created_at).format('MMMM D, YYYY')}
                />
              </View>
            </ViewShot>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                paddingHorizontal: wp(20),
              }}>
              <Button onPress={generateReceiptImage} flex={1} mx={1}>
                IMAGE
              </Button>
              <Button onPress={sharePdf} flex={1} mx={1}>
                PDF
              </Button>
            </View>
          </View>
          {/* </Actionsheet.Content> */}
        </Actionsheet>
      </ScrollView>
      {/* Receipt to image content  */}
      {/* <Box
        width={windowWidth}
        height={windowHeight}
        position={'absolute'}
        zIndex={-1}
        ref={webviewRef}>
        <WebView
          ref={webviewRef}
          source={{html: receiptHtml}}
          style={{width: windowWidth, height: windowHeight}}
        /> */}
      {/* </Box> */}
    </>
  );
};
