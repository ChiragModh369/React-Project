
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Video, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { isCourseAvailable, isCourseFree, isUserLoggedIn, showLog } from '@/commonFunctions/Functions';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { CLEAR_READ_COURSE_DETAIL, CLEAR_ENROLL_USER } from '@/redux/actions/types/reduxConst';
import { fetchReadCourseDetailAction, fetchEnrollUserAction } from '@/redux/actions/mainAction';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Constants } from '@/Constants';
import FullScreenLoader from '../components/ui/FullScreenLoader';
import PaymentForm from '@/components/PaymentForm';
const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get(Constants.session_id);
  const paymentResult = searchParams.get(Constants.payment)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const handlePaymentDialog = () => {
    setIsPaymentDialogOpen(!isPaymentDialogOpen)
  }

  const loginData = useSelector(data => data.loginDataReducer);

  useEffect(() => {
    showLog("loginData from local storage", loginData);
    if (id) {
      callCourseDetailAPI(id)
    }
  }, [loginData])

  useEffect(() => {
    if (sessionId && paymentResult == Constants.success) {
      console.log("Payment successful, session:", sessionId);
      toast({
        title: "🎉 Payment Successful!",
        description: "Dive in and start your learning journey 🚀",
      });

      //enroll user
      callEnrollUserAPI(id)
    } else if (paymentResult == Constants.cancel) {
      toast({
        title: "Payment Cancelled",
        description: "Looks like the payment didn’t go through. Try again.",
        variant: "destructive",
      });
    }
  }, [sessionId && loginData?.token]);

  useEffect(() => {
    // Check if there are search params
    if (location.search) {
      // Create new clean URL without query params
      const cleanUrl = window.location.origin + location.pathname;
      // Replace the current state with the clean one
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location]);

  /* API for getting courses - Start */

  const clearAPI = () => {
    dispatch({ type: CLEAR_READ_COURSE_DETAIL });
  }
  const callCourseDetailAPI = (value) => {
    clearAPI()
    const data = {
      id: value,
    };
    showLog("callCoursesDetailAPI", data)
    dispatch(fetchReadCourseDetailAction(data));
  };

  const {
    isCoursesLoading,
    courseStatusCode,
    courseMessage,
    courseMainData,
  } = useSelector(data => data.readCourseDetailReducer);

  useApiStatusHandler({
    statusCode: courseStatusCode,
    message: courseMessage,
    mainData: courseMainData,
    clearAPI,
    onSuccess: mainData => {
      showLog("course detail :", mainData);
    },
    toast,
    navigate
  });
  /* API for getting courses - End */

  /* API for enroll user - Start */
  const clearEnrollAPI = () => {
    dispatch({ type: CLEAR_ENROLL_USER });
  }
  const callEnrollUserAPI = (value) => {
    clearEnrollAPI()
    const data = {
      course_id: value,
      token: loginData?.token
    };
    showLog("callEnrollUserAPI", data)
    dispatch(fetchEnrollUserAction(data));
  }
  const {
    isEnrollmentLoading,
    enrollUserStatusCode,
    enrollUserMessage,
    enrollUserMainData,
  } = useSelector(data => data.enrollUserReducer);

  useApiStatusHandler({
    statusCode: enrollUserStatusCode,
    message: enrollUserMessage,
    mainData: enrollUserMainData,
    clearAPI: clearEnrollAPI,
    onSuccess: mainData => {
      showLog("user enroll :", mainData);
      callCourseDetailAPI(id)
    },
    toast,
    navigate
  });

  /* API for enroll user - End */

  const handlePurchase = () => {
    if (!isUserLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase this course.",
        variant: "destructive"
      });
      return;
    }
    handlePaymentDialog()

  };
  // if (!courseMainData?.id) {
  //   return (
  //     <div className="container mx-auto px-4 py-12 text-center">
  //       <p>Course not found.</p>
  //       <Button onClick={() => navigate('/courses')} className="mt-4">
  //         Back to Courses
  //       </Button>
  //     </div>
  //   );
  // }



  const userOwnsCourse = () => {
    return isCourseAvailable(courseMainData?.price, loginData?.id, courseMainData?.enrolledUsers)
  }
  const canAccessVideo = () => {
    if (userOwnsCourse() || !courseMainData?.restrictedAccess) {
      return true
    } else {
      return false
    }

  }
  const navigateToLessons = () => {
    if (!isUserLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/courses/${courseMainData.id}/lessons`)
  }
  if (isCoursesLoading) {
    return <FullScreenLoader />;
  }
  return (
    <div className="min-h-screen flex flex-col">
      {isEnrollmentLoading && <FullScreenLoader />}
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto pt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/courses')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8">

          <div className="lg:col-span-2">
            {courseMainData.videoUrl && canAccessVideo() ? (
              <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
                <video
                  src={courseMainData.videoUrl}
                  poster={courseMainData.thumbnail}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : courseMainData.videoUrl && !canAccessVideo() ? (
              <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6 relative">
                <img
                  src={courseMainData.thumbnail}
                  alt={courseMainData.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Lock className="w-12 h-12 mb-4" />
                  <p className="text-lg font-bold">This content is locked</p>
                  <p className="text-sm mb-4">Purchase the course to access all content</p>
                  <Button
                    onClick={handlePurchase}
                    className="bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                  >
                    Purchase for ${courseMainData.price}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
                <img
                  src={courseMainData.thumbnail}
                  alt={courseMainData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-3xl font-bold mb-4">{courseMainData.title}</h1>

            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="secondary" className="bg-cyber-blue text-black">
                {courseMainData.category}
              </Badge>
              <Badge
                variant="outline"
                className={`
                ${courseMainData.difficulty_level === Constants.beginner ? 'border-green-500 text-green-500' : ''}
                ${courseMainData.difficulty_level === Constants.intermediate ? 'border-yellow-500 text-yellow-500' : ''}
                ${courseMainData.difficulty_level === Constants.advanced ? 'border-red-500 text-red-500' : ''}
              `}
              >
                {courseMainData.difficulty_level}
              </Badge>
              {courseMainData.restrictedAccess && (
                <Badge variant="outline" className="border-red-500 text-red-500">
                  <Lock className="w-3 h-3 mr-1" />
                  Restricted Access
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{courseMainData.instructor}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{courseMainData.duration}</span>
              </div>
              <div className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                <span>{courseMainData.lessons_count}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-2">About this course</h2>
              <p>{courseMainData.description}</p>
            </div>
          </div>

          <div>
            <Card className="p-6 sticky top-20">
              <div className="mb-6 text-center">
                {courseMainData.is_paid ? (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-3xl font-bold">${courseMainData.price}</p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-500 mb-4">Free</p>
                )}
                {
                  userOwnsCourse() ?
                    <Button
                      className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                      onClick={navigateToLessons}>
                      Start Learning
                    </Button> :
                    isCourseFree(courseMainData?.price) ?
                      <Button
                        className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                        onClick={handlePurchase}>
                        Enroll & Start Learning
                      </Button> :
                      <Button
                        className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                        onClick={handlePurchase}>
                        Purchase Course
                      </Button>
                }

              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">This course includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Video className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{courseMainData.lessons_count}</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{courseMainData.duration} of content</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      {/* Payment Dialog */}
      {
        isPaymentDialogOpen &&
        <PaymentForm
          open={isPaymentDialogOpen}
          onOpenChange={handlePaymentDialog}
          title="Proceed to Payment"
          course={courseMainData}
          token={loginData?.token}
          onSubmit={(course_id) => callEnrollUserAPI(course_id)}
        />
      }

    </div>
  );
};

export default CourseView;
