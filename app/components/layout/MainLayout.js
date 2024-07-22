import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Box, HStack, IconButton} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {hp} from '../../config/dpTopx';
import {useNavigation} from '@react-navigation/native';

export const MainLayout = ({
  showHeader,
  headerTitle,
  rightElement,
  children,
  bgColor,
}) => {
  const {goBack} = useNavigation();
  return (
    <Box flex={1} safeArea bgColor={bgColor || 'white'}>
      {!rightElement ? (
        <HStack px={'2'} alignItems={'center'}>
          <IconButton
            onPress={goBack}
            rounded={'full'}
            size={'sm'}
            icon={
              <Feather name={'chevron-left'} size={hp(25)} color={'black'} />
            }
          />
          {showHeader && (
            <Box
              width={'full'}
              position={'absolute'}
              alignItems={'center'}
              zIndex={-1}>
              <Text style={styles.text}>{headerTitle}</Text>
            </Box>
          )}
        </HStack>
      ) : (
        <HStack px={'2'} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            onPress={goBack}
            rounded={'full'}
            size={'sm'}
            icon={
              <Feather name={'chevron-left'} size={hp(25)} color={'black'} />
            }
          />
          {showHeader && <Text style={styles.text}>{headerTitle}</Text>}
          {rightElement}
        </HStack>
      )}

      {children}
    </Box>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 16,
  },
});
