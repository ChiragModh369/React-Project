import { CLEAR_CREATE_PAYMENT, FAIL_FETCH_CREATE_PAYMENT, INITIATE_FETCH_CREATE_PAYMENT, SUCCESS_FETCH_CREATE_PAYMENT } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isPaymentLoading: false,
  paymentStatusCode: null,
  paymentMessage: null,
  paymentMainData: {},
  error: null, // Add error property to initial state
};

export default function createPaymentReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_CREATE_PAYMENT:
      return {
        ...state,
        isPaymentLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_CREATE_PAYMENT:
      return {
        ...state,
        isPaymentLoading: false,
        paymentMainData: action.payload.data,
        paymentStatusCode: action.payload.statusCode,
        paymentMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_CREATE_PAYMENT:

      return {
        ...state,
        isPaymentLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_CREATE_PAYMENT:
      return {
        ...initialState,
        isPaymentLoading: false,
      };

    default:
      return state;
  }
}
