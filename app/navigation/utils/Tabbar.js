/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View, Dimensions, StyleSheet} from 'react-native';
import {Avatar, Box, HStack, Pressable, Text, useTheme} from 'native-base';
import {hp} from '../../config/dpTopx';

const {width} = Dimensions.get('window');

const TabBar = ({state, descriptors, navigation}) => {
  const colors = useTheme().colors;
  return (
    <View style={styles.mainContainer}>
      <HStack
        py={'6'}
        position={'relative'}
        justifyContent={'space-between'}
        alignItems={'center'}
        width={'100%'}>
        {[
          {icon: 'home', focus: true},
          {icon: 'playcircleo', focus: false},
          {icon: 'arrowdown', focus: false},
          {icon: 'questioncircleo', focus: false},
          {icon: 'ellipsis1', focus: false},
        ].map((item, index) => (
          <>
            {index === 2 ? (
              <Box zIndex={10} width={'25px'}>
                <AntDesign
                  name={item.icon}
                  size={25}
                  color={colors.primary[500]}
                />
              </Box>
            ) : (
              <Box>
                <AntDesign
                  name={item.icon}
                  size={25}
                  color={colors.primary[500]}
                />
              </Box>
            )}
          </>
        ))}
        <Avatar
          width={'70px'}
          rounded={'full'}
          height={'60px'}
          bgColor={'gray.50'}
          position={'absolute'}
          left={100}
          top={-20}
        />
      </HStack>
      {/* <>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              onPress={onPress}
              px={'4'}
              pb={'4'}
              key={index}
              style={[styles.mainItemContainer]}>
              <Box mt={'2'} borderRadius={20}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    // padding: 10,
                  }}>
                ƒ
                </View>
              </Box>
              <Text
                color={isFocused ? 'primary.500' : 'gray.500'}
                fontWeight="medium"
                mt={2}
                fontSize={'9px'}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#EAEAEA',
    elevation: 20,
    shadowColor: '#52006A',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.1,
  },
  mainItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(5),
    borderRadius: 1,
    borderColor: '#333B42',
  },
});

export default TabBar;
