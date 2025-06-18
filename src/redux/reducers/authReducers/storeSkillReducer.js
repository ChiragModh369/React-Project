import {
  INITIATE_STORE_SKILLS,
  SUCCESS_STORE_SKILLS,
  FAIL_STORE_SKILLS,
  CLEAR_STORE_SKILLS,
} from '../../actions/types/reduxConst';
import { showLog } from '../../../commonFunctions/Functions';

const initialState = {
  status: false,
  isSkillStoring: false,
  storeSkillStatusCode: null,
  storeSkillMessage: null,
  storeSkillMainData: null,
  error: null,
};

export default function storeSkillReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_STORE_SKILLS:
      return {
        ...state,
        isSkillStoring: true,
        error: null,
      };
    case SUCCESS_STORE_SKILLS:
      return {
        ...state,
        isSkillStoring: false,
        storeSkillMainData: action.payload.data,
        storeSkillStatusCode: action.payload.statusCode,
        storeSkillMessage: action.payload.message,
        status: action.payload.status,
        error: null,
      };
    case FAIL_STORE_SKILLS:
      return {
        ...state,
        isSkillStoring: false,
        error: action.payload?.message || 'Unknown error',
      };
    case CLEAR_STORE_SKILLS:
      return {
        ...initialState,
        isSkillStoring: false,
      };
    default:
      return state;
  }
}