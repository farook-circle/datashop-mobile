import React, {useState} from 'react';
import {MainLayout} from '../../components';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  KeyboardAvoidingView,
  Text,
  VStack,
} from 'native-base';
import {Form, Formik} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import {verifyUserBvn} from '../../api';
import {useDispatch} from 'react-redux';
import {UPDATE_USER} from '../../redux/constants/auth';
import {Alert} from 'react-native';

const bvnValidation = yup.object().shape({
  bvn: yup.string().required('BVN is required'),
});

export const BvnUpdateScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerifyBvn = async data => {
    setLoading(true);
    const request = await verifyUserBvn(data);
    if (request.ok) {
      dispatch({type: UPDATE_USER, payload: request.data});
      Alert.alert(
        'Success',
        request.data?.message || 'You have successfully verify your bvn',
        [{text: 'OK', onPress: navigation.goBack()}],
      );
      setLoading(false);
      return;
    }

    Alert.alert(
      'Error',
      request.data?.message ? request.data.message : 'An error occurred',
    );
    setLoading(false);
  };
  return (
    <MainLayout headerTitle={'Bvn Update'} showHeader={true}>
      <Box px={'4'} flex={1} pb={'4'}>
        <Text fontSize={'lg'}>Fill in the form below to verify your BVN</Text>
        <Formik
          validationSchema={bvnValidation}
          initialValues={{bvn: ''}}
          onSubmit={form => handleVerifyBvn(form)}>
          {({
            values,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
          }) => (
            <>
              <KeyboardAvoidingView flex={1}>
                <VStack mt={'3'} flex={1}>
                  <FormControl isInvalid={touched.bvn && errors.bvn}>
                    <FormControl.Label>
                      BVN (Bank Verification Number)
                    </FormControl.Label>
                    <Input
                      value={values.bvn}
                      onChangeText={handleChange('bvn')}
                      onBlur={handleBlur('bvn')}
                      keyboardType="numeric"
                      placeholder="BVN"
                      py={'2'}
                      size={'lg'}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={
                        <Feather color={'red'} name="info" size={10} />
                      }>
                      {errors.bvn}
                    </FormControl.ErrorMessage>
                  </FormControl>
                </VStack>
              </KeyboardAvoidingView>
              <VStack space={'3'}>
                <Checkbox>
                  <Text>I agree to the terms and condition</Text>
                </Checkbox>
                <Button
                  isLoading={loading}
                  size={'lg'}
                  py={'3'}
                  onPress={handleSubmit}>
                  Submit
                </Button>
              </VStack>
            </>
          )}
        </Formik>
      </Box>
    </MainLayout>
  );
};
