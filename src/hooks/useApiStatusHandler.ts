import { useEffect } from 'react';

import { showLog } from '../commonFunctions/Functions';
import { Constants } from '@/Constants';


const useApiStatusHandler = ({
    statusCode,
    message,
    mainData,
    onSuccess,
    clearAPI,
    toast,
    navigate
}) => {
    useEffect(() => {
        if (statusCode === Constants.serverErrorCode500) {
            showLog("status 500", message)
            // Optional: Show error toast or log
            toast({
                title: "Try Again",
                description: "Something went wrong on the server",
                variant: "destructive",
            });
        } else if (statusCode === Constants.failureCode400) {
            clearAPI?.();
            showLog("status 400", message)
            toast({
                title: message,
                variant: "destructive",
            });
        } else if (statusCode === Constants.unauthenticate401) {
            // toasterMessage('error', message);
            //  manageAfterLogout()
            showLog("status 401", message)
        }
        else if (statusCode === Constants.notFoundErrorCode404) {
            // toasterMessage('error', message);
            //redirect to not found page
            showLog("status 404", message)
            navigate('/')
        }
        else if (statusCode === Constants.successCode200) {
            showLog('API success', message);
            onSuccess?.(mainData);
        }
    }, [statusCode, mainData]);
};

export default useApiStatusHandler;
