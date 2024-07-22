/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Input,
  Pressable,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import colors from '../../assets/colors/colors';
import {useDispatch, useSelector} from 'react-redux';

import {hp, wp} from '../config/dpTopx';

const dataProviders = [
  {id: 1, name: 'mtn', image: require('../../assets/images/mtn.jpg')},
  {id: 2, name: 'airtel', image: require('../../assets/images/airtel.jpg')},
  {id: 3, name: 'glo', image: require('../../assets/images/glo.png')},
  {id: 4, name: '9mobile', image: require('../../assets/images/9mobile.jpg')},
];

export const DataCategoryScreen = ({navigation}) => {
  const [selectedProvider, setSelectedProvider] = useState('');

  const data_category = useSelector(state => state.data_bundles.data_category);

  const [filteredCategory, setFilteredCategory] = useState(data_category);

  const [searchText, setSearchText] = useState('');

  const renderItem = ({item}) => (
    <Pressable
      isDisabled={!item.available}
      onPress={() =>
        navigation.navigate('DataPlan', {
          data_bundles: item.data_plan_items,
        })
      }>
      {({isPressed}) => (
        <HStack
          space={2}
          py={'2'}
          bgColor={isPressed ? 'gray.50' : 'transparent'}>
          <Avatar
            borderWidth={1}
            borderColor={'primary.500'}
            source={{uri: item.data_plan_items[0]?.image}}
            size={'sm'}
          />

          <VStack justifyContent={'center'} flex={1}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: !item.available ? 'gray' : 'black',
              }}>
              {item.title}
            </Text>
            {!item.available && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: 'gray',
                }}>
                Service not available
              </Text>
            )}
          </VStack>
          <Feather name={'chevron-right'} size={20} color={'gray'} />
        </HStack>
      )}
    </Pressable>
  );

  const handleFilterCategory = useCallback(() => {
    if (selectedProvider === '') {
      setFilteredCategory(data_category);
      return;
    }

    const filterCategory = data_category.filter(category =>
      category.title?.toLowerCase().includes(selectedProvider),
    );

    setFilteredCategory(filterCategory);
  }, [data_category, selectedProvider]);

  const handleFilterWithText = useCallback(() => {
    if (searchText === '') {
      handleFilterCategory();
      return;
    }

    const filterCategory = data_category.filter(category =>
      category.title?.toLowerCase().includes(searchText.toLowerCase()),
    );

    setFilteredCategory(filterCategory);
  }, [data_category, handleFilterCategory, searchText]);

  useEffect(() => {
    handleFilterCategory();
  }, [handleFilterCategory, selectedProvider]);

  useEffect(() => {
    handleFilterWithText();
  }, [handleFilterWithText]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerWrapper}>
          <IconButton
            onPress={() => navigation.goBack()}
            rounded={'full'}
            icon={
              <Feather
                name="chevron-left"
                size={hp(20)}
                color={colors.textBlack}
              />
            }
          />
          <Box zIndex={-1} position={'absolute'} width={'100%'}>
            <Text style={styles.headerTitleText}>Data Category</Text>
          </Box>
        </View>
      </SafeAreaView>
      <HStack alignItems={'center'} justifyContent={'center'} space={'2'}>
        {dataProviders.map((provider, index) => (
          <Pressable
            key={index}
            onPress={() =>
              setSelectedProvider(
                selectedProvider === provider.name ? '' : provider.name,
              )
            }>
            <Avatar
              borderWidth={selectedProvider === provider.name ? 2 : 0}
              borderColor={'primary.100'}
              size={'sm'}
              source={provider.image}
            />
          </Pressable>
        ))}
      </HStack>

      <Box mt={'2'} pb={'2'}>
        <Input
          rounded={'full'}
          size={'lg'}
          value={searchText}
          onChangeText={text => setSearchText(text)}
          placeholder="Search..."
          InputRightElement={
            <Box pr={'2'}>
              <Feather name={'search'} size={20} color={'gray'} />
            </Box>
          }
        />
      </Box>

      <View style={styles.dataBundleCategoryWrapper}>
        <FlatList
          data={filteredCategory}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </View>
      {data_category.length < 1 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: 'Poppins-Regular', fontSize: 20}}>
            Nothing here come back later
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
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
    fontSize: hp(14),
    textAlign: 'center',
  },
  headerUnderLine: {
    marginTop: hp(10),
    height: hp(1),
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.textLight,
  },
  dataCategory: {
    marginTop: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: wp(70),
    height: hp(53),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 115,
  },
  categoryTitle: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    color: colors.textBlack,
    fontSize: hp(18),
    paddingLeft: wp(10),
  },
});
