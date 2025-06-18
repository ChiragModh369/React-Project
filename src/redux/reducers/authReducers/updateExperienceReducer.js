import { showLog } from '../../../commonFunctions/Functions';
import {
  INITIATE_UPDATE_EXPERIENCES,
  SUCCESS_UPDATE_EXPERIENCES,
  FAIL_UPDATE_EXPERIENCES,
  CLEAR_UPDATE_EXPERIENCES,
} from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isExperienceUpdating: false,
  updateExperienceStatusCode: null,
  updateExperienceMessage: null,
  updateExperienceMainData: null,
  error: null,
};

export default function updateExperienceReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_UPDATE_EXPERIENCES:
      return {
        ...state,
        isExperienceUpdating: true,
        error: null,
      };
    case SUCCESS_UPDATE_EXPERIENCES:
      return {
        ...state,
        isExperienceUpdating: false,
        updateExperienceMainData: action.payload.data,
        updateExperienceStatusCode: action.payload.statusCode,
        updateExperienceMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_UPDATE_EXPERIENCES:
      return {
        ...state,
        isExperienceUpdating: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_UPDATE_EXPERIENCES:
      return {
        ...initialState,
        isExperienceUpdating: false,
      };
    default:
      return state;
  }
}