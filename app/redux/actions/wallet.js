import axios from '../../axios';
import {
  CREATE_VIRTUAL_ACCOUNT,
  GET_BALANCE,
  GET_VIRTUAL_ACCOUNT,
  DELETE_VIRTUAL_ACCOUNT,
  GET_MOM,
  GET_ACCOUNT_NUMBER,
  GET_MOMO_AGENT_NUMBER,
  GET_PAYMENT_STATUS,
  GET_AIRTIME_FUNDING,
} from '../constants/wallet';
import {AUTH_ERROR} from '../constants/auth';

export const getWalletBalance = () => (dispatch, getState) => {
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
    .get('/wallet/balance', config)
    .then(res => {
      dispatch({
        type: GET_BALANCE,
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

export const getPaymentStatus = () => (dispatch, getState) => {
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
    .get('/wallet/payment-status', config)
    .then(res => {
      dispatch({
        type: GET_PAYMENT_STATUS,
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

export const getAirtimeFundingInstruction = () => (dispatch, getState) => {
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
    .get('/wallet/airtime-funding', config)
    .then(res => {     
      dispatch({
        type: GET_AIRTIME_FUNDING,
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

export const depositMoneyToWallet =
  (amount, completeCardDeposit) => (dispatch, getState) => {
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

    const data = JSON.stringify({amount});

    axios
      .post('/flutterwave/card/payment', data, config)
      .then(res => {
        completeCardDeposit(res.data);
      })
      .catch(error => {
        if (error.response) {
          completeCardDeposit(false);
        } else {
          // do nothing
          completeCardDeposit(false);
        }
      });
  };

export const createVirtualAccount =
  (amount, completeWithAccount) => (dispatch, getState) => {
    const token = getState().auth.token;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    //Check to see if there is an token and to header
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }

    const data = JSON.stringify({amount});

    axios
      .post('/flutterwave/bank/account', data, config)
      .then(res => {
        dispatch({
          type: CREATE_VIRTUAL_ACCOUNT,
          payload: res.data,
        });
        completeWithAccount();
      })
      .catch(error => {
        if (error.response) {
          // do nothing
          completeWithAccount(false);
        } else {
          // do nothing
          completeWithAccount(false);
        }
      });
  };

export const getVirtualAccount = () => (dispatch, getState) => {
  const token = getState().auth.token;

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
    .get('/flutterwave/bank/get_account', config)
    .then(res => {
      dispatch({
        type: GET_VIRTUAL_ACCOUNT,
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

export const deleteVirtualAccount = () => (dispatch, getState) => {
  const token = getState().auth.token;

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
    .get('/flutterwave/bank/delete', config)
    .then(res => {
      dispatch({
        type: DELETE_VIRTUAL_ACCOUNT,
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

export const getMomoAGentNumber = () => (dispatch, getState) => {
  const token = getState().auth.token;

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
    .get('/wallet/momo-agent', config)

    .then(res => {
      dispatch({
        type: GET_MOMO_AGENT_NUMBER,
        payload: res.data[0],
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

export const paymentAccountDetails = () => (dispatch, getState) => {
  const token = getState().auth.token;

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
    .get('/wallet/payment-method', config)
    .then(res => {
      dispatch({
        type: GET_ACCOUNT_NUMBER,
        payload: res.data[0],
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
