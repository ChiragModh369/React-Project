import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { Constants } from '@/Constants';
import { BASE_API_URL, READ_EXPERIENCES, UPDATE_EXPERIENCES, DELETE_EXPERIENCES } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { localStorageHelper } from '@/commonFunctions/localStorageHelper';
import {
  FAIL_FETCH_READ_EXPERIENCES,
  SUCCESS_FETCH_READ_EXPERIENCES,
  FAIL_UPDATE_EXPERIENCES,
  SUCCESS_UPDATE_EXPERIENCES,
  SUCCESS_DELETE_EXPERIENCES,
  INITIATE_FETCH_READ_EXPERIENCES,
  FAIL_DELETE_EXPERIENCES,
} from '../../actions/types/reduxConst';

async function fetchExperiences() {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'get',
    url: `${BASE_API_URL}${READ_EXPERIENCES}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Read Experiences', config);
  try {
    const response = await axios.request(config);
    showLog('Read Experiences Response', response.data);
    return response;
  } catch (error) {
    showLog('Read Experiences Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function updateExperiences(payload) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'post',
    url: `${BASE_API_URL}${UPDATE_EXPERIENCES}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'application/json',
    },
    data: { experiences: payload },
  };
  showLog('Config Update Experiences', config);
  try {
    const response = await axios.request(config);
    showLog('Update Experiences Response', response.data);
    return response;
  } catch (error) {
    showLog('Update Experiences Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function deleteExperiences(experienceIds) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'post',
    url: `${BASE_API_URL}${DELETE_EXPERIENCES}${experienceIds.join(',')}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'application/json',
    },
    data: { experiences: [] }, // Empty array as per cURL, adjust if API requires specific data
  };
  showLog('Config Delete Experiences', config);
  try {
    const response = await axios.request(config);
    showLog('Delete Experiences Response', response.data);
    return response;
  } catch (error) {
    showLog('Delete Experiences Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

export function* fetchExperienceHandler(action) {
  try {
    const response = yield call(fetchExperiences, action.payload);
    yield put({
      type: SUCCESS_FETCH_READ_EXPERIENCES,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Experience Fetch Error Payload', errorPayload);
    yield put({
      type: FAIL_FETCH_READ_EXPERIENCES,
      payload: errorPayload,
    });
  }
}

export function* updateExperienceHandler(action) {
  try {
    const response = yield call(updateExperiences, action.payload);
    yield put({
      type: SUCCESS_UPDATE_EXPERIENCES,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Experience Update Error Payload', errorPayload);
    yield put({
      type: FAIL_UPDATE_EXPERIENCES,
      payload: errorPayload,
    });
  }
}
export function* deleteExperienceHandler(action) {
  try {
    const response = yield call(deleteExperiences, action.payload);
    yield put({
      type: SUCCESS_DELETE_EXPERIENCES,
      payload: response.data,
    });
    // Optionally, refetch experiences after deletion
    yield put({ type: INITIATE_FETCH_READ_EXPERIENCES, payload: {} });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Experience Delete Error Payload', errorPayload);
    yield put({
      type: FAIL_DELETE_EXPERIENCES,
      payload: errorPayload,
    });
  }
}