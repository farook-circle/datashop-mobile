/* eslint-disable react-native/no-inline-styles */
import {Avatar, Box, Button, HStack, Input, Modal, VStack} from 'native-base';
import React from 'react';
import {Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../../config/dpTopx';

export const VerifyEmailScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Box safeArea flex={1} px={'4'}>
        <VStack alignItems={'center'}>
          <Box mt={'20'}>
            <Feather name="mail" size={hp(100)} color={'#3366FF'} />
          </Box>
          <Text
            style={{
              fontSize: hp(25),
              fontFamily: 'Poppins-SemiBold',
              marginTop: hp(10),
              color: '#3366FF',
            }}>
            Check you email
          </Text>
          <Text style={{fontFamily: 'Poppins-Medium', color: '#3366FF'}}>
            We've sent verification code to
          </Text>
          <Text style={{fontFamily: 'Poppins-Medium', color: '#3366FF'}}>
            {email}
          </Text>
          <VStack w={'100%'} space={'3'} mt={'4'} alignItems={'center'}>
            <Input />
            <Button w={'full'} rounded={'lg'} onPress={() => setIsOpen(true)}>
              Verify Email
            </Button>
            <HStack alignItems={'center'} space={'2'}>
              <Text style={{color: '#3366FF', fontFamily: 'Poppins-regular'}}>
                Didn't receive the email?
              </Text>
              <Text style={{color: '#3366FF', fontFamily: 'Poppins-Bold'}}>
                click to resend
              </Text>
            </HStack>
            <HStack alignItems={'center'} space={'4'}>
              <Feather name={'arrow-left'} color={'#3366FF'} size={hp(20)} />
              <Text style={{color: '#3366FF', fontFamily: 'Poppins-Bold'}}>
                Go Back to change email
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Box h={'50%'}>
            <VStack
              alignItems={'center'}
              justifyContent={'center'}
              h={'200%'}
              space={'2'}
              px={'4'}>
              <Avatar bgColor={'green.400'}>
                <Feather name={'check'} color={'white'} size={hp(30)} />
              </Avatar>
              <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: hp(18)}}>
                Email Verified
              </Text>
              <Text
                style={{fontFamily: 'Poppins-Regular', textAlign: 'center'}}>
                You email has been verified you can now continue to enjoying
                datashop service
              </Text>
              <Button w={'full'} rounded={'lg'}>
                Continue
              </Button>
            </VStack>
          </Box>
        </Modal.Content>
      </Modal>
    </>
  );
};
