import {
  INITIATE_DELETE_SKILLS,
  SUCCESS_DELETE_SKILLS,
  FAIL_DELETE_SKILLS,
  CLEAR_DELETE_SKILLS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isSkillDeleting: false,
  deleteSkillStatusCode: null,
  deleteSkillMessage: null,
  deleteSkillMainData: null,
  error: null,
};

export default function deleteSkillReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_DELETE_SKILLS:
      return {
        ...state,
        isSkillDeleting: true,
        error: null,
      };
    case SUCCESS_DELETE_SKILLS:
      return {
        ...state,
        isSkillDeleting: false,
        deleteSkillMainData: action.payload.data,
        deleteSkillStatusCode: action.payload.statusCode,
        deleteSkillMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_DELETE_SKILLS:
      return {
        ...state,
        isSkillDeleting: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_DELETE_SKILLS:
      return {
        ...initialState,
        isSkillDeleting: false,
      };
    default:
      return state;
  }
}