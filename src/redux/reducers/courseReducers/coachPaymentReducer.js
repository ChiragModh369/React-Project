import {
  INITIATE_FETCH_COACH_PAYMENT,
  SUCCESS_FETCH_COACH_PAYMENT,
  FAIL_FETCH_COACH_PAYMENT,
  CLEAR_COACH_PAYMENT,
} from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isPaymentLoading: false,
  paymentStatusCode: null,
  paymentMessage: null,
  paymentMainData: {},
  error: null,
};

export default function coachPaymentReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_COACH_PAYMENT:
      return {
        ...state,
        isPaymentLoading: true,
        error: null,
      };
    case SUCCESS_FETCH_COACH_PAYMENT:
      return {
        ...state,
        isPaymentLoading: false,
        paymentMainData: action.payload.data,
        paymentStatusCode: action.payload.status,
        paymentMessage: action.payload.message,
        status: action.payload.success,
        error: null,
      };
    case FAIL_FETCH_COACH_PAYMENT:
      return {
        ...state,
        isPaymentLoading: false,
        error: action.payload.message || 'Unknown error',
      };
    case CLEAR_COACH_PAYMENT:
      return {
        ...initialState,
        isPaymentLoading: false,
      };
    default:
      return state;
  }
}