import {launchImageLibrary} from 'react-native-image-picker';

export const pickImage = async () => {
  const options = {};

  try {
    const result = await launchImageLibrary(options);
    return result?.assets[0];
  } catch (error) {
    
    return null;
  }
};
