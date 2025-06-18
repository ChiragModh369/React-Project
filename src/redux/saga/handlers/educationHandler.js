import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { Constants } from '@/Constants';
import { BASE_API_URL, READ_EDUCATIONS, UPDATE_EDUCATIONS, DELETE_EDUCATIONS } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { localStorageHelper } from '@/commonFunctions/localStorageHelper';
import {
  SUCCESS_FETCH_READ_EDUCATIONS,
  FAIL_FETCH_READ_EDUCATIONS,
  FAIL_UPDATE_EDUCATIONS,
  INITIATE_FETCH_READ_EDUCATIONS,
  SUCCESS_UPDATE_EDUCATIONS,
  FAIL_DELETE_EDUCATIONS,
  SUCCESS_DELETE_EDUCATIONS,
} from '../../actions/types/reduxConst';

async function fetchEducations() {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'get',
    url: `${BASE_API_URL}${READ_EDUCATIONS}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Read Educations', config);
  try {
    const response = await axios.request(config);
    showLog('Read Educations Response', response.data);
    return response;
  } catch (error) {
    showLog('Read Educations Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function updateEducations(payload) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'post',
    url: `${BASE_API_URL}${UPDATE_EDUCATIONS}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'application/json',
    },
    data: { educations: payload },
  };
  showLog('Config Update Educations', config);
  try {
    const response = await axios.request(config);
    showLog('Update Educations Response', response.data);
    return response;
  } catch (error) {
    showLog('Update Educations Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function deleteEducations(educationId) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'post',
    url: `${BASE_API_URL}${DELETE_EDUCATIONS}${educationId}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Delete Educations', config);
  try {
    const response = await axios.request(config);
    showLog('Delete Educations Response', response.data);
    return response;
  } catch (error) {
    showLog('Delete Educations Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

export function* fetchEducationHandler(action) {
  try {
    const response = yield call(fetchEducations, action.payload);
    yield put({
      type: SUCCESS_FETCH_READ_EDUCATIONS,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Education Fetch Error Payload', errorPayload);
    yield put({
      type: FAIL_FETCH_READ_EDUCATIONS,
      payload: errorPayload,
    });
  }
}

export function* updateEducationHandler(action) {
  try {
    const response = yield call(updateEducations, action.payload);
    yield put({
      type: SUCCESS_UPDATE_EDUCATIONS,
      payload: response.data,
    });
    // Refetch educations after update to reflect changes
    yield put({ type: INITIATE_FETCH_READ_EDUCATIONS, payload: {} });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Education Update Error Payload', errorPayload);
    yield put({
      type: FAIL_UPDATE_EDUCATIONS,
      payload: errorPayload,
    });
  }
}

export function* deleteEducationHandler(action) {
  try {
    const response = yield call(deleteEducations, action.payload);
    yield put({
      type: SUCCESS_DELETE_EDUCATIONS,
      payload: response.data,
    });
    // Refetch educations after deletion to reflect changes
    yield put({ type: INITIATE_FETCH_READ_EDUCATIONS, payload: {} });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Education Delete Error Payload', errorPayload);
    yield put({
      type: FAIL_DELETE_EDUCATIONS,
      payload: errorPayload,
    });
  }
}