import { CLEAR_READ_TIMESLOTS, FAIL_FETCH_READ_TIMESLOTS, INITIATE_FETCH_READ_TIMESLOTS, SUCCESS_FETCH_READ_TIMESLOTS } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isTimeSlotLoading: false,
  timeSlotStatusCode: null,
  timeSlotMessage: null,
  timeSlotMainData: {},
  error: null, // Add error property to initial state
};

export default function readTimeSlotsReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_TIMESLOTS:
      return {
        ...state,
        isTimeSlotLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_TIMESLOTS:
      return {
        ...state,
        isTimeSlotLoading: false,
        timeSlotMainData: action.payload.data,
        timeSlotStatusCode: action.payload.statusCode,
        timeSlotMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_TIMESLOTS:

      return {
        ...state,
        isTimeSlotLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_TIMESLOTS:
      return {
        ...initialState,
        isTimeSlotLoading: false,
      };

    default:
      return state;
  }
}
