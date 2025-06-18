
import { Link } from 'react-router-dom';
import { getAllCourses, getCurrentUser } from '@/services/courseService';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard, { CourseProps } from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Constants } from '@/Constants';
import LoginForm from '@/components/LoginForm';
import { isUserLoggedIn, showLog } from '@/commonFunctions/Functions';
import { fetchReadCourseAction } from '@/redux/actions/mainAction';
import { CLEAR_READ_COURSES } from '@/redux/actions/types/reduxConst';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { Loader } from '@/components/ui/loader';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PaymentForm from './PaymentForm';
const FeaturedCourses = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseProps[]>([]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState()
  const loginData = useSelector(data => data.loginDataReducer);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const handlePaymentDialog = () => {
    setIsPaymentDialogOpen(!isPaymentDialogOpen)
  }

  const handlePurchase = (course) => {
    if (!isUserLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase this course.",
        variant: "destructive"
      });
      return;
    }
    setSelectedCourse(course)
    handlePaymentDialog()

  };

  /* API for getting courses - Start */
  const clearAPI = () => {
    dispatch({ type: CLEAR_READ_COURSES });
  }
  useEffect(() => {
    showLog("loginData from featured courses", loginData)
    callCoursesAPI(Constants.allCourseFilter)
  }, [loginData])
  const callCoursesAPI = (value) => {
    const data = {
      search: value,
    };
    showLog("callCoursesAPI from Home", data)
    dispatch(fetchReadCourseAction(data));
  };

  const {
    isCoursesLoading,
    courseStatusCode,
    courseMessage,
    courseMainData,
  } = useSelector(data => data.readCourseReducer);

  useApiStatusHandler({
    statusCode: courseStatusCode,
    message: courseMessage,
    mainData: courseMainData,
    clearAPI,
    onSuccess: mainData => {
      setFeaturedCourses(mainData.slice(0, 4))
    },
    toast,
    navigate,
  });
  /* API for getting courses - End */


  return (
    <section className="py-16 bg-gradient-to-b from-background to-cyber-dark-blue/40 relative code-pattern">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured <span className="text-cyber-blue">Courses</span></h2>
            <p className="text-muted-foreground">Enhance your cybersecurity career with industry-leading courses</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 cyber-border">
            <Link to="/courses">
              View All Courses
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {
            isCoursesLoading ? (
              <Loader />
            ) :
              featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPurchase={(course) => handlePurchase(course)}
                  userId={loginData?.id}
                />
              ))
          }

        </div>
      </div>
      {/* Payment Dialog */}
      {
        isPaymentDialogOpen &&
        <PaymentForm
          open={isPaymentDialogOpen}
          onOpenChange={handlePaymentDialog}
          title="Proceed to Payment"
          course={selectedCourse}
          token={loginData?.token}
          onSubmit={() => callCoursesAPI(Constants.allCourseFilter)}
        />
      }

    </section>
  );
};

export default FeaturedCourses;
