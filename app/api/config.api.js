import {create} from 'apisauce';
import {AppConstant, CURRENT_API} from '../lib';
import {Platform} from 'react-native';

// for development server

// for production server
export const api = create({
  baseURL: CURRENT_API,
  headers: {
    'X-Platform': Platform.OS,
    'X-App-Build-Number': '1.2.0',
    'X-Col-Build_Number': '0000000000',
  },
});
