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
} from 'react-native';
import React, {useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getDataBundle} from '../redux/actions/data_plans';
import {hp, wp} from '../config/dpTopx';

export default function AgentManagement({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    getListOfAgent();
  }, []);

  const getListOfAgent = () => {
    console.log('get agent');
  };

  const agents = [
    {id: 1, agent: '09066424203'},
    {id: 2, agent: '08184738292'},
    {id: 3, agent: '07066124103'},
  ];

  return (
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
      <View style={styles.agentAnalyticWrapper}>
        <View style={styles.agentAnalyticItem}>
          <Text style={styles.analyticLabel}>Number of agent</Text>
          <Text style={styles.analyticValue}>30</Text>
        </View>
      </View>
      <View style={styles.bodyStyle}>
        <FlatList
          data={agents}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.agentWrapper}>
              <Text style={styles.agentNumber}>{item.agent}</Text>
              <TouchableOpacity style={styles.buttonWrapper}>
                <Text style={styles.buttonText}>Fund Agent</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

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
