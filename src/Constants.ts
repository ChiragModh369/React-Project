export const Constants = {
    isLogin: 'isLogin',
    loginData: 'loginData',
    //API Status code and their description
    successCode200: 200, //success code
    failureCode400: 400, // show toast - validation error
    unauthenticate401: 401, //token expire - forcefully clear aysnc values and logout locally and redirect to Home screen 
    serverErrorCode500: 500, //Logout user
    notFoundErrorCode404: 404,//Not found - rediect to Not Found Page

    //courses filter
    allCourseFilter: 'all',
    freeCourseFilter: 'free',
    premiumCourseFilter: 'premium',

    //course level 
    advanced: 'Advanced',
    intermediate: 'Intermediate',
    beginner: 'Beginner',

    //payment return messages
    success: 'success',
    cancel: 'cancel',

    //payment query params
    session_id: 'session_id',
    payment: 'payment',
}