import {
  INITIATE_FETCH_READ_SKILLS,
  SUCCESS_FETCH_READ_SKILLS,
  FAIL_FETCH_READ_SKILLS,
  CLEAR_READ_SKILLS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isSkillLoading: false,
  skillStatusCode: null,
  skillMessage: null,
  skillMainData: null,
  error: null,
};

export default function readSkillReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_SKILLS:
      return {
        ...state,
        isSkillLoading: true,
        error: null,
      };
    case SUCCESS_FETCH_READ_SKILLS:
      return {
        ...state,
        isSkillLoading: false,
        skillMainData: action.payload.data,
        skillStatusCode: action.payload.statusCode,
        skillMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_FETCH_READ_SKILLS:
      return {
        ...state,
        isSkillLoading: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_READ_SKILLS:
      return {
        ...initialState,
        isSkillLoading: false,
      };
    default:
      return state;
  }
}