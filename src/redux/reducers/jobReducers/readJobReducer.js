import { CLEAR_READ_JOBS, FAIL_FETCH_READ_JOBS, INITIATE_FETCH_READ_JOBS, SUCCESS_FETCH_READ_JOBS } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isJobsLoading: false,
  jobStatusCode: null,
  jobMessage: null,
  jobMainData:[],
  error: null, // Add error property to initial state
};

export default function readJobReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_JOBS:
      return {
        ...state,
        isJobsLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_JOBS:
      return {
        ...state,
        isJobsLoading: false,
        jobMainData: action.payload.data,
        jobStatusCode: action.payload.statusCode,
        jobMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_JOBS:

      return {
        ...state,
        isJobsLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_JOBS:
      return {
        ...initialState,
        isJobsLoading: false,
      };

    default:
      return state;
  }
}
