import {create} from 'apisauce';
import {CURRENT_API, NODE_CURRENT_API} from '../lib';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Environment variable for token (configure this based on your environment)
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
    return {};
  }
};

// Create the API instance
export const api = create({
  baseURL: CURRENT_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Create the Node API Instance
export const nodeApi = create({
  baseURL: NODE_CURRENT_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include device headers dynamically in every request
nodeApi.addAsyncRequestTransform(async request => {
  const deviceHeaders = await getDeviceHeaders();

  // Add all dynamic headers to the request
  Object.entries(deviceHeaders).forEach(([key, value]) => {
    request.headers[key] = value;
  });
});

// Add interceptor to include device headers dynamically in every request
api.addAsyncRequestTransform(async request => {
  const deviceHeaders = await getDeviceHeaders();

  // Add all dynamic headers to the request
  Object.entries(deviceHeaders).forEach(([key, value]) => {
    request.headers[key] = value;
  });
});
