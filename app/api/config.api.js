import {create} from 'apisauce';
import {AppConstant} from '../lib';
import {Platform} from 'react-native';

// for development server

// for production server
export const api = create({
  baseURL: AppConstant.Config.LOCAL_API_URL,
  headers: {
    'X-Platform': Platform.OS,
    'X-App-Build-Number': '1.2.0',
    'X-Col-Build_Number': '0000000000',
  },
});
