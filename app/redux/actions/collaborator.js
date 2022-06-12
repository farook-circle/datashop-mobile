import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../../axios';
import {GET_CONTACT_INFO} from '../constants/config';

export const getContactInfo = () => dispatch => {
  axios
    .get('/api/contact-info')
    .then(res => {
      dispatch({
        type: GET_CONTACT_INFO,
        payload: res.data,
      });
    })
    .catch(error => {
      // pass
    });
};
