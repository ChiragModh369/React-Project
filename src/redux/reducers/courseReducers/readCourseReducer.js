import { CLEAR_READ_COURSES, FAIL_FETCH_READ_COURSES, INITIATE_FETCH_READ_COURSES, SUCCESS_FETCH_READ_COURSES } from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isCoursesLoading: false,
  courseStatusCode: null,
  courseMessage: null,
  courseMainData: {},
  error: null, // Add error property to initial state
};

export default function readCourseReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_COURSES:
      return {
        ...state,
        isCoursesLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_COURSES:
      return {
        ...state,
        isCoursesLoading: false,
        courseMainData: action.payload.data,
        courseStatusCode: action.payload.statusCode,
        courseMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_COURSES:

      return {
        ...state,
        isCoursesLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_COURSES:
      return {
        ...initialState,
        isCoursesLoading: false,
      };

    default:
      return state;
  }
}
