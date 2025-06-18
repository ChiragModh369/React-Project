import { CLEAR_BOOK_COACH, FAIL_FETCH_BOOK_COACH, INITIATE_FETCH_BOOK_COACH, SUCCESS_FETCH_BOOK_COACH } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isBookingLoading: false,
  bookingStatusCode: null,
  bookingMessage: null,
  bookingMainData: {},
  error: null, // Add error property to initial state
};

export default function bookCoachSessionReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_BOOK_COACH:
      return {
        ...state,
        isBookingLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_BOOK_COACH:
      return {
        ...state,
        isBookingLoading: false,
        bookingMainData: action.payload.data,
        bookingStatusCode: action.payload.statusCode,
        bookingMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_BOOK_COACH:

      return {
        ...state,
        isBookingLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_BOOK_COACH:
      return {
        ...initialState,
        isBookingLoading: false,
      };

    default:
      return state;
  }
}
