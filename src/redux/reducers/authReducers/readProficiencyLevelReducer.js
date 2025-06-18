import {
  INITIATE_FETCH_READ_PROFICIENCY_LEVELS,
  SUCCESS_FETCH_READ_PROFICIENCY_LEVELS,
  FAIL_FETCH_READ_PROFICIENCY_LEVELS,
  CLEAR_READ_PROFICIENCY_LEVELS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isProficiencyLevelLoading: false,
  proficiencyLevelStatusCode: null,
  proficiencyLevelMessage: null,
  proficiencyLevelMainData: null,
  error: null,
};

export default function readProficiencyLevelReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_PROFICIENCY_LEVELS:
      return {
        ...state,
        isProficiencyLevelLoading: true,
        error: null,
      };
    case SUCCESS_FETCH_READ_PROFICIENCY_LEVELS:
      return {
        ...state,
        isProficiencyLevelLoading: false,
        proficiencyLevelMainData: action.payload.data,
        proficiencyLevelStatusCode: action.payload.statusCode,
        proficiencyLevelMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_FETCH_READ_PROFICIENCY_LEVELS:
      return {
        ...state,
        isProficiencyLevelLoading: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_READ_PROFICIENCY_LEVELS:
      return {
        ...initialState,
        isProficiencyLevelLoading: false,
      };
    default:
      return state;
  }
}