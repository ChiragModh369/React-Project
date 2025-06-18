import { showLog } from '../../../commonFunctions/Functions';
import {
  INITIATE_UPDATE_PROFILE,
  SUCCESS_UPDATE_PROFILE,
  FAIL_UPDATE_PROFILE,
  CLEAR_UPDATE_PROFILE,
} from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isProfileUpdating: false,
  updateStatusCode: null,
  updateMessage: null,
  updateMainData: null,
  error: null,
};

export default function updateProfileReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_UPDATE_PROFILE:
      return {
        ...state,
        isProfileUpdating: true,
        error: null,
      };
    case SUCCESS_UPDATE_PROFILE:
      return {
        ...state,
        isProfileUpdating: false,
        updateMainData: action.payload.data,
        updateStatusCode: action.payload.statusCode,
        updateMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_UPDATE_PROFILE:
      return {
        ...state,
        isProfileUpdating: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_UPDATE_PROFILE:
      return {
        ...initialState,
        isProfileUpdating: false,
      };
    default:
      return state;
  }
}