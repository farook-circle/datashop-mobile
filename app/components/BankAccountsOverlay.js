import Clipboard from '@react-native-clipboard/clipboard';
import {
  Box,
  Divider,
  HStack,
  IconButton,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import {Dimensions, StyleSheet, ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('screen');

export const BankAccountsOverlay = ({isOpen, setClose}) => {
  const {accounts, isLoading} = useSelector(state => state.wallet);

  const handleCopyText = text => {
    Clipboard.setString(text);
    ToastAndroid.show('Copied', ToastAndroid.SHORT);
  };

  if (!isOpen || isLoading) {
    return <></>;
  }
  return (
    <Box safeArea style={styles.container}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Text color={'white'} fontSize={'lg'}>
          Bank Accounts
        </Text>
        <IconButton
          rounded={'full'}
          variant={'solid'}
          icon={<Icon name={'x'} size={14} color={'white'} />}
          onPress={setClose}
        />
      </HStack>

      <VStack space={'4'} divider={<Divider />}>
        {accounts?.map((account, index) => (
          <VStack mt={'2'}>
            <Text fontSize={'md'} color={'white'}>
              {account?.bank_name}
            </Text>
            <Text color={'white'}>Acccount Name: {account?.account_name}</Text>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
              <Text color={'white'} fontSize={'3xl'} fontWeight={'medium'}>
                {account?.account_number}
              </Text>
              <IconButton
                onPress={() => handleCopyText(account?.account_number)}
                icon={<Icon name={'copy'} size={18} color={'white'} />}
              />
            </HStack>
          </VStack>
        ))}
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
