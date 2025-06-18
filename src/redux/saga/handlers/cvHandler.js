import { FAIL_FETCH_READ_TEMPLATES, SUCCESS_FETCH_READ_TEMPLATES } from "../../actions/types/reduxConst";
import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { showLog } from '@/commonFunctions/Functions';
import { Constants } from '@/Constants';
import { localStorageHelper } from "@/commonFunctions/localStorageHelper";
import { BASE_API_URL, READ_TEMPLATES } from '@/redux/config';
import { handleAxiosError } from '@/commonFunctions/axiosErrorHandler';

// For getting Templates
async function fetchTemplates(data) {

    const config = {
        method: 'get',
        url: `${BASE_API_URL}${READ_TEMPLATES}`,
    };

    showLog('Config templates', config);

    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        handleAxiosError(error, config);
    }
}


export function* fetchTemplateHandler(action) {
    try {
        const response = yield call(fetchTemplates, action.payload);
        yield put({
            type: SUCCESS_FETCH_READ_TEMPLATES,
            payload: response.data,
        });
    } catch (e) {
        const errorPayload = {
            message: e.message,
            response: e.response ? e.response.data : null,
            status: e.response ? e.response.status : null,
        };
        yield put({
            type: FAIL_FETCH_READ_TEMPLATES,
            payload: errorPayload,
        });
    }
}