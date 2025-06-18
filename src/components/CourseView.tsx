import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Video, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getCourseById, getCurrentUser, purchaseCourse } from '@/services/courseService';

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = React.useState(getCourseById(id || ''));
  const currentUser = getCurrentUser();
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Course not found.</p>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  const userOwnsCourse = currentUser?.hasPurchased.includes(course.id) || currentUser?.role === 'admin' || !course.isPaid;
  const canAccessVideo = userOwnsCourse || !course.restrictedAccess;

  const handlePurchase = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase this course.",
        variant: "destructive"
      });
      return;
    }

    const result = purchaseCourse(course.id, currentUser.id);
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      setCourse(getCourseById(course.id)); // Refresh course data
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/courses')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {course.videoUrl && canAccessVideo ? (
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
              <video
                src={course.videoUrl}
                poster={course.thumbnailUrl}
                controls
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : course.videoUrl && !canAccessVideo ? (
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6 relative">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
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
                  Purchase for ${course.price.toFixed(2)}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className="bg-cyber-blue text-black">
              {course.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={`
                ${course.level === 'Beginner' ? 'border-green-500 text-green-500' : ''}
                ${course.level === 'Intermediate' ? 'border-yellow-500 text-yellow-500' : ''}
                ${course.level === 'Advanced' ? 'border-red-500 text-red-500' : ''}
              `}
            >
              {course.level}
            </Badge>
            {course.restrictedAccess && (
              <Badge variant="outline" className="border-red-500 text-red-500">
                <Lock className="w-3 h-3 mr-1" />
                Restricted Access
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Video className="w-4 h-4 mr-1" />
              <span>{course.lessons} lessons</span>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-2">About this course</h2>
            <p>{course.description}</p>
          </div>
        </div>
        
        <div>
          <Card className="p-6 sticky top-20">
            <div className="mb-6 text-center">
              {course.isPaid ? (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-3xl font-bold">${course.price.toFixed(2)}</p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-500 mb-4">Free</p>
              )}
              
              {course.isPaid && !userOwnsCourse ? (
                <Button 
                  className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                  onClick={handlePurchase}
                >
                  Purchase Course
                </Button>
              ) : (
                <Button 
                  className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black"
                  disabled={!canAccessVideo}
                  onClick={() => navigate(`/courses/${course.id}/lessons`)}
                >
                  {canAccessVideo ? "Start Learning" : "Purchase Required"}
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">This course includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Video className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{course.lessons} video lessons</span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{course.duration} of content</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseView;