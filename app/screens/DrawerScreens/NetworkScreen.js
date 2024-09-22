import {Box, Divider, HStack, ScrollView, VStack} from 'native-base';
import React, {useCallback, useState} from 'react';
import {Text, RefreshControl} from 'react-native';
import {hp} from '../../config/dpTopx';
import {useDispatch, useSelector} from 'react-redux';
import {getServiceSuccessRate} from '../../api/service.api';
import {GET_SUCCESS_RATE} from '../../redux/constants/system';
import {MainLayout} from '../../components';


const ChartBar = ({title, percentage}) => {
  const getBgColor = perc => {
    if (perc >= 70) {
      return 'green.500';
    } else if (perc >= 40) {
      return 'yellow.500';
    } else {
      return 'red.500';
    }
  };
  return (
    <HStack width={'100%'} space={'2'} alignItems={'center'}>
      <Box width={'90%'} h={'30px'} justifyContent={'center'}>
        <Box
          rounded={'lg'}
          bgColor={getBgColor(percentage)}
          width={percentage + '%'}
          height={'100%'}
          position={'absolute'}
          zIndex={-100}
        />
        <Text
          style={{
            color: 'black',
            paddingHorizontal: 4,
            fontFamily: 'Poppins-Regular',
            fontSize: hp(13),
          }}>
          {title}
        </Text>
      </Box>
      <Text>{percentage}</Text>
    </HStack>
  );
};

export const NetworkScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {success_rate} = useSelector(state => state.system);
  const [refreshing, setRefreshing] = useState(false);

  const getNetSuccessRate = useCallback(async () => {
    const request = await getServiceSuccessRate();

    if (request.ok) {
      dispatch({type: GET_SUCCESS_RATE, payload: request.data});
    }
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    getNetSuccessRate();
  }, [getNetSuccessRate]);

  return (
    <MainLayout headerTitle={'Success Rate (%)'} showHeader={true}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        px={'4'}
        flex={1}>
        {!success_rate ? (
          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <Text>Not Available at the moment check back later</Text>
          </Box>
        ) : (
          <VStack flex={1} space={'2'} pt={'4'}>
            <HStack space={4} width={'100%'} alignItems={'center'}>
              <Divider flex={1} />
              <Text>Data</Text>
              <Divider flex={1} />
            </HStack>
            {success_rate?.data_success_rate?.map(successRate => (
              <ChartBar
                title={successRate.name}
                percentage={Number(successRate.successRate)}
              />
            ))}
            <HStack space={4} mt={'4'} width={'100%'} alignItems={'center'}>
              <Divider flex={1} />
              <Text>Other Services</Text>
              <Divider flex={1} />
            </HStack>
            {success_rate?.other_services?.map(successRate => (
              <ChartBar
                title={successRate.name}
                percentage={Number(successRate.successRate)}
              />
            ))}
          </VStack>
        )}
      </ScrollView>
    </MainLayout>
  );
};
