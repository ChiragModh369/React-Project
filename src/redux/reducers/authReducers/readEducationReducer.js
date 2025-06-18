import {
  INITIATE_FETCH_READ_EDUCATIONS,
  SUCCESS_FETCH_READ_EDUCATIONS,
  FAIL_FETCH_READ_EDUCATIONS,
  CLEAR_READ_EDUCATIONS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isEducationLoading: false,
  educationStatusCode: null,
  educationMessage: null,
  educationMainData: null,
  error: null,
};

export default function readEducationReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_EDUCATIONS:
      return {
        ...state,
        isEducationLoading: true,
        error: null,
      };
    case SUCCESS_FETCH_READ_EDUCATIONS:
      return {
        ...state,
        isEducationLoading: false,
        educationMainData: action.payload.data,
        educationStatusCode: action.payload.statusCode,
        educationMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_FETCH_READ_EDUCATIONS:
      return {
        ...state,
        isEducationLoading: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_READ_EDUCATIONS:
      return {
        ...initialState,
        isEducationLoading: false,
      };
    default:
      return state;
  }
}