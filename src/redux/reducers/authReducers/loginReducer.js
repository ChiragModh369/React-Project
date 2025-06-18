import { showLog } from '../../../commonFunctions/Functions';
import {
  SUCCESS_FETCH_ADMIN_LOGIN,
  INITIATE_FETCH_ADMIN_LOGIN,
  CLEAR_ADMIN_LOGIN,
  FAIL_FETCH_ADMIN_LOGIN,
} from '../../actions/types/reduxConst';


const initialState = {
  status: false,
  isAdminLoading: false,
  adminStatusCode: null,
  adminMessage: null,
  adminMainData: {},
  error: null, // Add error property to initial state
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_ADMIN_LOGIN:
      return {
        ...state,
        isAdminLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_ADMIN_LOGIN:

      return {
        ...state,
        isAdminLoading: false,
        adminMainData: action.payload,
        adminStatusCode: action.payload.statusCode,
        adminMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_ADMIN_LOGIN:
      showLog('FAIL_FETCH_ADMIN_LOGIN payload:', JSON.stringify(action.payload));
      return {
        ...state,
        isAdminLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_ADMIN_LOGIN:
      return {
        ...initialState,
        isAdminLoading: false,
      };

    default:
      return state;
  }
}
