import { showLog } from '../../../commonFunctions/Functions';
import {


  INITIATE_FETCH_READ_TEMPLATES,
  SUCCESS_FETCH_READ_TEMPLATES,
  FAIL_FETCH_READ_TEMPLATES,
  CLEAR_READ_TEMPLATES,
} from '../../actions/types/reduxConst';


const initialState = {
  status: false,
  isTemplateLoading: false,
  templateStatusCode: null,
  templateMessage: null,
  templateMainData: [],
  error: null, // Add error property to initial state
};

export default function readTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_TEMPLATES:
      return {
        ...state,
        isTemplateLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_TEMPLATES:

      return {
        ...state,
        isTemplateLoading: false,
        templateMainData: action.payload.original.data,
        templateStatusCode: action.payload.original.statusCode,
        templateMessage: action.payload.original.message,
        status: action.payload.original.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_TEMPLATES:

      return {
        ...state,
        isTemplateLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_TEMPLATES:
      return {
        ...initialState,
        isTemplateLoading: false,
      };

    default:
      return state;
  }
}
