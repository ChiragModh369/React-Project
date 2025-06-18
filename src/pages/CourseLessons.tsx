import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReadLessonAction, fetchUpdateUserProgressAction } from '@/redux/actions/mainAction';
import { showLog } from '@/commonFunctions/Functions';
import { CLEAR_LESSONS, CLEAR_USER_PROGRESS } from '@/redux/actions/types/reduxConst';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
interface Lesson {
  id: number;
  title: string;
  description: string,
  duration: string;
  completed: boolean;
  last_position: number;
  video?: string;
}

const CourseLessons = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const loginData = useSelector(data => data.loginDataReducer);
  const [currentLesson, setCurrentLesson] = useState<Lesson[]>([])
  const [isPlayNext, setIsPlayNext] = useState(false);
  useEffect(() => {
    showLog("loginData from local course lesson", loginData)
    if (loginData?.token) {
      callLessonAPI();
    }
  }, [loginData?.token])

  /* API for getting courses - Start */
  const clearAPI = () => {
    dispatch({ type: CLEAR_LESSONS });
  }
  const callLessonAPI = () => {
    const data = {
      token: loginData?.token,
      id: id,
    };
    showLog("callLessonAPI", data)
    dispatch(fetchReadLessonAction(data));
  };

  const {
    isLessonsLoading,
    lessonStatusCode,
    lessonMessage,
    lessonMainData,
  } = useSelector(data => data.readLessonReducer);

  useApiStatusHandler({
    statusCode: lessonStatusCode,
    message: lessonMessage,
    mainData: lessonMainData,
    clearAPI,
    onSuccess: mainData => {
      setCurrentLesson(mainData);
      showLog("lesson main data", lessonMessage);

      const firstIncompleteLesson = lessonMainData?.lessons.find(lesson => !lesson.completed);
      showLog("firstIncompleteLesson", firstIncompleteLesson?.id);

      // ✅ If all lessons are completed, fallback to the first one
      const fallbackLesson = lessonMainData?.lessons?.[0] || null;
      setCurrentLesson(firstIncompleteLesson || fallbackLesson);
    },
    toast,
    navigate,
  });
  /* API for getting courses - End */

  /* API for update user lesson progress - Start */
  const clearProgressAPI = () => {
    dispatch({ type: CLEAR_USER_PROGRESS });
  }
  const callUpdateProgressAPI = (completed, last_position, lesson_id) => {
    const data = {
      token: loginData?.token,
      lesson_id: lesson_id,
      completed: completed,//0 --> no, 1--> yes
      last_position: last_position
    };
   // showLog("callUpdateProgress", data)
    dispatch(fetchUpdateUserProgressAction(data));
  };

  const {
    isProgressLoading,
    userProgressStatusCode,
    userProgressMessage,
    userProgressMainData,
  } = useSelector(data => data.userProgressReducer);

  useApiStatusHandler({
    statusCode: userProgressStatusCode,
    message: userProgressMessage,
    mainData: userProgressMainData,
    clearAPI: clearProgressAPI,
    onSuccess: mainData => {
      showLog("user progress main data", isPlayNext)
      if (isPlayNext) {
        callLessonAPI()
        setIsPlayNext(false);
      }
      clearProgressAPI()
    },
    toast,
    navigate,
  });
  /* API for update user lesson progress - End */

  const videoRef = useRef(null);
  const [watchProgress, setWatchProgress] = useState(0); // percentage

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const currentTime = video.currentTime;
      setWatchProgress(currentTime); // Save it locally or to an API
    }
  };

  const handleSeekToLastPosition = () => {
    const video = videoRef.current;
    if (video && currentLesson.last_position > 0) {
      video.currentTime = currentLesson.last_position;
    }
  };

  const handleVideoEnded = () => {
    showLog("User watched the video fully.", watchProgress);
    setIsPlayNext(true);
    callUpdateProgressAPI(1, 0.0000, currentLesson?.id)// You can also send an API call to mark as completed
    //here set next lesson in setCurrentLesson

  };


  // if (!lessonMainData?.course_id) {
  //   return (
  //     <div className="container mx-auto px-4 py-12 text-center">
  //       <p>Course not found.</p>
  //       <Button onClick={() => handleBackToCourseDetail()} className="mt-4">
  //         Back
  //       </Button>
  //     </div>
  //   );
  // }
  const handleBackToCourseDetail = () => {
    navigate(`/courses/${id}`);
  };

  // Calculate progress
  const progress = (lessonMainData?.completed_lessons / lessonMainData?.total_lessons) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {isLessonsLoading || isProgressLoading && <FullScreenLoader />}
      <Navbar />

      <main className="flex-grow">
        {/* Course Header */}
        <div className="bg-cyber-dark-blue border-b border-cyber-blue/20">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="outline"
              onClick={handleBackToCourseDetail}
              className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{lessonMainData?.course_title}</h1>
                <p className="text-muted-foreground">
                  {lessonMainData?.course_description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{lessonMainData?.completed_lessons} of {lessonMainData?.total_lessons} lessons completed</span>
                  <Progress value={progress} className="w-[100px]" />
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">

              <>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6"
                  onContextMenu={e => e.preventDefault()} //to disable right click to prevent saving videos
                >
                  <video
                    key={currentLesson?.id}
                    ref={videoRef}
                    src={currentLesson.video}
                    controls
                    //autoPlay muted
                    controlsList="nodownload"
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    onLoadedMetadata={handleSeekToLastPosition}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentLesson?.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentLesson?.description}
                  </p>
                </div>
              </>

            </div>

            {/* Lessons List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              {lessonMainData?.lessons?.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`p-4 cursor-pointer transition-colors hover:border-cyber-blue/40 ${currentLesson.id === lesson.id ? 'border-cyber-blue bg-cyber-blue/5' : ''
                    }`}
                  onClick={() => {
                    if (currentLesson.completed) {
                      showLog("llesson is completed so only save lst position", currentLesson.id + " " + currentLesson.completed)
                      callUpdateProgressAPI(1, watchProgress, currentLesson.id)
                    } else {
                      showLog("lesson is incomplete ", currentLesson.id + " " + currentLesson.completed)
                      callUpdateProgressAPI(0, watchProgress, currentLesson.id)
                    }

                    setCurrentLesson(lesson)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) :
                        <PlayCircle className="w-5 h-5 text-cyber-blue" />
                      }
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium mb-1">{lesson.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        Duration: {lesson.duration}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

};

export default CourseLessons;