import {Box, HStack, VStack} from 'native-base';
import React, {useCallback} from 'react';
import {Text} from 'react-native';
import HeaderBackButton from '../../components/HeaderBackButton';
import {hp} from '../../config/dpTopx';
import {useDispatch, useSelector} from 'react-redux';
import {getServiceSuccessRate} from '../../api/service.api';
import {GET_SUCCESS_RATE} from '../../redux/constants/service';
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
  const {success_rate} = useSelector(state => state.service);

  const getNetSuccessRate = useCallback(async () => {
    const request = await getServiceSuccessRate();
    if (request.ok) {
      console.log(request.data);
      dispatch({type: GET_SUCCESS_RATE, payload: request.data});
    }
  }, [dispatch]);

  React.useEffect(() => {
    getNetSuccessRate();
  }, [getNetSuccessRate]);

  return (
    <MainLayout headerTitle={'Success Rate (%)'} showHeader={true}>
      <Box px={'4'}>
        {success_rate.length < 1 ? (
          <Box flex={1} justifyContent={'center'} alignItems={'center'}>
            <Text>Not Available at the moment check back later</Text>
          </Box>
        ) : (
          <VStack space={'2'} pt={'4'}>
            {success_rate.map(successRate => (
              <ChartBar
                title={successRate.name}
                percentage={Number(successRate.successRate)}
              />
            ))}
          </VStack>
        )}
      </Box>
    </MainLayout>
  );
};
