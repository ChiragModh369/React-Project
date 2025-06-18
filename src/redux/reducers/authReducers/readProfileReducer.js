import { showLog } from '../../../commonFunctions/Functions';
import {

  INITIATE_FETCH_READ_PROFILE,
  SUCCESS_FETCH_READ_PROFILE,
  FAIL_FETCH_READ_PROFILE,
  CLEAR_READ_PROFILE,
} from '../../actions/types/reduxConst';


const initialState = {
  status: false,
  isProfileLoading: false,
  profileStatusCode: null,
  profileMessage: null,
  profileMainData: {},
  error: null, // Add error property to initial state
};

export default function readProfileReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_PROFILE:
      return {
        ...state,
        isProfileLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_PROFILE:

      return {
        ...state,
        isProfileLoading: false,
        profileMainData: action.payload,
        profileStatusCode: action.payload.statusCode,
        profileMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_PROFILE:

      return {
        ...state,
        isProfileLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_PROFILE:
      return {
        ...initialState,
        isProfileLoading: false,
      };

    default:
      return state;
  }
}
