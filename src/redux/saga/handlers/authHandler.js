import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { Constants } from '@/Constants';
import { ADMIN_LOGIN, BASE_API_URL, LOGOUT, REGISTER, READ_PROFILE, UPDATE_PROFILE } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { localStorageHelper } from "@/commonFunctions/localStorageHelper";
import {
  FAIL_FETCH_ADMIN_LOGIN,
  FAIL_FETCH_LOGOUT,
  FAIL_FETCH_READ_PROFILE,
  FAIL_FETCH_REGISTER_USER,
  FAIL_UPDATE_PROFILE,
  SUCCESS_FETCH_ADMIN_LOGIN,
  SUCCESS_FETCH_LOGIN_DATA,
  SUCCESS_FETCH_LOGOUT,
  SUCCESS_FETCH_READ_PROFILE,
  SUCCESS_FETCH_REGISTER_USER,
  SUCCESS_UPDATE_PROFILE,
} from '../../actions/types/reduxConst';

// For Admin Login
async function fetchAdminLogin(data) {
  showLog("fetchAdminLogin", data);
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);
  const config = {
    method: 'post',
    url: `${BASE_API_URL}${ADMIN_LOGIN}`,
    data: formData,
  };
  showLog('Config Admin Login', config);
  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    handleAxiosError(error, config);
  }
}

export function* fetchAdminLoginHandler(action) {
  try {
    const response = yield call(fetchAdminLogin, action.payload);
    yield put({
      type: SUCCESS_FETCH_ADMIN_LOGIN,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    yield put({
      type: FAIL_FETCH_ADMIN_LOGIN,
      payload: errorPayload,
    });
  }
}

// For Register User
async function fetchRegisterUser(data) {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('name', data.name);
  formData.append('password', data.password);
  formData.append('password_confirmation', data.password_confirmation);
  let config = {
    method: 'post',
    url: `${BASE_API_URL}${REGISTER}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
  };
  showLog('Config Register User', config);
  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    handleAxiosError(error, config);
  }
}

export function* fetchRegisterUserHandler(action) {
  try {
    const response = yield call(fetchRegisterUser, action.payload);
    yield put({
      type: SUCCESS_FETCH_REGISTER_USER,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    yield put({
      type: FAIL_FETCH_REGISTER_USER,
      payload: errorPayload,
    });
  }
}

// For Logout User
async function fetchLogout(data) {
  const loginData = localStorageHelper.get(Constants.loginData);
  let config = {
    method: 'post',
    url: `${BASE_API_URL}${LOGOUT}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    }
  };
  showLog('Config LOGOUT', config);
  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    handleAxiosError(error, config);
  }
}

export function* fetchLogoutDataHandler(action) {
  showLog('fetchLogoutDataHandler', action);
  try {
    const response = yield call(fetchLogout, action.payload);
    yield put({
      type: SUCCESS_FETCH_LOGOUT,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    yield put({
      type: FAIL_FETCH_LOGOUT,
      payload: errorPayload,
    });
    showLog('Error in fetchLogoutDataHandler:', JSON.stringify(errorPayload));
  }
}

export function* fetchLoginData() {
  try {
    const data = yield call(localStorageHelper.get, Constants.loginData);
    if (data) {
      showLog("fetchLoginData payload", data);
      yield put({ type: SUCCESS_FETCH_LOGIN_DATA, payload: data });
    }
  } catch (error) {
    console.log('Login Saga Error:', error);
  }
}

// For getting profile details
async function fetchProfileDetails(data) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'get',
    url: `${BASE_API_URL}${READ_PROFILE}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    }
  };
  showLog('Config Read Profile', config);
  try {
    const response = await axios.request(config);
    showLog('Read Profile Response', response.data);
    return response;
  } catch (error) {
    showLog('Read Profile Error', error);
    handleAxiosError(error, config);
  }
}

export function* fetchProfileDetailHandler(action) {
  try {
    const response = yield call(fetchProfileDetails, action.payload);
    yield put({
      type: SUCCESS_FETCH_READ_PROFILE,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Profile Fetch Error Payload', errorPayload);
    yield put({
      type: FAIL_FETCH_READ_PROFILE,
      payload: errorPayload,
    });
  }
}

// For updating profile details
async function updateProfileDetails(data) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const formData = new FormData();
  formData.append('full_name', data.full_name);
  formData.append('professional_title', data.professional_title);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('location', data.location);
  formData.append('professional_summary', data.professional_summary);
  formData.append('linkedIn', data.linkedIn);
  formData.append('github', data.github);
  formData.append('personal_website', data.personal_website);

  const config = {
    method: 'post',
    url: `${BASE_API_URL}${UPDATE_PROFILE}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };

  showLog('Config Update Profile', {
    url: config.url,
    headers: config.headers,
    data: Object.fromEntries(formData),
  });

  try {
    const response = await axios.request(config);
    showLog('Update Profile Response', response.data);
    return response;
  } catch (error) {
    showLog('Update Profile Error', {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    handleAxiosError(error, config);
    throw error; // Re-throw to trigger FAIL_UPDATE_PROFILE
  }
}

export function* updateProfileDetailHandler(action) {
  try {
    const response = yield call(updateProfileDetails, action.payload);
    yield put({
      type: SUCCESS_UPDATE_PROFILE,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Update Profile Handler Error', errorPayload);
    yield put({
      type: FAIL_UPDATE_PROFILE,
      payload: errorPayload,
    });
  }
}