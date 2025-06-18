

import { showLog, showToast } from "./Functions";
import { toast } from 'react-toastify';
import { navigate } from "./navigationService";

export function handleAxiosError(error, config) {
    if (error.response) {
        showLog("handleAxiosError URL", config.url)
        const { status, data } = error.response;

        // Log or handle specific status codes
        switch (status) {
            case 401:
                toast.error(data.message);
                showLog('Unauthorized, invalid credentials', data);
                break;
            case 400:
                toast.error(data.message);
                showLog('validation error', data);
                break;
            case 405:
                toast.error(data.message);
                showLog('Wrong method, POST/GET');
                break;
            case 404:
                navigate('*')
                showLog('Not found - redirect to Not Found Screen', data);
                break;
            case 403:
                toast.error(data.message);
                showLog('Forbidden - access denied');
                break;
            case 500:
                toast.error(data.message);
                showLog('Server error');
                break;
            default:
                showLog(`Unhandled error: ${status}`, data);
        }
    } else if (error.request) {
        showLog('No response received from server');
    } else {
        showLog('Error in setting up the request:', error.message);
    }

    // Optionally re-throw to handle it further in specific functions
    throw error;
}
