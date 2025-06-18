import { showLog } from '../../../commonFunctions/Functions';
import {
  INITIATE_FETCH_READ_EXPERIENCES,
  SUCCESS_FETCH_READ_EXPERIENCES,
  FAIL_FETCH_READ_EXPERIENCES,
  CLEAR_READ_EXPERIENCES,
} from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isExperienceLoading: false,
  experienceStatusCode: null,
  experienceMessage: null,
  experienceMainData: null,
  error: null,
};

export default function readExperienceReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_EXPERIENCES:
      return {
        ...state,
        isExperienceLoading: true,
        error: null,
      };
    case SUCCESS_FETCH_READ_EXPERIENCES:
      return {
        ...state,
        isExperienceLoading: false,
        experienceMainData: action.payload.data,
        experienceStatusCode: action.payload.statusCode,
        experienceMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_FETCH_READ_EXPERIENCES:
      return {
        ...state,
        isExperienceLoading: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_READ_EXPERIENCES:
      return {
        ...initialState,
        isExperienceLoading: false,
      };
    default:
      return state;
  }
}