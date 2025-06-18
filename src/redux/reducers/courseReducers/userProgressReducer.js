import { CLEAR_USER_PROGRESS, FAIL_FETCH_USER_PROGRESS, INITIATE_FETCH_USER_PROGRESS, SUCCESS_FETCH_USER_PROGRESS } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isProgressLoading: false,
  userProgressStatusCode: null,
  userProgressMessage: null,
  userProgressMainData: {},
  error: null, // Add error property to initial state
};

export default function userProgressReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_USER_PROGRESS:
      return {
        ...state,
        isProgressLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_USER_PROGRESS:
      return {
        ...state,
        isProgressLoading: false,
        userProgressMainData: action.payload.data,
        userProgressStatusCode: action.payload.statusCode,
        userProgressMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_USER_PROGRESS:

      return {
        ...state,
        isProgressLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_USER_PROGRESS:
      return {
        ...initialState,
        isProgressLoading: false,
      };

    default:
      return state;
  }
}
