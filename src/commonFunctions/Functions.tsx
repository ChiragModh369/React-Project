import { Constants } from "@/Constants";
import { localStorageHelper } from "./localStorageHelper";
import { toast } from 'react-toastify';
export const showToast = (msg: any, type = 'error') => toast[type](msg);
export const showLog = (logPromptText: any, logText?: any): void => {
  if (logText !== undefined) {
    console.log(
      JSON.stringify(logPromptText) + ' : --- ',
      JSON.stringify(logText)
    );
  } else {
    console.log(JSON.stringify(logPromptText));
  }
};

export const isUserLoggedIn = () => {
  return localStorageHelper.get(Constants.isLogin) === true;
};

export const isUserEnrolled = (userId: number, enrolledUsers: Array<number>) => {
  showLog("isUserEnrolled", enrolledUsers)
  if (!Array.isArray(enrolledUsers)) return false;
  if (enrolledUsers.includes(userId)) {
   // showLog("flag5")
    return true
  } else {
  //  showLog("flag6")
    return false
  }

}

export const isCourseFree = (price: string) => {
  if (price == 'Free' || price == '0') {
    return true//enroll and start learning
  } else {
    return false
  }
}
export const isCourseAvailable = (price: string, userId?: number, enrolledUsers?: Array<number>) => {

  if (isCourseFree(price)) {
    return true//view course
  } else {

    if (isUserLoggedIn()) {
     // showLog("flag1")
      if (isUserEnrolled(userId, enrolledUsers)) {
       // showLog("flag2")
        return true//user purchased this course,thus view course
      } else {
      //  showLog("flag3")
        return false//course is not free, thus show purchase button
      }
    } else {
     // showLog("flag4")
      return false;
    }

  }
}

const pad = (n) => n.toString().padStart(2, '0');

export const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() is 0-based
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};