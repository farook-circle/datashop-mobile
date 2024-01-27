import {create} from 'apisauce';
import {CURRENT_API} from '../lib';
import {Platform} from 'react-native';

// for development server

// for production server
export const api = create({
  baseURL: CURRENT_API,
  headers: {
    'X-Platform': Platform.OS,
    'X-App-Build-Number': '3.5.0',
  },
});
