/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';
import {
  fundCollaboratorAgent,
  getCollaboratorAgent,
} from '../redux/actions/collaborator';
import {useState} from 'react';

import BottomModal from '../components/BottomModel';

export const AgentManagement = ({navigation}) => {
  const dispatch = useDispatch();
  const [collaborator_agent, setCollaboratorAgent] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFundingLoading, setIsFundingLoading] = useState(false);
  const [error, setError] = useState(false);

  const [disableButton, setDisableButton] = useState(true);

  const [fundAgentWallet, setFundAgentWallet] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [amount, setAmount] = useState('');

  const user = useSelector(state => state.auth.user);
  const balance = useSelector(state => state.wallet.wallet_balance);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCollaboratorAgent(handleGetAgentResponse));
  }, []);

  useEffect(() => {
    if (amount === '') {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [amount]);

  const handleGetAgentResponse = (res_data, res_status) => {
    if (res_status < 300) {
      setIsLoading(false);
      setCollaboratorAgent(res_data);
      return;
    }

    setError(true);
    setIsLoading(false);
  };

  const handleStartFundAgentWallet = () => {
    if (isFundingLoading) {
      return;
    }
    setIsFundingLoading(false);
    setAmount('');
    setFundAgentWallet(false);
  };

  const handleFundAgentWallet = agent => {
    setSelectedAgent(agent);
    setFundAgentWallet(true);
  };

  const validateAndFund = () => {
    if (Number(balance) < Number(amount)) {
      Alert.alert(
        'Information',
        'You do not have sufficient balance. Please fund your wallet',
        [
          {text: 'Cancel'},
          {text: 'Fund Wallet', onPress: () => navigation.navigate('Deposit')},
        ],
      );
      return;
    }

    Alert.alert(
      'Buy Data',
      `Please confirm that you want to Fund ${amount} to ${
        selectedAgent.username.split('-')[0]
      }`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => {
            setIsFundingLoading(true);
            setDisableButton(true);

            dispatch(
              fundCollaboratorAgent(
                {
                  amount,
                  agent: selectedAgent.username,
                  payment_method: 'wallet',
                  remark: 'this is for you manual funding',
                },
                handleFundAgentResponse,
              ),
            );
          },
        },
      ],
    );
  };

  const handleFundAgentResponse = (res_data, res_status) => {
    if (res_status < 300) {
      Alert.alert(
        'message',
        `You have successfully fund ${amount} to ${
          selectedAgent.username.split('-')[0]
        }`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              setIsFundingLoading(false);
              setFundAgentWallet(false);
            },
          },
        ],
      );
      return;
    }

    alert('something went wrong please try again');
    setAmount('');
    setIsFundingLoading(false);
    setFundAgentWallet(false);
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={colors.primary} size={'large'} />
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: hp(16),
            color: colors.textBlack,
          }}>
          Loading please wait...
        </Text>
      </View>
    );
  }

  return (
    <>
      {fundAgentWallet && (
        <BottomModal>
          <View
            style={{
              padding: 25,
              backgroundColor: 'white',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <TouchableOpacity onPress={() => handleStartFundAgentWallet(false)}>
              <Feather name="x" size={hp(30)} color={'red'} />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: colors.textBlack,
                marginTop: hp(20),
              }}>
              Fund your agent {selectedAgent.username.split('-')[0]} using you
              wallet
            </Text>
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={text => setAmount(text)}
              keyboardType={'numeric'}
              style={{
                marginTop: hp(10),
                fontFamily: 'Poppins-Medium',
                color: colors.textBlack,
                borderWidth: 1,
                borderColor: colors.primary,
                padding: hp(10),
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={disableButton}
              onPress={validateAndFund}
              style={[
                {
                  padding: hp(10),
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp(10),
                },
                disableButton && {backgroundColor: colors.textLight},
              ]}>
              {disableButton && isFundingLoading ? (
                <ActivityIndicator size={'small'} color={colors.primary} />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: colors.textWhite,
                  }}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </BottomModal>
      )}
      <View style={styles.container}>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="chevron-left"
                size={hp(35)}
                color={colors.textBlack}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Manage Agent</Text>
            <Text>{'  '}</Text>
          </View>
          <View style={styles.headerUnderLine} />
        </SafeAreaView>
        {error ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Something went wrong</Text>
          </View>
        ) : (
          <>
            <View style={styles.agentAnalyticWrapper}>
              <View style={styles.agentAnalyticItem}>
                <Text style={styles.analyticLabel}>Number of agent</Text>
                <Text style={styles.analyticValue}>
                  {collaborator_agent.length - 1}
                </Text>
              </View>
            </View>
            <View style={styles.bodyStyle}>
              <FlatList
                data={collaborator_agent}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <>
                    {user.username !== item.username && (
                      <View style={styles.agentWrapper}>
                        <Text style={styles.agentNumber}>
                          {item.username.split('-')[0]}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleFundAgentWallet(item)}
                          style={styles.buttonWrapper}
                          activeOpacity={0.8}>
                          <Text style={styles.buttonText}>Fund Agent</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              />
            </View>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },
  headerWrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerTitleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(16),
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  bodyStyle: {
    flex: 1,
  },

  agentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
  },

  agentNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(16),
    color: colors.textBlack,
  },
  buttonWrapper: {
    backgroundColor: colors.primary,
    padding: hp(10),
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(12),
    color: colors.textWhite,
  },
  agentAnalyticWrapper: {
    marginVertical: hp(30),
    paddingHorizontal: 10,
    paddingVertical: hp(10),
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  agentAnalyticItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(14),
    color: colors.textBlack,
  },
  analyticValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp(16),
    color: colors.primary,
  },
});
