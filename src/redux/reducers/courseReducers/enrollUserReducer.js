import { CLEAR_ENROLL_USER, FAIL_FETCH_ENROLL_USER, INITIATE_FETCH_ENROLL_USER, SUCCESS_FETCH_ENROLL_USER } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isEnrollmentLoading: false,
  enrollUserStatusCode: null,
  enrollUserMessage: null,
  enrollUserMainData: {},
  error: null, // Add error property to initial state
};

export default function enrollUserReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_ENROLL_USER:
      return {
        ...state,
        isEnrollmentLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_ENROLL_USER:
      return {
        ...state,
        isEnrollmentLoading: false,
        enrollUserMainData: action.payload.data,
        enrollUserStatusCode: action.payload.statusCode,
        enrollUserMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_ENROLL_USER:

      return {
        ...state,
        isEnrollmentLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_ENROLL_USER:
      return {
        ...initialState,
        isEnrollmentLoading: false,
      };

    default:
      return state;
  }
}
