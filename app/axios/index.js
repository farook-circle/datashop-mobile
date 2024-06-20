import axios from 'axios';
import {CURRENT_API} from '../lib';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

// for production server
export default axios.create({
  baseURL: CURRENT_API,
  headers: {
    'X-Platform': Platform.OS,
    'X-App-Version': DeviceInfo.getVersion(),
    'X-Device-Id': DeviceInfo.getUniqueId(),
    'X-Device-Name': DeviceInfo.getDeviceName(),
    'X-Device-Model': DeviceInfo.getModel(),
    'X-Device-System': DeviceInfo.getSystemName(),
    'X-Device-System-Version': DeviceInfo.getSystemVersion(),
    'X-Device-Brand': DeviceInfo.getBrand(),
    'X-Device-Manufacturer': DeviceInfo.getManufacturer(),
    'X-App-Access-Token':
      '0477af7ae7f5bac1e0fd5cac6824cdfcccc824f97210f6e6e4d8fd9804010bea',
  },
});
