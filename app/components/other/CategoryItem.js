import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../../../assets/colors/colors';
import {hp} from '../../config/dpTopx';
import {Pressable, VStack, HStack, Avatar} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

export default function CategoryItem({title, onPress, icon, children}) {
  return (
    <VStack>
      <Pressable onPress={onPress}>
        <HStack alignItems={'center'} justifyContent={'space-between'}>
          <HStack space={'4'} alignItems={'center'}>
            <Avatar rounded={'full'} size={'sm'} bgColor={'white'} shadow={'3'}>
              <FontAwesome name={icon} size={hp(15)} color={colors.primary} />
            </Avatar>
            <Text style={styles.itemTitle}>{title}</Text>
          </HStack>
          {/* <Feather name="chevron-right" size={hp(20)} color={colors.textLight} /> */}
        </HStack>
      </Pressable>
      {children}
    </VStack>
  );
}

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: hp(16),
    color: colors.textBlack,
  },
});
