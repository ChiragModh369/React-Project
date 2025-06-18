import { showLog } from '../../../commonFunctions/Functions';
import {
  CLEAR_LOGIN_DATA,
  INITIATE_FETCH_LOGIN_DATA,
  SUCCESS_FETCH_LOGIN_DATA,
} from '../../actions/types/reduxConst';

const initialState = {
  name: '',
  email: '',
  id: 0,
  profile_image: '',
  token: '',
};

const loginDataReducer = (state = initialState, action) => {
  switch (action.type) {

    case INITIATE_FETCH_LOGIN_DATA:
      return {
        ...state,
      };
    case SUCCESS_FETCH_LOGIN_DATA:
      return { ...state, ...action.payload };

    case CLEAR_LOGIN_DATA:
      return initialState;

    default:
      return state;
  }
};

export default loginDataReducer;
