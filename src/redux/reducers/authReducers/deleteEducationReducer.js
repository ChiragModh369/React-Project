import {
  INITIATE_DELETE_EDUCATIONS,
  SUCCESS_DELETE_EDUCATIONS,
  FAIL_DELETE_EDUCATIONS,
  CLEAR_DELETE_EDUCATIONS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isEducationDeleting: false,
  deleteEducationStatusCode: null,
  deleteEducationMessage: null,
  deleteEducationMainData: null,
  error: null,
};

export default function deleteEducationReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_DELETE_EDUCATIONS:
      return {
        ...state,
        isEducationDeleting: true,
        error: null,
      };
    case SUCCESS_DELETE_EDUCATIONS:
      return {
        ...state,
        isEducationDeleting: false,
        deleteEducationMainData: action.payload.data,
        deleteEducationStatusCode: action.payload.statusCode,
        deleteEducationMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_DELETE_EDUCATIONS:
      return {
        ...state,
        isEducationDeleting: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_DELETE_EDUCATIONS:
      return {
        ...initialState,
        isEducationDeleting: false,
      };
    default:
      return state;
  }
}