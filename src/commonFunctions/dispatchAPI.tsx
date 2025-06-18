import { CLEAR_ADMIN_LOGIN, CLEAR_CREATE_PAYMENT, CLEAR_LOGIN_DATA, CLEAR_LOGOUT, CLEAR_LESSONS, CLEAR_ENROLL_USER, CLEAR_USER_PROGRESS, CLEAR_READ_COURSE_DETAIL, CLEAR_READ_COURSES } from "../redux/actions/types/reduxConst";
import store from "../redux/store/store";

export const dispatchAPI = () => {
    const dispatch = store.dispatch
    dispatch({ type: CLEAR_ADMIN_LOGIN });
    dispatch({ type: CLEAR_LOGOUT });
    dispatch({ type: CLEAR_LOGIN_DATA });
    dispatch({ type: CLEAR_READ_COURSES });
    dispatch({ type: CLEAR_READ_COURSE_DETAIL });
    dispatch({ type: CLEAR_CREATE_PAYMENT });
    dispatch({ type: CLEAR_LESSONS });
    dispatch({ type: CLEAR_ENROLL_USER })
    dispatch({ type: CLEAR_USER_PROGRESS })
}