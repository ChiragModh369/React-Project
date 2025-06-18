import { combineReducers } from 'redux';
import loginReducer from './authReducers/loginReducer.js';
import registerUserReducer from './authReducers/registerUserReducer.js';
import readCourseReducer from './courseReducers/readCourseReducer.js';
import logoutReducer from './authReducers/logoutReducer.js';
import readProfileReducer from './authReducers/readProfileReducer.js';
import readCourseDetailReducer from './courseReducers/readCourseDetailReducer.js';
import loginDataReducer from './authReducers/loginDataReducer.js';
import enrollUserReducer from './courseReducers/enrollUserReducer.js';
import readLessonReducer from './courseReducers/readLessonReducer.js';
import userProgressReducer from './courseReducers/userProgressReducer.js';
import createPaymentReducer from './courseReducers/createPaymentReducer.js';
import readJobReducer from './jobReducers/readJobReducer.js';
import bookCoachSessionReducer from './coachReducers/bookCoachSessionReducer.js';
import readCoachReducer from './coachReducers/readCoachReducer.js';
import readTimeSlotsReducer from './coachReducers/readTimeSlotsReducer.js';
import readTemplateReducer from './cvReducers/readTemplateReducer.js';
import coachPaymentReducer from './courseReducers/coachPaymentReducer.js';
import updateProfileReducer from './authReducers/updateProfileReducer.js';
import readExperienceReducer from './authReducers/readExperienceReducer.js';
import updateExperienceReducer from './authReducers/updateExperienceReducer.js';
import deleteExperienceReducer from './authReducers/deleteExperienceReducer.js';
import readEducationReducer from './authReducers/readEducationReducer.js';
import updateEducationReducer from './authReducers/updateEducationReducer.js';
import deleteEducationReducer from './authReducers/deleteEducationReducer.js';
import readSkillReducer from './authReducers/readSkillReducer.js';
import storeSkillReducer from './authReducers/storeSkillReducer.js';
import deleteSkillReducer from './authReducers/deleteSkillReducer.js';
import readSkillCategoryReducer from './authReducers/readSkillCategoryReducer.js';
import readProficiencyLevelReducer from './authReducers/readProficiencyLevelReducer.js';

const rootReducer = combineReducers({
  loginReducer,
  logoutReducer,
  loginDataReducer,
  registerUserReducer,
  readProfileReducer,
  readCourseReducer,
  readCourseDetailReducer,
  enrollUserReducer,
  readLessonReducer,
  userProgressReducer,
  createPaymentReducer,
  bookCoachSessionReducer,
  readCoachReducer,
  readJobReducer,
  readTimeSlotsReducer,
  readTemplateReducer,
  coachPaymentReducer,
  updateProfileReducer,
  readExperienceReducer,
  updateExperienceReducer,
  deleteExperienceReducer,
  readEducationReducer,
  updateEducationReducer,
  deleteEducationReducer,
  readSkillReducer,
  storeSkillReducer,
  deleteSkillReducer,
  readSkillCategoryReducer,
  readProficiencyLevelReducer,
});

export default rootReducer;