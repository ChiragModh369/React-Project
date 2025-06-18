import { CLEAR_LESSONS, FAIL_FETCH_LESSONS, INITIATE_FETCH_LESSONS, SUCCESS_FETCH_LESSONS } from "../../actions/types/reduxConst";

const initialState = {
  status: false,
  isLessonsLoading: false,
  lessonStatusCode: null,
  lessonMessage: null,
  lessonMainData: {},
  error: null, // Add error property to initial state
};

export default function readLessonReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_LESSONS:
      return {
        ...state,
        isLessonsLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_LESSONS:
      return {
        ...state,
        isLessonsLoading: false,
        lessonMainData: action.payload.data,
        lessonStatusCode: action.payload.statusCode,
        lessonMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_LESSONS:

      return {
        ...state,
        isLessonsLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_LESSONS:
      return {
        ...initialState,
        isLessonsLoading: false,
      };

    default:
      return state;
  }
}
