import axios from 'axios';
import {CURRENT_API} from '../lib';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Environment variable for token (set this in your environment)
const APP_ACCESS_TOKEN =
  process.env.APP_ACCESS_TOKEN ||
  '0477af7ae7f5bac1e0fd5cac6824cdfcccc824f97210f6e6e4d8fd9804010bea';

// Helper function to asynchronously fetch device information
const getDeviceHeaders = async () => {
  try {
    const version = await DeviceInfo.getVersion();
    const uniqueId = await DeviceInfo.getUniqueId();
    const deviceName = await DeviceInfo.getDeviceName();
    const model = await DeviceInfo.getModel();
    const systemName = await DeviceInfo.getSystemName();
    const systemVersion = await DeviceInfo.getSystemVersion();
    const brand = await DeviceInfo.getBrand();
    const manufacturer = await DeviceInfo.getManufacturer();

    return {
      'X-Platform': Platform.OS,
      'X-App-Version': version,
      'X-Device-Id': uniqueId,
      'X-Device-Name': deviceName,
      'X-Device-Model': model,
      'X-Device-System': systemName,
      'X-Device-System-Version': systemVersion,
      'X-Device-Brand': brand,
      'X-Device-Manufacturer': manufacturer,
      'X-App-Access-Token': APP_ACCESS_TOKEN,
    };
  } catch (error) {
    console.error('Error fetching device information:', error);
    throw error;
  }
};

// Create an Axios instance
const api = axios.create({
  baseURL: CURRENT_API,
});

// Axios request interceptor to dynamically set headers
api.interceptors.request.use(
  async config => {
    try {
      const deviceHeaders = await getDeviceHeaders();

      // Merge the dynamic headers with any existing ones
      config.headers = {
        ...config.headers,
        ...deviceHeaders,
      };

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error); // Handle error appropriately
    }
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
