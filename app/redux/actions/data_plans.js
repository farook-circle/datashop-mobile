import axios from '../../axios';
import {
  GET_DATA_BUNDLES,
  DATA_BUNDLE_LOADED,
  DATA_BUNDLE_CHECKOUT_SUCCESS,
  DATA_BUNDLE_CHECKOUT_FAILED,
  SET_LOADING,
  DATA_PURCHASE_HISTORY,
} from '../constants/data_bundles';
import {GET_BALANCE} from '../constants/wallet';
import {AUTH_ERROR} from '../constants/auth';

export const getDataBundle = () => (dispatch, getState) => {
  //Get Token from the state

  const token = getState().auth.token;
  // Header
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Check to see if there is an token and to header
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  axios
    .get('/dataplans/list', config)
    .then(res => {
      dispatch({
        type: DATA_BUNDLE_LOADED,
        payload: res.data,
      });
    })
    .catch(error => {
      if (error.response) {
        // do nothing
      } else {
        // do nothing
      }
    });
};

export const buyDataBundle =
  (userData, handleCheckoutSuccess) => (dispatch, getState) => {
    dispatch({type: SET_LOADING});
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const data = JSON.stringify(userData);

    //Check to see if there is an token and to header
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }

    axios
      .post('/dataplans/buy/data', data, config)
      .then(res => {
        dispatch({
          type: DATA_BUNDLE_CHECKOUT_SUCCESS,
        });
        dispatch({
          type: DATA_PURCHASE_HISTORY,
          payload: res.data.history,
        });
        dispatch({
          type: GET_BALANCE,
          payload: res.data,
        });
        handleCheckoutSuccess();
      })
      .catch(error => {
        if (error.response) {
          if (error.response.data) {
            if (error.response.data.reason) {
              alert(error.response.data.reason);
            } else {
              alert('Something went wrong please try again');
            }
          }
          dispatch({type: DATA_BUNDLE_CHECKOUT_FAILED});
        } else {
          // do nothing
          alert('Connection error please check you network and try again');
          dispatch({type: DATA_BUNDLE_CHECKOUT_FAILED});
        }
      });
  };

export const getDataPurchaseHistory = () => (dispatch, getState) => {
  //Get Token from the state

  const token = getState().auth.token;
  // Header
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Check to see if there is an token and to header
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  axios
    .get('/dataplans/buy/data/history', config)
    .then(res => {
      dispatch({
        type: DATA_PURCHASE_HISTORY,
        payload: res.data,
      });
    })
    .catch(error => {
      if (error.response) {
        // nothing
      } else {
        // do nothing
      }
    });
};
