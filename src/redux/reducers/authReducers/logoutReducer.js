import { showLog } from '../../../commonFunctions/Functions';
import {
  CLEAR_LOGOUT,
  FAIL_FETCH_LOGOUT,
  INITIATE_FETCH_LOGOUT,
  SUCCESS_FETCH_LOGOUT,
} from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isLogoutLoading: false,
  logoutStatusCode: null,
  logoutMessage: null,
  logoutMainData: {},
  error: null, // Add error property to initial state
};

export default function logoutReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_LOGOUT:
      return {
        ...state,
        isLogoutLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_LOGOUT:
      showLog('SUCCESS_FETCH_LOGOUT payload:', action.payload);
      return {
        ...state,
        isLogoutLoading: false,
        logoutMainData: action.payload,
        logoutStatusCode: action.payload.statusCode,
        logoutMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_LOGOUT:
      showLog('FAIL_FETCH_LOGOUT payload:', JSON.stringify(action.payload));
      return {
        ...state,
        isLogoutLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_LOGOUT:
      return {
        ...initialState,
        isLogoutLoading: false,
      };

    default:
      return state;
  }
}
