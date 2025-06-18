import {
  INITIATE_FETCH_REGISTER_USER,
  SUCCESS_FETCH_REGISTER_USER,
  FAIL_FETCH_REGISTER_USER,
  CLEAR_REGISTER_USER,
} from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isCreatingLoading: false,
  creatingStatusCode: null,
  creatingMessage: null,
  creatingMainData: {},
  error: null, // Add error property to initial state
};

export default function registerUserReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_REGISTER_USER:
      return {
        ...state,
        isCreatingLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_REGISTER_USER:

      return {
        ...state,
        isCreatingLoading: false,
        creatingMainData: action.payload,
        creatingStatusCode: action.payload.statusCode,
        creatingMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_REGISTER_USER:

      return {
        ...state,
        isCreatingLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_REGISTER_USER:
      return {
        ...initialState,
        isCreatingLoading: false,
      };

    default:
      return state;
  }
}
