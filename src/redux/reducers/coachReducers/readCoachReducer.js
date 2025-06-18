import { CLEAR_READ_COACHES, FAIL_FETCH_READ_COACHES, INITIATE_FETCH_READ_COACHES, SUCCESS_FETCH_READ_COACHES } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isCoachesLoading: false,
  coachStatusCode: null,
  coachMessage: null,
  coachMainData: [],
  error: null, // Add error property to initial state
};

export default function readCoachReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_COACHES:
      return {
        ...state,
        isCoachesLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_COACHES:
      return {
        ...state,
        isCoachesLoading: false,
        coachMainData: action.payload.data,
        coachStatusCode: action.payload.statusCode,
        coachMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_COACHES:

      return {
        ...state,
        isCoachesLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_COACHES:
      return {
        ...initialState,
        isCoachesLoading: false,
      };

    default:
      return state;
  }
}
