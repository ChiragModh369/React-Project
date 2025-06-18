import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Lock, User, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Constants } from '@/Constants';
import { isCourseAvailable, showLog } from '@/commonFunctions/Functions';

export interface CourseProps {
  id: string;
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessons_count: number;
  difficulty_level: string;
  category: string;
  price: string;
  is_paid: boolean;
  restrictedAccess: boolean;
  videoUrl?: string;
  enrolledUsers: Array<number>
}

interface CourseCardProps {
  course: CourseProps;
  onPurchase?: (course: CourseProps) => void;
  userId: number
}

const CourseCard = ({
  course,
  onPurchase,
  userId = 0
}: CourseCardProps) => {

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPurchase) {
      onPurchase(course);
    }
  };

  const canAccess = !course.restrictedAccess || !course.is_paid;
  const isCourseAccessible = () => {
    if (isCourseAvailable(course?.price, userId, course?.enrolledUsers)) {
      return true//View Course
    } else if (course.restrictedAccess) {
      return false // purchase is mandatory
    } else {
      return true //Preview Course
    }
  }
  return (
    <Card className={`h-full flex flex-col overflow-hidden transition-colors cyber-border group ${canAccess ? 'hover:border-cyber-blue/40' : 'opacity-70'}`}>
      <div className="relative overflow-hidden">
        <div className="aspect-video w-full bg-cyber-dark-blue overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className={`object-cover w-full h-full transition-transform duration-300 ${canAccess ? 'group-hover:scale-105' : 'filter grayscale-[30%]'}`}
          />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge
            className="bg-cyber-blue text-black font-medium"
            variant="secondary"
          >
            {course.category}
          </Badge>

          {course.restrictedAccess && (
            <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
              <Lock className="w-3 h-3 mr-1" />
              Restricted
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-cyber-blue transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-1" />
          <span>{course.instructor}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-2 border-t border-border">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Video className="w-3 h-3 mr-1" />
            <span>{course.lessons_count}</span>
          </div>
          <Badge
            variant="outline"
            className={`
              ${course.difficulty_level === Constants.beginner ? 'border-green-500 text-green-500' : ''}
              ${course.difficulty_level === Constants.intermediate ? 'border-yellow-500 text-yellow-500' : ''}
              ${course.difficulty_level === Constants.advanced ? 'border-red-500 text-red-500' : ''}
            `}
          >
            {course.difficulty_level}
          </Badge>
        </div>

        <div className="w-full flex justify-between items-center gap-2">
          <div className="text-sm font-semibold">
            {course.is_paid ? (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                <span>${course.price}</span>
              </div>
            ) : (
              <span className="text-green-500">Free</span>
            )}
          </div>

          <div className="flex gap-2">
            {
              isCourseAccessible() ?
                <Button size="sm" className="flex-1 bg-cyber-blue hover:bg-cyber-blue/80 text-black" asChild>
                  <Link to={`/courses/${course.id}`}>
                    View Course
                  </Link>
                </Button> :
                <Button size="sm" className="flex-1 bg-cyber-blue hover:bg-cyber-blue/80 text-black" onClick={handlePurchaseClick}>
                  Purchase
                </Button>
            }
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
