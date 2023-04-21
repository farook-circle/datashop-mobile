import React from 'react';
import { Text } from 'react-native';
import { Pressable, Avatar, VStack } from 'native-base';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { hp } from '../../config/dpTopx';


export default function ({icon, name, color, onPress}) {

    return (
      <Pressable onPress={onPress}>
        {({isPressed, isFocused, isHovered}) => (
          <VStack space={'2'} alignItems={'center'} px={'3'}>
            <Avatar bgColor={color} rounded={'lg'} size={'20'}>
              <FontAwesome5Icon name={icon} color={'white'} size={hp(27)} />
            </Avatar>
            <Text style={{}}>{name}</Text>
          </VStack>
        )}
      </Pressable>
    );
}