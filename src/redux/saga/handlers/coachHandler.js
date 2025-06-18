
import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { Constants } from '@/Constants';
import { BASE_API_URL, READ_COACHES, READ_TIMESLOTS, BOOK_COACH_SESSION, BOOK_COACH_SESSION_PAYMENT } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { FAIL_FETCH_BOOK_COACH, FAIL_FETCH_COACH_PAYMENT, FAIL_FETCH_READ_COACHES, FAIL_FETCH_READ_TIMESLOTS, SUCCESS_FETCH_BOOK_COACH, SUCCESS_FETCH_COACH_PAYMENT, SUCCESS_FETCH_READ_COACHES, SUCCESS_FETCH_READ_TIMESLOTS } from '../../actions/types/reduxConst';
import { localStorageHelper } from "@/commonFunctions/localStorageHelper";
//For Read all coaches
async function fetchReadCoaches(data) {

    let config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_COACHES}`,

    };
    showLog('Config Read Coaches', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchReadCoachesHandler(action) {
    try {
        const response = yield call(fetchReadCoaches, action.payload);
        yield put({
            type: SUCCESS_FETCH_READ_COACHES,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_READ_COACHES,
            payload: errorPayload,
        });
    }
}

//For Read time slots
async function fetchReadTimeSlots(data) {

    let config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_TIMESLOTS}${data.id}`,

    };
    showLog('Config Read time slots', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchReadTimeSlotsHandler(action) {
    try {
        const response = yield call(fetchReadTimeSlots, action.payload);
        yield put({
            type: SUCCESS_FETCH_READ_TIMESLOTS,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_READ_TIMESLOTS,
            payload: errorPayload,
        });
    }
}

//For booking a session of coach
async function fetchBookSession(data) {
    showLog('Data for book session', data);
    const loginData = localStorageHelper.get(Constants.loginData)
    // Create FormData
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('name', data.name);
    formData.append('time_slots_id', data.time_slots_id);
    formData.append('session_date', data.session_date);
    formData.append('coach_id', data.coach_id);
    if (loginData?.id) {
        formData.append('user_id', loginData?.id);
    } else {

    }

    if(data.cv_url){
        formData.append('cv_url', data.cv_url);
    }
    if(data.jd_url){
        formData.append('jd_url', data.jd_url);
    }

    formData.append('additional_notes', data.additional_notes);

    // Append files
    // Append files — make sure these are File objects
    if (data.curriculum_vitae instanceof File) {
        formData.append('curriculum_vitae', data.curriculum_vitae);
    } else {
        // formData.append('curriculum_vitae', null);
    }

    if (data.job_description instanceof File) {
        formData.append('job_description', data.job_description);
    } else {
        // formData.append('job_description', null);
    }
    let config = {
        method: 'post',
        url: `${BASE_API_URL}${BOOK_COACH_SESSION}`,
        headers: {
            //  Authorization: `Bearer ${loginData?.token}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    };
    showLog('Config book session', config);
    showLog('Config login id', loginData?.id);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchBookSessionHandler(action) {
    try {
        const response = yield call(fetchBookSession, action.payload);
        yield put({
            type: SUCCESS_FETCH_BOOK_COACH,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_BOOK_COACH,
            payload: errorPayload,
        });
    }
}

// For initiating coach payment
async function fetchCoachPayment(data) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const formData = new FormData();
  formData.append('coach_id', data.coach_id);
  formData.append('session_date', data.session_date);
  formData.append('time_slots_id', data.time_slots_id);
  formData.append('name', data.name);
  formData.append('email', data.email);

  let config = {
    method: 'post',
    url: `${BASE_API_URL}${BOOK_COACH_SESSION_PAYMENT}`,
    headers: {
      Authorization: `Bearer ${loginData?.token}`,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };
  showLog('Config coach payment', config);
  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    handleAxiosError(error, config);
  }
}

export function* fetchCoachPaymentHandler(action) {
  try {
    const response = yield call(fetchCoachPayment, action.payload);
    yield put({
      type: SUCCESS_FETCH_COACH_PAYMENT,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    yield put({
      type: FAIL_FETCH_COACH_PAYMENT,
      payload: errorPayload,
    });
  }
}