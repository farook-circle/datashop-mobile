import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function OverLayModel({
  children,
  style,
  onOverlayPress = () => {},
}) {
  return (
    <Pressable onPress={onOverlayPress} style={styles.container}>
      <View style={[styles.container, style]}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.5)',
    zIndex: 1000,
  },
});
