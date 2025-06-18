
import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { Constants } from '@/Constants';
import { showLog } from '@/commonFunctions/Functions';
import { BASE_API_URL, CREATE_COURSE_PAYMENT, READ_COURSES, READ_COURSE_DETAIL, READ_LESSONS, ENROLL_USER, UPDATE_USER_PROGRESS } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { SUCCESS_FETCH_CREATE_PAYMENT, FAIL_FETCH_CREATE_PAYMENT, FAIL_FETCH_READ_COURSES, SUCCESS_FETCH_READ_COURSES } from '@/redux/actions/types/reduxConst';
import { FAIL_FETCH_ENROLL_USER, FAIL_FETCH_LESSONS, FAIL_FETCH_READ_COURSE_DETAIL, FAIL_FETCH_USER_PROGRESS, SUCCESS_FETCH_ENROLL_USER, SUCCESS_FETCH_LESSONS, SUCCESS_FETCH_READ_COURSE_DETAIL, SUCCESS_FETCH_USER_PROGRESS } from '../../actions/types/reduxConst';
import { localStorageHelper } from "@/commonFunctions/localStorageHelper";
//For Read all courses
async function fetchReadCourses(data) {
    let queryParams = new URLSearchParams(data).toString();
    let config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_COURSES}?${queryParams}`,

    };
    showLog('Config Read Courses', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchReadCoursesHandler(action) {
    try {
        const response = yield call(fetchReadCourses, action.payload);
        yield put({
            type: SUCCESS_FETCH_READ_COURSES,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_READ_COURSES,
            payload: errorPayload,
        });
    }
}

//For Read course detail
async function fetchReadCourseDetail(data) {
    let config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_COURSE_DETAIL}${data.id}`,

    };
    showLog('Config Read Course detail', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchReadCourseDetailHandler(action) {
    try {
        const response = yield call(fetchReadCourseDetail, action.payload);
        yield put({
            type: SUCCESS_FETCH_READ_COURSE_DETAIL,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_READ_COURSE_DETAIL,
            payload: errorPayload,
        });
    }
}

//For Read lessons
async function fetchReadLessons(data) {
    const loginData = localStorageHelper.get(Constants.loginData)
    let config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_LESSONS}${data.id}`,
        headers: {
            Authorization: `Bearer ${loginData?.token}`,
        }
    };
    showLog('Config Read Lessons', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchReadLesssonsHandler(action) {
    try {
        const response = yield call(fetchReadLessons, action.payload);
        yield put({
            type: SUCCESS_FETCH_LESSONS,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_LESSONS,
            payload: errorPayload,
        });
    }
}

//For Enrolling user into course
async function fetchEnrollUser(data) {
    const loginData = localStorageHelper.get(Constants.loginData)
    // Create FormData
    const formData = new FormData();
    formData.append('course_id', data.course_id);
    let config = {
        method: 'post',
        url: `${BASE_API_URL}${ENROLL_USER}`,
        headers: {
            Authorization: `Bearer ${loginData?.token}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    };
    showLog('Config Enroll user', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchEnrollUserHandler(action) {
    try {
        const response = yield call(fetchEnrollUser, action.payload);
        yield put({
            type: SUCCESS_FETCH_ENROLL_USER,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_ENROLL_USER,
            payload: errorPayload,
        });
    }
}

//For updating user progress of watching lesssons
async function updateUserProgress(data) {
    const loginData = localStorageHelper.get(Constants.loginData)
    // Create FormData
    const formData = new FormData();
    formData.append('lesson_id', data.lesson_id);
    formData.append('completed', data.completed);
    formData.append('last_position', data.last_position);
    let config = {
        method: 'post',
        url: `${BASE_API_URL}${UPDATE_USER_PROGRESS}`,
        headers: {
            Authorization: `Bearer ${loginData?.token}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    };
    showLog('update progress form data', data);
    showLog('Config update user progress', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* updateUserProgressHandler(action) {
    try {
        const response = yield call(updateUserProgress, action.payload);
        yield put({
            type: SUCCESS_FETCH_USER_PROGRESS,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_USER_PROGRESS,
            payload: errorPayload,
        });
    }
}

//For Payments
async function fetchCreatePayment(data) {
    const loginData = localStorageHelper.get(Constants.loginData)
    // Create FormData
    const formData = new FormData();
    formData.append('course_id', data.course_id);
    let config = {
        method: 'post',
        url: `${BASE_API_URL}${CREATE_COURSE_PAYMENT}`,
        headers: {
            Authorization: `Bearer ${loginData?.token}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    };
    showLog('Config Create Payment', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchCreatePaymentHandler(action) {
    try {
        const response = yield call(fetchCreatePayment, action.payload);
        yield put({
            type: SUCCESS_FETCH_CREATE_PAYMENT,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_CREATE_PAYMENT,
            payload: errorPayload,
        });
    }
}