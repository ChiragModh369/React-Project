import {
  INITIATE_DELETE_EXPERIENCES,
  SUCCESS_DELETE_EXPERIENCES,
  FAIL_DELETE_EXPERIENCES,
  CLEAR_DELETE_EXPERIENCES,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isExperienceDeleting: false,
  deleteExperienceStatusCode: null,
  deleteExperienceMessage: null,
  deleteExperienceMainData: null,
  error: null,
};

export default function deleteExperienceReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_DELETE_EXPERIENCES:
      return {
        ...state,
        isExperienceDeleting: true,
        error: null,
      };
    case SUCCESS_DELETE_EXPERIENCES:
      return {
        ...state,
        isExperienceDeleting: false,
        deleteExperienceMainData: action.payload.data,
        deleteExperienceStatusCode: action.payload.statusCode,
        deleteExperienceMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_DELETE_EXPERIENCES:
      return {
        ...state,
        isExperienceDeleting: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_DELETE_EXPERIENCES:
      return {
        ...initialState,
        isExperienceDeleting: false,
      };
    default:
      return state;
  }
}