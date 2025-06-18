import { fetchAdminLoginHandler, fetchLoginData, fetchLogoutDataHandler, fetchProfileDetailHandler, fetchRegisterUserHandler, updateProfileDetailHandler } from '../handlers/authHandler';
import { fetchBookSessionHandler, fetchReadTimeSlotsHandler, fetchReadCoachesHandler, fetchCoachPaymentHandler } from '../handlers/coachHandler';
import { fetchReadJobsHandler } from '../handlers/jobHandler';
import { fetchCreatePaymentHandler, fetchEnrollUserHandler, fetchReadCourseDetailHandler, fetchReadCoursesHandler, fetchReadLesssonsHandler, updateUserProgressHandler } from '../handlers/courseHandler';
import { deleteExperienceHandler, fetchExperienceHandler, updateExperienceHandler } from '../handlers/experienceHandler';
import {
  INITIATE_FETCH_ADMIN_LOGIN,
  INITIATE_FETCH_BOOK_COACH,
  INITIATE_FETCH_COACH_PAYMENT,
  INITIATE_FETCH_CREATE_PAYMENT,
  INITIATE_FETCH_ENROLL_USER,
  INITIATE_FETCH_LESSONS,
  INITIATE_FETCH_LOGIN_DATA,
  INITIATE_FETCH_LOGOUT,
  INITIATE_FETCH_READ_COACHES,
  INITIATE_FETCH_READ_COURSE_DETAIL,
  INITIATE_FETCH_READ_COURSES,
  INITIATE_FETCH_READ_JOBS,
  INITIATE_FETCH_READ_PROFILE,
  INITIATE_FETCH_READ_TEMPLATES,
  INITIATE_FETCH_READ_TIMESLOTS,
  INITIATE_FETCH_REGISTER_USER,
  INITIATE_FETCH_USER_PROGRESS,
  INITIATE_UPDATE_PROFILE,
  INITIATE_FETCH_READ_EXPERIENCES,
  INITIATE_UPDATE_EXPERIENCES,
  INITIATE_DELETE_EXPERIENCES,
  INITIATE_FETCH_READ_EDUCATIONS,
  INITIATE_UPDATE_EDUCATIONS,
  INITIATE_DELETE_EDUCATIONS,
  INITIATE_FETCH_READ_SKILLS,
  INITIATE_STORE_SKILLS,
  INITIATE_DELETE_SKILLS,
  INITIATE_FETCH_READ_SKILL_CATEGORIES,
  INITIATE_FETCH_READ_PROFICIENCY_LEVELS,
} from '../../actions/types/reduxConst';

import { takeLatest } from 'redux-saga/effects';
import { fetchTemplateHandler } from '../handlers/cvHandler';
import { deleteEducationHandler, fetchEducationHandler, updateEducationHandler } from '../handlers/educationHandler';
import { deleteSkillHandler, fetchProficiencyLevelHandler, fetchSkillCategoryHandler, fetchSkillHandler, storeSkillHandler } from '../handlers/skillHandler';

export function* fetchAdminLoginWatcher() {
  yield takeLatest(INITIATE_FETCH_ADMIN_LOGIN, fetchAdminLoginHandler);
}
export function* fetchRegisterUserWatcher() {
  yield takeLatest(INITIATE_FETCH_REGISTER_USER, fetchRegisterUserHandler);
}
export function* fetchLoginDataWatcher() {
  yield takeLatest(INITIATE_FETCH_LOGIN_DATA, fetchLoginData);
}
export function* fetchLogoutWatcher() {
  yield takeLatest(INITIATE_FETCH_LOGOUT, fetchLogoutDataHandler);
}
export function* fetchReadCourseWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_COURSES, fetchReadCoursesHandler);
}
export function* fetchReadCourseDetailWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_COURSE_DETAIL, fetchReadCourseDetailHandler);
}
export function* fetchReadLessonWatcher() {
  yield takeLatest(INITIATE_FETCH_LESSONS, fetchReadLesssonsHandler);
}
export function* fetchEnrollUserWatcher() {
  yield takeLatest(INITIATE_FETCH_ENROLL_USER, fetchEnrollUserHandler);
}
export function* fetchUserProgressWatcher() {
  yield takeLatest(INITIATE_FETCH_USER_PROGRESS, updateUserProgressHandler);
}
export function* fetchCreatePaymentWatcher() {
  yield takeLatest(INITIATE_FETCH_CREATE_PAYMENT, fetchCreatePaymentHandler);
}
export function* fetchReadCoachWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_COACHES, fetchReadCoachesHandler);
}
export function* fetchReadTimeSlotWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_TIMESLOTS, fetchReadTimeSlotsHandler);
}
export function* fetchBookSessionWatcher() {
  yield takeLatest(INITIATE_FETCH_BOOK_COACH, fetchBookSessionHandler);
}
export function* fetchReadJobsWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_JOBS, fetchReadJobsHandler);
}
export function* fetchReadTemplateWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_TEMPLATES, fetchTemplateHandler);
}
export function* fetchReadProfileWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_PROFILE, fetchProfileDetailHandler);
}
export function* fetchUpdateProfileWatcher() {
  yield takeLatest(INITIATE_UPDATE_PROFILE, updateProfileDetailHandler);
}
export function* fetchCoachPaymentWatcher() {
  yield takeLatest(INITIATE_FETCH_COACH_PAYMENT, fetchCoachPaymentHandler);
}
export function* fetchReadExperienceWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_EXPERIENCES, fetchExperienceHandler);
}
export function* fetchUpdateExperienceWatcher() {
  yield takeLatest(INITIATE_UPDATE_EXPERIENCES, updateExperienceHandler);
}
export function* fetchDeleteExperienceWatcher() {
  yield takeLatest(INITIATE_DELETE_EXPERIENCES, deleteExperienceHandler);
}
export function* fetchReadEducationWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_EDUCATIONS, fetchEducationHandler);
}
export function* fetchUpdateEducationWatcher() {
  yield takeLatest(INITIATE_UPDATE_EDUCATIONS, updateEducationHandler);
}
export function* fetchDeleteEducationWatcher() {
  yield takeLatest(INITIATE_DELETE_EDUCATIONS, deleteEducationHandler);
}
export function* fetchReadSkillWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_SKILLS, fetchSkillHandler);
}
export function* fetchStoreSkillWatcher() {
  yield takeLatest(INITIATE_STORE_SKILLS, storeSkillHandler);
}
export function* fetchDeleteSkillWatcher() {
  yield takeLatest(INITIATE_DELETE_SKILLS, deleteSkillHandler);
}
export function* fetchReadSkillCategoryWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_SKILL_CATEGORIES, fetchSkillCategoryHandler);
}

export function* fetchReadProficiencyLevelWatcher() {
  yield takeLatest(INITIATE_FETCH_READ_PROFICIENCY_LEVELS, fetchProficiencyLevelHandler);
}