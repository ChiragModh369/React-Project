import {
  INITIATE_UPDATE_EDUCATIONS,
  SUCCESS_UPDATE_EDUCATIONS,
  FAIL_UPDATE_EDUCATIONS,
  CLEAR_UPDATE_EDUCATIONS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isEducationUpdating: false,
  updateEducationStatusCode: null,
  updateEducationMessage: null,
  updateEducationMainData: null,
  error: null,
};

export default function updateEducationReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_UPDATE_EDUCATIONS:
      return {
        ...state,
        isEducationUpdating: true,
        error: null,
      };
    case SUCCESS_UPDATE_EDUCATIONS:
      return {
        ...state,
        isEducationUpdating: false,
        updateEducationMainData: action.payload.data,
        updateEducationStatusCode: action.payload.statusCode,
        updateEducationMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_UPDATE_EDUCATIONS:
      return {
        ...state,
        isEducationUpdating: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_UPDATE_EDUCATIONS:
      return {
        ...initialState,
        isEducationUpdating: false,
      };
    default:
      return state;
  }
}