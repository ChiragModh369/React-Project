const DEV_SERVER_URL = `https://cyberforge-backend.yiion.com/api/`;
const LIVE_SERVER_URL = ``;

const STRIPE_TEST_KEY = 'pk_test_E1xQvNOwdiq5snNH8in6ksHr00qYIjyIDu';
const STRIPE_LIVE_KEY = '';

export const STRIPE_KEY = STRIPE_TEST_KEY;

export const BASE_API_URL = DEV_SERVER_URL;

/* Auth */
export const REGISTER = 'register';
export const ADMIN_LOGIN = 'login';
export const LOGOUT = 'logout';

/* Courses */
export const READ_COURSES = 'courses';
export const READ_COURSE_DETAIL = 'courses/view/';
export const CREATE_COURSE_PAYMENT = 'purchase-course';

export const READ_LESSONS = 'courses/lessons/';
export const ENROLL_USER = 'courses/enroll';
export const UPDATE_USER_PROGRESS = 'courses/user-progress';

/* Coaching */
export const READ_COACHES = 'coaches';
export const READ_TIMESLOTS = 'coaches/timeslots/';
export const BOOK_COACH_SESSION = 'coaches/booksession';
export const BOOK_COACH_SESSION_PAYMENT = 'payBookSessionAmount';

/* Jobs */
export const READ_JOBS = 'jobs';

/* CV Builder */
export const READ_TEMPLATES = 'templates';

/* Profile */
export const READ_PROFILE = 'personal-details';
export const UPDATE_PROFILE = 'personal-details/update';

/* Experiences */
export const READ_EXPERIENCES = 'experiences';
export const UPDATE_EXPERIENCES = 'experiences/update';
export const DELETE_EXPERIENCES = 'experiences/delete/';

/* Educations */
export const READ_EDUCATIONS = 'educations';
export const UPDATE_EDUCATIONS = 'educations/update';
export const DELETE_EDUCATIONS = 'educations/delete/';

/* Skills */
export const READ_SKILLS = 'skills';
export const STORE_SKILLS = 'skills/store';
export const DELETE_SKILLS = 'skills/delete/';
export const READ_SKILL_CATEGORIES = 'skills/categories';
export const READ_PROFICIENCY_LEVELS = 'skills/proficiency-levels';