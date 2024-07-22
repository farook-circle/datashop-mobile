import React, {useCallback, useEffect, useState} from 'react';
import {MainLayout} from '../../components';
import {
  Actionsheet,
  Avatar,
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';
import {
  generateMultiFactorConfigUrl,
  getOAuthData,
  removeOAuthData,
  verifyMultiFactorOtp,
} from '../../api';
import {Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const parseOtpAuthUrl = otpAuthUrl => {
  const regex =
    /^otpauth:\/\/(\w+)\/(.+)\?secret=([^&]+)&algorithm=([^&]+)&digits=(\d+)&period=(\d+)$/;
  const match = otpAuthUrl.match(regex);

  if (!match) {
    return {};
  }

  const [, type, label, secret, algorithm, digits, period] = match;

  return {
    type,
    label,
    secret,
    algorithm,
    digits,
    period,
  };
};
export const MultiFactorScreen = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const parseOAuthUrl = parseOtpAuthUrl(configUrl);

  const [isQrCode, setIsQrCode] = useState(true);

  const [oauthData, setOAuthData] = useState(null);

  const handleRemoveOAuthData = async () => {
    setLoading(true);

    const request = await removeOAuthData();
    if (request.ok) {
      Alert.alert(
        'Success',
        'You have successfully removed multifactor authentication from your account',
      );
      setLoading(false);
      setOAuthData(null);
      return;
    }

    Alert.alert('Error', 'Unable to complete your request please try again');
    setLoading(false);
  };

  const handleGetOAuthData = useCallback(async () => {
    setLoading(true);
    const getUserOAuth = await getOAuthData();
    if (getUserOAuth.ok) {
      setOAuthData(getUserOAuth.data);
      setLoading(false);
      return;
    }
    handleGetConfigUrl();
    setLoading(false);
  }, []);

  const handleGetConfigUrl = async () => {
    const request = await generateMultiFactorConfigUrl();
    if (request.ok) {
      setConfigUrl(request.data?.config_url);
    }
    setLoading(false);
  };

  const handleVerifyMultifactor = async () => {
    setLoading(true);
    const request = await verifyMultiFactorOtp(otp);
    if (request.ok) {
      Alert.alert('Success', 'Authenticator Connected Successful');
      await handleGetOAuthData();
      setIsAdding(false);
      return;
    }

    Alert.alert(
      'Fail',
      request.data?.message
        ? request.data?.message
        : 'Unable to complete your request',
    );
    setLoading(false);
  };

  useEffect(() => {
    handleGetOAuthData();
  }, [handleGetOAuthData]);

  const copyToClipboard = text => {
    Clipboard.setString(text);

    // eslint-disable-next-line no-alert
    alert('Copied');
  };

  return (
    <MainLayout headerTitle={'Manage your code'} showHeader={true}>
      <Box flex={1} px={'4'}>
        <Text>
          Two-Factor Authentication (2FA) adds an extra layer of security to
          your account. It requires both your password and a unique code sent to
          your phone, making it much harder for unauthorized access. Enable 2FA
          to protect your account.
        </Text>
        <HStack
          mt={'4'}
          borderBottomWidth={1}
          pb={'2'}
          borderBottomColor={'gray.400'}>
          {!oauthData && (
            <Text>Scan the QRCode with your Authenticator App</Text>
          )}
        </HStack>

        {oauthData && (
          <HStack
            mt={'2'}
            alignItems={'center'}
            space={2}
            bgColor={'primary.100'}
            p={1}
            rounded={'lg'}
            justifyContent={'space-between'}>
            <Avatar
              size={'sm'}
              bgColor={'primary.500'}
              borderWidth={2}
              borderColor={'primary.700'}>
              <Feather name={'key'} color={'white'} size={16} />
            </Avatar>
            <VStack flex={1}>
              <Text>Authenticator App</Text>
              <Text color={'amber.800'}>{oauthData?.name}</Text>
            </VStack>
          </HStack>
        )}

        {!oauthData && (
          <ScrollView height={700} width={'100%'}>
            <VStack alignItems={'center'} pt={'10'} px={'2'} space={2}>
              {isQrCode ? (
                <>
                  {configUrl ? <QRCode value={configUrl} size={200} /> : null}
                </>
              ) : (
                <VStack width={'full'} space={'3'}>
                  <VStack>
                    <Text selectable={true}>Account Name</Text>
                    <Text fontSize={'lg'}>{parseOAuthUrl?.label}</Text>
                  </VStack>
                  <VStack>
                    <Text>Your Key</Text>

                    <Text selectable={true} fontSize={'md'}>
                      {parseOAuthUrl?.secret}
                    </Text>
                    <HStack>
                      <Button
                        onPress={() => copyToClipboard(parseOAuthUrl?.secret)}
                        size={'sm'}
                        rounded={'full'}>
                        Copy Key
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              )}
              <FormControl>
                <FormControl.Label>Verification Code:</FormControl.Label>
                <Input
                  value={otp}
                  onChangeText={text => setOtp(text)}
                  size={'lg'}
                  py={'3'}
                  placeholder="Verification Code"
                />
              </FormControl>

              <HStack flex={1} space={2} mt={'2'}>
                <Button isDisabled={loading} flex={1} variant={'outline'}>
                  Cancel
                </Button>
                <Button
                  flex={1}
                  onPress={handleVerifyMultifactor}
                  isLoading={loading}>
                  Connect
                </Button>
              </HStack>
              <HStack width={'full'}>
                <Button
                  onPress={() => setIsQrCode(!isQrCode)}
                  variant={'ghost'}>
                  {isQrCode ? 'Verify with token instead' : 'Scan QRCode'}
                </Button>
              </HStack>
            </VStack>
          </ScrollView>
        )}

        {/* <Box flex={1} justifyContent={'flex-end'} pb={'2'}>
          {(!oauthData || loading) && (
            <Button
              onPress={() => {
                handleGetConfigUrl();
                setIsAdding(true);
                setOtp('');
              }}
              size={'lg'}
              py={'3'}>
              Add
            </Button>
          )}
        </Box> */}
      </Box>
    </MainLayout>
  );
};
