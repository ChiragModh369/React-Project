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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
const Courses = () => {
  const dispatch = useDispatch();
  const [filteredCourses, setFilteredCourses] = useState<CourseProps[]>([]);
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;// Show 6 courses per page

  const [selectedCourse, setSelectedCourse] = useState()
  const [searchParams] = useSearchParams();
  const paymentResult = searchParams.get(Constants.payment)
  const [filter, setFilter] = useState(Constants.allCourseFilter);
  const { toast } = useToast();
  const navigate = useNavigate()
  const location = useLocation();
  const loginData = useSelector(data => data.loginDataReducer);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const handlePaymentDialog = () => {
    setIsPaymentDialogOpen(!isPaymentDialogOpen)
  }
  useEffect(() => {
    showLog("loginData from local storage", loginData)

    callCoursesAPI(filter)

  }, [loginData])

  useEffect(() => {
    if (paymentResult == Constants.success) {
      console.log("Payment successful");
      toast({
        title: "🎉 Payment Successful!",
        description: "Dive in and start your learning journey 🚀",
      });

      //enroll user
    } else if (paymentResult == Constants.cancel) {
      toast({
        title: "Payment Cancelled",
        description: "Looks like the payment didn’t go through. Try again.",
        variant: "destructive",
      });
    }
  }, [paymentResult]);

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
    dispatch({ type: CLEAR_READ_COURSES });
  }
  const callCoursesAPI = (value) => {
    const data = {
      search: value,
    };
    showLog("callCoursesAPI", data)
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
      setFilteredCourses(mainData)
      setCurrentPage(1); // Reset to first page when filter changes
    },
    toast,
    navigate,
  });
  /* API for getting courses - End */
  // Calculate pagination
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
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

  return (

    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-cyber-dark-blue py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Cybersecurity Courses</h1>
                <p className="text-muted-foreground text-lg max-w-3xl">
                  Enhance your skills with our comprehensive cybersecurity training courses taught by industry experts.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mt-6">
              <Button
                variant={filter === Constants.allCourseFilter ? 'default' : 'outline'}
                onClick={() => {
                  setFilter(Constants.allCourseFilter)
                  callCoursesAPI(Constants.allCourseFilter)
                }}
              >
                All Courses
              </Button>
              <Button
                variant={filter === Constants.freeCourseFilter ? 'default' : 'outline'}
                onClick={() => {
                  setFilter(Constants.freeCourseFilter)
                  callCoursesAPI(Constants.freeCourseFilter)
                }}
              >
                Free Courses
              </Button>
              <Button
                variant={filter === Constants.premiumCourseFilter ? 'default' : 'outline'}
                onClick={() => {
                  setFilter(Constants.premiumCourseFilter)
                  callCoursesAPI(Constants.premiumCourseFilter)
                }}
              >
                Premium Courses
              </Button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="container mx-auto px-4 py-12">
          {isCoursesLoading ? (
            <Loader />
          ) : (
            <>
              {/* Grid of courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onPurchase={(course) => handlePurchase(course)}
                    userId={loginData?.id}
                  />
                ))}

                {currentCourses.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No courses match your criteria.</p>
                  </div>
                )}
              </div>

              {/* Pagination - outside the grid */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {pageNumbers.map((number) => (
                        <PaginationItem key={number}>
                          <PaginationLink
                            isActive={currentPage === number}
                            onClick={() => handlePageChange(number)}
                            className="cursor-pointer"
                          >
                            {number}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>


      </main>

      <Footer />


      {/* User Login Dialog */}
      <LoginForm
        open={isUserLoginOpen}
        onOpenChange={setIsUserLoginOpen}
        onSubmit={() => { showLog("login done") }}
        title="Access Your Account"
      />
      {/* Payment Dialog */}
      {
        isPaymentDialogOpen &&
        <PaymentForm
          open={isPaymentDialogOpen}
          onOpenChange={handlePaymentDialog}
          title="Proceed to Payment"
          course={selectedCourse}
          token={loginData?.token}
          onSubmit={() => callCoursesAPI(filter)}
        />
      }

    </div>

  );
};

export default Courses;
