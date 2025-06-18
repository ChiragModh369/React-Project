import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { Constants } from '@/Constants';
import { BASE_API_URL, READ_SKILLS, STORE_SKILLS, DELETE_SKILLS, READ_SKILL_CATEGORIES, READ_PROFICIENCY_LEVELS } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { localStorageHelper } from '@/commonFunctions/localStorageHelper';
import {
  SUCCESS_FETCH_READ_SKILLS,
  FAIL_FETCH_READ_SKILLS,
  SUCCESS_STORE_SKILLS,
  FAIL_STORE_SKILLS,
  SUCCESS_DELETE_SKILLS,
  FAIL_DELETE_SKILLS,
  SUCCESS_FETCH_READ_SKILL_CATEGORIES,
  FAIL_FETCH_READ_SKILL_CATEGORIES,
  SUCCESS_FETCH_READ_PROFICIENCY_LEVELS,
  FAIL_FETCH_READ_PROFICIENCY_LEVELS,
  INITIATE_FETCH_READ_SKILLS,
} from '../../actions/types/reduxConst';

async function fetchSkills() {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'get',
    url: `${BASE_API_URL}${READ_SKILLS}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Read Skills', config);
  try {
    const response = await axios.request(config);
    showLog('Read Skills Response', response.data);
    return response;
  } catch (error) {
    showLog('Read Skills Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function storeSkills(payload) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const formData = new FormData();
  formData.append('skill_name', payload.skill_name);
  formData.append('skill_category_id', payload.skill_category_id);
  formData.append('proficiency_level', payload.proficiency_level);

  const config = {
    method: 'post',
    url: `${BASE_API_URL}${STORE_SKILLS}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  };
  showLog('Config Store Skills', config);
  try {
    const response = await axios.request(config);
    showLog('Store Skills Response', response.data);
    return response;
  } catch (error) {
    showLog('Store Skills Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function deleteSkills(skillId) {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'post',
    url: `${BASE_API_URL}${DELETE_SKILLS}${skillId}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Delete Skills', config);
  try {
    const response = await axios.request(config);
    showLog('Delete Skills Response', response.data);
    return response;
  } catch (error) {
    showLog('Delete Skills Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function fetchSkillCategories() {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'get',
    url: `${BASE_API_URL}${READ_SKILL_CATEGORIES}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Read Skill Categories', config);
  try {
    const response = await axios.request(config);
    showLog('Read Skill Categories Response', response.data);
    return response;
  } catch (error) {
    showLog('Read Skill Categories Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

async function fetchProficiencyLevels() {
  const loginData = localStorageHelper.get(Constants.loginData);
  const config = {
    method: 'get',
    url: `${BASE_API_URL}${READ_PROFICIENCY_LEVELS}`,
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  showLog('Config Read Proficiency Levels', config);
  try {
    const response = await axios.request(config);
    showLog('Read Proficiency Levels Response', response.data);
    return response;
  } catch (error) {
    showLog('Read Proficiency Levels Error', error);
    handleAxiosError(error, config);
    throw error;
  }
}

export function* fetchSkillHandler(action) {
  try {
    const response = yield call(fetchSkills, action.payload);
    yield put({
      type: SUCCESS_FETCH_READ_SKILLS,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Skill Fetch Error Payload', errorPayload);
    yield put({
      type: FAIL_FETCH_READ_SKILLS,
      payload: errorPayload,
    });
  }
}

export function* storeSkillHandler(action) {
  try {
    const response = yield call(storeSkills, action.payload);
    yield put({
      type: SUCCESS_STORE_SKILLS,
      payload: response.data,
    });
    yield put({ type: INITIATE_FETCH_READ_SKILLS, payload: {} });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Skill Store Error Payload', errorPayload);
    yield put({
      type: FAIL_STORE_SKILLS,
      payload: errorPayload,
    });
  }
}

export function* deleteSkillHandler(action) {
  try {
    const response = yield call(deleteSkills, action.payload);
    yield put({
      type: SUCCESS_DELETE_SKILLS,
      payload: response.data,
    });
    yield put({ type: INITIATE_FETCH_READ_SKILLS, payload: {} });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Skill Delete Error Payload', errorPayload);
    yield put({
      type: FAIL_DELETE_SKILLS,
      payload: errorPayload,
    });
  }
}

export function* fetchSkillCategoryHandler(action) {
  try {
    const response = yield call(fetchSkillCategories, action.payload);
    yield put({
      type: SUCCESS_FETCH_READ_SKILL_CATEGORIES,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Skill Category Fetch Error Payload', errorPayload);
    yield put({
      type: FAIL_FETCH_READ_SKILL_CATEGORIES,
      payload: errorPayload,
    });
  }
}

export function* fetchProficiencyLevelHandler(action) {
  try {
    const response = yield call(fetchProficiencyLevels, action.payload);
    yield put({
      type: SUCCESS_FETCH_READ_PROFICIENCY_LEVELS,
      payload: response.data,
    });
  } catch (e) {
    const errorPayload = {
      message: e.message,
      response: e.response ? e.response.data : null,
      status: e.response ? e.response.status : null,
    };
    showLog('Proficiency Level Fetch Error Payload', errorPayload);
    yield put({
      type: FAIL_FETCH_READ_PROFICIENCY_LEVELS,
      payload: errorPayload,
    });
  }
}