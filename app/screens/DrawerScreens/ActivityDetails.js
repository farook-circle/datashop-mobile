/* eslint-disable react-native/no-inline-styles */
import {
  Actionsheet,
  Box,
  Card,
  Divider,
  HStack,
  ScrollView,
  Spinner,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {MainLayout, MonthYearPicker} from '../../components';
import {PieChart} from 'react-native-gifted-charts';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import Feather from 'react-native-vector-icons/Feather';
import {getUserActivity} from '../../api/account.api';
import {formatCurrency} from '../../utils';
import {RefreshControl} from 'react-native';

const pieData = [
  {
    value: 47,
    color: '#009FFF',
    gradientCenterColor: '#006DFF',
    focused: true,
  },
  {value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
  {value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
  {value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const renderDot = color => {
  return <Box height={4} width={4} rounded={20} bgColor={color} mr={1} />;
};

const OverviewItem = ({index, name, value}) => (
  <HStack
    width={'100%'}
    space={2}
    py={'3'}
    borderBottomWidth={1}
    borderBottomColor={'gray.200'}>
    <Text>{index + 1}</Text>
    <Text style={{flex: 1}}>{name}</Text>
    <Text>{value}</Text>
  </HStack>
);

const LegendComponent = ({data}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot(data?.first?.color)}
          <Text style={{color: 'black'}}>{data?.first?.title}%</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot(data?.third?.color)}
          <Text style={{color: 'black'}}>{data?.third?.title}%</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot(data?.second?.color)}
          <Text style={{color: 'black'}}>{data?.second?.title}%</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot(data?.fourth?.color)}
          <Text style={{color: 'black'}}>{data?.fourth?.title}%</Text>
        </View>
      </View>
    </>
  );
};

export const ActivityDetails = ({navigation, route}) => {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()],
  );

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);

  const handleGetStatistic = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setIsSelectingDate(false);
  };

  const handleFetchStatic = useCallback(async () => {
    setLoading(true);
    const request = await getUserActivity({
      month: months.indexOf(selectedMonth) + 1,
      year: selectedYear,
    });
    if (request.ok) {
      setStatistics(request.data);
    }

    setLoading(false);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    handleFetchStatic();
  }, [handleFetchStatic, selectedMonth, selectedYear]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleFetchStatic();
    setRefreshing(false);
  }, [handleFetchStatic]);

  return (
    <MainLayout headerTitle={'Statistics'} showHeader={true}>
      {loading ? (
        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
          <Spinner />
          <Text
            style={{fontFamily: 'Poppins-Medium', fontSize: 16, marginTop: 10}}>
            Loading Please wait
          </Text>
        </Box>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            style={{marginLeft: 20, marginTop: 10}}
            onPress={() => setIsSelectingDate(true)}
            activeOpacity={0.7}>
            <HStack alignItems={'center'}>
              <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                {selectedMonth} {selectedYear}
              </Text>
              <Feather name={'chevron-down'} size={20} />
            </HStack>
          </TouchableOpacity>
          {!statistics ? (
            <Box alignItems={'center'}>
              <Text style={{marginTop: 50}}>No Data</Text>
            </Box>
          ) : (
            <>
              <View
                style={{
                  margin: 20,
                  padding: 16,
                  borderRadius: 20,
                  borderColor: colors.primary,
                  borderWidth: 2,
                }}>
                <View style={{padding: 20, alignItems: 'center'}}>
                  <PieChart
                    data={statistics?.chart_data}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={'#FFFFFF'}
                    centerLabelComponent={() => {
                      return (
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 22,
                              color: 'black',
                              fontWeight: 'bold',
                            }}>
                            {statistics?.top_chart?.percentage || '0%'}
                          </Text>
                          <Text style={{fontSize: 14, color: 'black'}}>
                            {statistics?.top_chart?.title || 'Data Purchase'}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
                <LegendComponent data={statistics?.legend_data} />
              </View>
              <VStack px={'6'}>
                <Text style={{fontFamily: 'Poppins-Medium', fontSize: 16}}>
                  Overview
                </Text>
                {statistics?.overview?.map((item, index) => (
                  <OverviewItem
                    key={index}
                    index={index}
                    name={item?.title}
                    value={formatCurrency(item?.amount_spent)}
                  />
                ))}
              </VStack>
            </>
          )}
        </ScrollView>
      )}
      <Actionsheet
        isOpen={isSelectingDate}
        onClose={() => setIsSelectingDate(false)}>
        <Actionsheet.Content>
          <Box height={hp(350)} width={'100%'}>
            <MonthYearPicker
              onConfirm={handleGetStatistic}
              onCancel={() => setIsSelectingDate(false)}
            />
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </MainLayout>
  );
};
