import EncryptedStorage from 'react-native-encrypted-storage';
import {
  COLLABORATOR_LOADED,
  COLLABORATOR_LOADING,
  GET_AGENTS,
  GET_COLLABORATOR_BANK,
  GET_COLLABORATOR_DATA,
  GET_COLLABORATOR_WHATSAPP,
} from '../constants/collaborator';

const initialState = {
  agents: [],
  collaborator_loading: false,
  collaborator_data: [],
  collaborator_whatsapp: {},
  collaborator_bank: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_AGENTS:
      return {
        ...state,
        agents: action.payload,
      };
    case COLLABORATOR_LOADING:
      return {
        ...state,
        collaborator_loading: true,
      };
    case COLLABORATOR_LOADED:
      return {
        ...state,
        collaborator_loading: false,
      };
    case GET_COLLABORATOR_DATA:
      return {
        ...state,
        collaborator_data: action.payload,
      };
    case GET_COLLABORATOR_WHATSAPP:
      return {
        ...state,
        collaborator_loading: false,
        collaborator_whatsapp: action.payload,
      };
    case GET_COLLABORATOR_BANK:
      return {
        ...state,
        collaborator_loading: false,
        collaborator_bank: action.payload,
      };
    default:
      return state;
  }
}
