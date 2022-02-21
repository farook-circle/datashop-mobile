import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';

const Button = ({text, background_color, outline}) => {
  return (
    <TouchableOpacity style={styles.buttonStyle}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.textWhite,
  },
});

export default Button;
