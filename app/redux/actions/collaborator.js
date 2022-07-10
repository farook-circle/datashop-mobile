/* eslint-disable no-alert */
import axios from '../../axios';
import {
  COLLABORATOR_LOADED,
  COLLABORATOR_LOADING,
  GET_AGENTS,
  GET_COLLABORATOR_BANK,
  GET_COLLABORATOR_DATA,
  GET_COLLABORATOR_WHATSAPP,
} from '../constants/collaborator';
import {getWalletBalance} from './wallet';

export const getCollaboratorAgent = callBackFunc => (dispatch, getState) => {
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
    config.headers.Authorization = `Token ${token}`;
  }

  axios
    .get('/collaborators', config)
    .then(res => {
      callBackFunc(res.data, res.status);
    })
    .catch(error => {
      if (error.response) {
        callBackFunc(error.response.data, error.response.status);
      } else {
        callBackFunc('error', 400);
        alert('Network error please check your internet connection');
      }
    });
};

export const fundCollaboratorAgent =
  (data, callBackFunc) => (dispatch, getState) => {
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(data);

    //Check to see if there is an token and to header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    axios
      .post('/collaborators/fund-agent', body, config)
      .then(res => {
        callBackFunc(res.data, res.status);
      })
      .catch(error => {
        if (error.response) {
          callBackFunc(error.response.data, error.response.status);
        } else {
          callBackFunc('error', 400);
          alert('Network error please check your internet connection');
        }
      });
  };

export const getCollaboratorData = () => (dispatch, getState) => {
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
    config.headers.Authorization = `Token ${token}`;
  }

  axios
    .get('/collaborators/data-plans', config)
    .then(res => {
      dispatch({type: GET_COLLABORATOR_DATA, payload: res.data});
    })
    .catch(error => {
      if (error.response) {
        //
      } else {
        //
      }
    });
};

export const updateCollaboratorData =
  (data, callBackFunc) => (dispatch, getState) => {
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({collaborator_price: data.collaborator_price});

    //Check to see if there is an token and to header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    axios
      .put(`/collaborators/data-plans/${data.data_plan_id}/`, body, config)
      .then(res => {
        callBackFunc(res.data, res.status);
      })
      .catch(error => {
        if (error.response) {
          callBackFunc(error.response.data, error.response.status);
        } else {
          callBackFunc('error', 400);
          alert('Network error please check your internet connection');
        }
      });
  };

export const withdrawCollaborator =
  (data, callBackFunc) => (dispatch, getState) => {
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(data);

    //Check to see if there is an token and to header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    axios
      .post('/collaborators/wallet/withdraw', body, config)
      .then(res => {
        dispatch(getWalletBalance());
        callBackFunc(res.data, res.status);
      })
      .catch(error => {
        if (error.response) {
          callBackFunc(error.response.data, error.response.status);
        } else {
          callBackFunc('error', 1000);
          alert('Network error please check your internet connection');
        }
      });
  };

export const getCollaboratorWhatsapp = () => (dispatch, getState) => {
  dispatch({type: COLLABORATOR_LOADING});
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
    config.headers.Authorization = `Token ${token}`;
  }

  axios
    .get('/collaborators/whatsapp', config)
    .then(res => {
      dispatch({type: GET_COLLABORATOR_WHATSAPP, payload: res.data});
    })
    .catch(error => {
      if (error.response) {
        dispatch({type: COLLABORATOR_LOADED});
      } else {
        //
        dispatch({type: COLLABORATOR_LOADED});
      }
    });
};

export const updateCollaboratorWhatsapp =
  (data, callBackFunc) => (dispatch, getState) => {
    dispatch({type: COLLABORATOR_LOADING});
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(data);

    //Check to see if there is an token and to header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    axios
      .post('/collaborators/whatsapp', body, config)
      .then(res => {
        dispatch({type: GET_COLLABORATOR_WHATSAPP, payload: res.data});
      })
      .catch(error => {
        if (error.response) {
          callBackFunc('error', 400);
          dispatch({type: COLLABORATOR_LOADED});
        } else {
          callBackFunc('error', 1000);
          dispatch({type: COLLABORATOR_LOADED});
        }
      });
  };

export const getCollaboratorBank = () => (dispatch, getState) => {
  dispatch({type: COLLABORATOR_LOADING});
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
    config.headers.Authorization = `Token ${token}`;
  }

  axios
    .get('/collaborators/bank', config)
    .then(res => {
      dispatch({type: GET_COLLABORATOR_BANK, payload: res.data});
    })
    .catch(error => {
      if (error.response) {
        dispatch({type: COLLABORATOR_LOADED});
      } else {
        //
        dispatch({type: COLLABORATOR_LOADED});
      }
    });
};

export const updateCollaboratorBank =
  (data, callBackFunc) => (dispatch, getState) => {
    dispatch({type: COLLABORATOR_LOADING});
    //Get Token from the state

    const token = getState().auth.token;
    // Header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(data);

    //Check to see if there is an token and to header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    axios
      .post('/collaborators/bank', body, config)
      .then(res => {
        dispatch({type: GET_COLLABORATOR_BANK, payload: res.data});
      })
      .catch(error => {
        if (error.response) {
          callBackFunc('error', 400);
          dispatch({type: COLLABORATOR_LOADED});
        } else {
          callBackFunc('error', 1000);
          dispatch({type: COLLABORATOR_LOADED});
        }
      });
  };
