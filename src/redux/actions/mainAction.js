import { INITIATE_FETCH_ADMIN_LOGIN, INITIATE_FETCH_BOOK_COACH, INITIATE_FETCH_COACH_PAYMENT, INITIATE_FETCH_CREATE_PAYMENT, INITIATE_FETCH_ENROLL_USER, INITIATE_FETCH_LESSONS, INITIATE_FETCH_LOGIN_DATA, INITIATE_FETCH_LOGOUT, INITIATE_FETCH_READ_COACHES, INITIATE_FETCH_READ_COURSE_DETAIL, INITIATE_FETCH_READ_COURSES, INITIATE_FETCH_READ_JOBS, INITIATE_FETCH_READ_PROFILE, INITIATE_FETCH_READ_TEMPLATES, INITIATE_FETCH_READ_TIMESLOTS, INITIATE_FETCH_REGISTER_USER, INITIATE_FETCH_USER_PROGRESS } from "./types/reduxConst";

export function fetchLoginAdminAction(data) {
    return {
        type: INITIATE_FETCH_ADMIN_LOGIN,
        payload: data,
    };
}
export function fetchRegisterUserAction(data) {
    return {
        type: INITIATE_FETCH_REGISTER_USER,
        payload: data,
    };
}
export function fetchLoginDataAction(data) {
    return {
        type: INITIATE_FETCH_LOGIN_DATA,
        payload: data,
    };
}


export function fetchLogoutAction(data) {
    return {
        type: INITIATE_FETCH_LOGOUT,
        payload: data,
    };
}

export function fetchReadCourseAction(data) {
    return {
        type: INITIATE_FETCH_READ_COURSES,
        payload: data,
    };
}

export function fetchReadCourseDetailAction(data) {
    return {
        type: INITIATE_FETCH_READ_COURSE_DETAIL,
        payload: data,
    };
}

export function fetchReadLessonAction(data) {
    return {
        type: INITIATE_FETCH_LESSONS,
        payload: data,
    };
}

export function fetchEnrollUserAction(data) {
    return {
        type: INITIATE_FETCH_ENROLL_USER,
        payload: data,
    };
}
export function fetchUpdateUserProgressAction(data) {
    return {
        type: INITIATE_FETCH_USER_PROGRESS,
        payload: data,
    };
}

export function fetchCreatePaymentAction(data) {
    return {
        type: INITIATE_FETCH_CREATE_PAYMENT,
        payload: data,
    };
}

export function fetchReadCoachesAction(data) {
    return {
        type: INITIATE_FETCH_READ_COACHES,
        payload: data,
    };
}

export function fetchReadTimeSlotsAction(data) {
    return {
        type: INITIATE_FETCH_READ_TIMESLOTS,
        payload: data,
    };
}

export function fetchBookSessionAction(data) {
    return {
        type: INITIATE_FETCH_BOOK_COACH,
        payload: data,
    };
}

export function fetchReadJobsAction(data) {
    return {
        type: INITIATE_FETCH_READ_JOBS,
        payload: data,
    };
}

export function fetchReadProfileAction(data) {
    return {
        type: INITIATE_FETCH_READ_PROFILE,
        payload: data,
    };
}

export function fetchReadTemplateAction(data) {
    return {
        type: INITIATE_FETCH_READ_TEMPLATES,
        payload: data,
    };
}
export function fetchCoachPaymentAction(data) {
  return {
    type: INITIATE_FETCH_COACH_PAYMENT,
    payload: data,
  };
}