import {
  INITIATE_FETCH_READ_SKILL_CATEGORIES,
  SUCCESS_FETCH_READ_SKILL_CATEGORIES,
  FAIL_FETCH_READ_SKILL_CATEGORIES,
  CLEAR_READ_SKILL_CATEGORIES,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isSkillCategoryLoading: false,
  skillCategoryStatusCode: null,
  skillCategoryMessage: null,
  skillCategoryMainData: null,
  error: null,
};

export default function readSkillCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_SKILL_CATEGORIES:
      return {
        ...state,
        isSkillCategoryLoading: true,
        error: null,
      };
    case SUCCESS_FETCH_READ_SKILL_CATEGORIES:
      return {
        ...state,
        isSkillCategoryLoading: false,
        skillCategoryMainData: action.payload.data,
        skillCategoryStatusCode: action.payload.statusCode,
        skillCategoryMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_FETCH_READ_SKILL_CATEGORIES:
      return {
        ...state,
        isSkillCategoryLoading: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_READ_SKILL_CATEGORIES:
      return {
        ...initialState,
        isSkillCategoryLoading: false,
      };
    default:
      return state;
  }
}