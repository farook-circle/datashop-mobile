import {Box} from 'native-base';
import React from 'react';
import {Text, Dimensions} from 'react-native';
import {hp, wp} from '../../config/dpTopx';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import HeaderBackButton from '../../components/HeaderBackButton';

export default function ActivityDetails({navigation, route}) {
  return (
    <Box flex={1} safeArea px={'4'} pt={'4'}>
      <HeaderBackButton
        title={'Activity overview'}
        onBackButtonPress={() => navigation.goBack()}
      />
      {/* <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: hp(16),
        }}>
        Not enough data to generate your activity
      </Text> */}
      <LineChart
        data={{
          labels: ['Feb', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        // width={Dimensions.get('window').width}
        width={wp(330)} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

    </Box>
  );
}
