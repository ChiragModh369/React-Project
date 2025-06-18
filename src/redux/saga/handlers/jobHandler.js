import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { BASE_API_URL, READ_JOBS } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';
import { FAIL_FETCH_READ_JOBS, SUCCESS_FETCH_READ_JOBS } from '../../actions/types/reduxConst';

//For Read all jobs
async function fetchReadJobs(data) {
    let queryParams = new URLSearchParams(data).toString();
    let config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_JOBS}?${queryParams}`,
    };
    showLog('Config Read jOBS', config);
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config)
    }
}

export function* fetchReadJobsHandler(action) {
    try {
        const response = yield call(fetchReadJobs, action.payload);
        yield put({
            type: SUCCESS_FETCH_READ_JOBS,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_READ_JOBS,
            payload: errorPayload,
        });
    }
}