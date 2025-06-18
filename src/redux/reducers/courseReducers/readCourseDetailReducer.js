import { CLEAR_READ_COURSE_DETAIL, FAIL_FETCH_READ_COURSE_DETAIL, INITIATE_FETCH_READ_COURSE_DETAIL, SUCCESS_FETCH_READ_COURSE_DETAIL } from '../../actions/types/reduxConst';

const initialState = {
  status: false,
  isCoursesLoading: false,
  courseStatusCode: null,
  courseMessage: null,
  courseMainData: {},
  error: null, // Add error property to initial state
};

export default function readCourseDetailReducer(state = initialState, action) {
  switch (action.type) {
    case INITIATE_FETCH_READ_COURSE_DETAIL:
      return {
        ...state,
        isCoursesLoading: true,
        error: null, // Reset error on new fetch
      };
    case SUCCESS_FETCH_READ_COURSE_DETAIL:
      return {
        ...state,
        isCoursesLoading: false,
        courseMainData: action.payload.data,
        courseStatusCode: action.payload.statusCode,
        courseMessage: action.payload.message,
        status: action.payload.status,
        error: null, // Clear error on success
      };
    case FAIL_FETCH_READ_COURSE_DETAIL:

      return {
        ...state,
        isCoursesLoading: false,
        error: action.payload?.error || 'Unknown error', // Ensure error is set
      };

    case CLEAR_READ_COURSE_DETAIL:
      return {
        ...initialState,
        isCoursesLoading: false,
      };

    default:
      return state;
  }
}
