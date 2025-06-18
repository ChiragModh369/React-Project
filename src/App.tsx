import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { setNavigate } from './commonFunctions/navigationService';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import Jobs from "./pages/Jobs";
import CVBuilderPage from "./pages/CVBuilderPage";
import CourseView from "./pages/CourseView";
import Coaching from "./pages/Coaching";
import { fetchLoginDataAction } from "./redux/actions/mainAction";
import store from "@/redux/store/store.js";
import { localStorageHelper } from "./commonFunctions/localStorageHelper";
import { Constants } from "./Constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CourseLessons from "./pages/CourseLessons";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const queryClient = new QueryClient();

// ✅ Helper function to check login
const isUserLoggedIn = () => {
  return (
    localStorageHelper.get(Constants.isLogin) === true ||
    localStorageHelper.get(Constants.isLogin) === "true"
  );
};

// ✅ Wrapper for protected routes
const PrivateRoute = ({ element }) => {
  return isUserLoggedIn() ? element : <Navigate to="/" />;
};
const NavigationSetter = () => {
  const navigate = useNavigate();
  setNavigate(navigate);
  return null;
}
// ✅ Component using hooks
const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoginDataAction());
  }, [dispatch]);
 
  return (
    
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/coaching" element={<Coaching />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseView />} />
      <Route path="/courses/:id/lessons" element={<CourseLessons />} />
      <Route path="/cv-builder" element={<CVBuilderPage />} />
      {/* <Route path="/cv-builder" element={<PrivateRoute element={<CVBuilderPage />} />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ✅ App wrapper
const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ToastContainer />
        <Sonner />
        <BrowserRouter>
          <NavigationSetter/>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
