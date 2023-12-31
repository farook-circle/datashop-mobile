import {extendTheme} from 'native-base';

const customFonts = {
  Montserrat: {
    100: {
      normal: 'Poppins-Light',
      italic: 'Poppins-LightItalic',
    },
    200: {
      normal: 'Poppins-Light',
      italic: 'Poppins-LightItalic',
    },
    300: {
      normal: 'Poppins-Light',
      italic: 'Poppins-LightItalic',
    },
    400: {
      normal: 'Poppins-Regular',
      italic: 'Poppins-Italic',
    },
    500: {
      normal: 'Poppins-Medium',
    },
    600: {
      normal: 'Poppins-Medium',
      italic: 'Poppins-MediumItalic',
    },
    700: {
      normal: 'Poppins-Bold',
    },
    800: {
      normal: 'Poppins-Bold',
      italic: 'Poppins-BoldItalic',
    },
    900: {
      normal: 'Poppins-Bold',
      italic: 'Poppins-BoldItalic',
    },
  },
};

const newColorTheme = {
  primary: {
    100: '#D6E4FF',
    200: '#ADC8FF',
    300: '#84A9FF',
    400: '#6690FF',
    500: '#3366FF',
    600: '#254EDB',
    700: '#1939B7',
    800: '#102693',
    900: '#091A7A',
  },
  secondary: {
    100: '#D4E0F9',
    200: '#ABC1F4',
    300: '#7B97DF',
    400: '#546FC0',
    500: '#264097',
    600: '#1B3081',
    700: '#13236C',
    800: '#0C1857',
    900: '#071048',
  },
};

export const theme = extendTheme({
  colors: newColorTheme,
  fontConfig: customFonts,
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  },
});
