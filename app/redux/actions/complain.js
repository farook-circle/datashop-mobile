import axios from '../../axios';

export const getComplain = (data, callBackFunc) => (dispatch, getState) => {
  axios
    .get('/api/contact-info')
    .then(res => {})
    .catch(error => {
      // pass
    });
};
