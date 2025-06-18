// navigationService.js
let navigateFunction;

export const setNavigate = (navigateFn) => {
  navigateFunction = navigateFn;
};

export const navigate = (path) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.error("Navigate function not set");
  }
};
