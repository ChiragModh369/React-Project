
import { CourseProps } from "@/components/CourseCard";

// Sample course data - this would normally come from a database
export const sampleCourses: CourseProps[] = [
  {
    id: '1',
    title: 'Ethical Hacking Fundamentals',
    instructor: 'Sarah Johnson',
    description: 'Learn the core skills needed to identify security vulnerabilities in systems and networks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    duration: '6 hours',
    lessons: 12,
    level: 'Beginner',
    category: 'Ethical Hacking',
    price: 49.99,
    isPaid: true,
    restrictedAccess: true
  },
  {
    id: '2',
    title: 'Network Security Essentials',
    instructor: 'Michael Chen',
    description: 'Master the principles and practices of securing enterprise networks from threats.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    duration: '8 hours',
    lessons: 15,
    level: 'Intermediate',
    category: 'Network Security',
    price: 69.99,
    isPaid: true,
    restrictedAccess: true
  },
  {
    id: '3',
    title: 'Advanced Threat Hunting',
    instructor: 'Alex Mercer',
    description: 'Learn proactive techniques to detect and neutralize advanced persistent threats.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    duration: '10 hours',
    lessons: 18,
    level: 'Advanced',
    category: 'Threat Intelligence',
    price: 89.99,
    isPaid: true,
    restrictedAccess: true
  },
  {
    id: '4',
    title: 'Cloud Security Architecture',
    instructor: 'Elena Rodriguez',
    description: 'Design and implement secure cloud infrastructure for enterprise applications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783',
    duration: '7 hours',
    lessons: 14,
    level: 'Intermediate',
    category: 'Cloud Security',
    price: 79.99,
    isPaid: true,
    restrictedAccess: false
  },
  {
    id: '5',
    title: 'Security Incident Response',
    instructor: 'David Kim',
    description: 'Learn how to effectively respond to security incidents and minimize damage.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    duration: '5 hours',
    lessons: 10,
    level: 'Intermediate',
    category: 'Incident Response',
    price: 59.99,
    isPaid: true,
    restrictedAccess: false
  },
  {
    id: '6',
    title: 'Web Application Security',
    instructor: 'Jessica Carter',
    description: 'Learn how to identify and remediate security vulnerabilities in web applications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8',
    duration: '9 hours',
    lessons: 16,
    level: 'Beginner',
    category: 'AppSec',
    price: 0,
    isPaid: false,
    restrictedAccess: false
  },
  {
    id: '7',
    title: 'Malware Analysis Fundamentals',
    instructor: 'Robert Wu',
    description: 'Understand the techniques for analyzing and understanding malicious software.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    duration: '11 hours',
    lessons: 20,
    level: 'Advanced',
    category: 'Threat Analysis',
    price: 99.99,
    isPaid: true,
    restrictedAccess: true
  },
  {
    id: '8',
    title: 'Cryptography Basics',
    instructor: 'Olivia Martinez',
    description: 'Learn the fundamental principles of modern cryptography and encryption.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
    duration: '4 hours',
    lessons: 8,
    level: 'Beginner',
    category: 'Cryptography',
    price: 0,
    isPaid: false,
    restrictedAccess: false
  }
];

// User roles
export type UserRole = 'admin' | 'user' | 'guest';

// Mock user data - in a real app this would come from auth
export interface User {
  token:string,
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hasPurchased: string[]; // Array of course IDs that the user has purchased
}

// Mock users
const users: User[] = [
  {
    token:'',
    id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    hasPurchased: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    token:'',
    id: 'user123',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    hasPurchased: ['1', '4']
  }
];

// Current user - in a real app this would be set during login
let currentUser: User | null = null;

// Get all courses
export const getAllCourses = (): CourseProps[] => {
  return sampleCourses;
};

// Get courses filtered by accessibility
export const getAccessibleCourses = (userId?: string): CourseProps[] => {
  if (!userId || !currentUser) {
    // Return only free and non-restricted courses for guests
    return sampleCourses.filter(course => !course.isPaid && !course.restrictedAccess);
  }

  if (currentUser.role === 'admin') {
    // Admins can access all courses
    return sampleCourses;
  }

  // For regular users, return free courses and purchased courses
  return sampleCourses.filter(
    course => !course.restrictedAccess ||
      !course.isPaid ||
      currentUser.hasPurchased.includes(course.id)
  );
};

// Get course by ID
export const getCourseById = (id: string): CourseProps | undefined => {
  return sampleCourses.find(course => course.id === id);
};

// Create a new course (admin only)
export const createCourse = (course: Omit<CourseProps, 'id'>, userId?: string): { success: boolean; message: string; course?: CourseProps } => {
  if (!userId || !currentUser || currentUser.role !== 'admin') {
    return { success: false, message: 'Unauthorized: Only admins can create courses' };
  }

  const newCourse: CourseProps = {
    ...course,
    id: (sampleCourses.length + 1).toString()
  };

  sampleCourses.push(newCourse);
  return { success: true, message: 'Course created successfully', course: newCourse };
};

// Update an existing course (admin only)
export const updateCourse = (id: string, courseData: Partial<CourseProps>, userId?: string): { success: boolean; message: string; course?: CourseProps } => {
  if (!userId || !currentUser || currentUser.role !== 'admin') {
    return { success: false, message: 'Unauthorized: Only admins can update courses' };
  }

  const courseIndex = sampleCourses.findIndex(course => course.id === id);
  if (courseIndex === -1) {
    return { success: false, message: 'Course not found' };
  }

  const updatedCourse = { ...sampleCourses[courseIndex], ...courseData };
  sampleCourses[courseIndex] = updatedCourse;

  return { success: true, message: 'Course updated successfully', course: updatedCourse };
};

// Delete a course (admin only)
export const deleteCourse = (id: string, userId?: string): { success: boolean; message: string } => {
  if (!userId || !currentUser || currentUser.role !== 'admin') {
    return { success: false, message: 'Unauthorized: Only admins can delete courses' };
  }

  const initialLength = sampleCourses.length;
  const filteredCourses = sampleCourses.filter(course => course.id !== id);

  if (filteredCourses.length === initialLength) {
    return { success: false, message: 'Course not found' };
  }

  // Replace the array with filtered courses (simulating deletion)
  while (sampleCourses.length > 0) {
    sampleCourses.pop();
  }
  filteredCourses.forEach(course => sampleCourses.push(course));

  return { success: true, message: 'Course deleted successfully' };
};

// Login user simulation
export const login = (email: string): { success: boolean; user?: User; message: string } => {
  const user = users.find(u => u.email === email);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  currentUser = user;
  return { success: true, user, message: 'Login successful' };
};

// Logout user
export const logout = (): void => {
  currentUser = null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return currentUser?.role === 'admin' || false;
};

// Purchase a course
export const purchaseCourse = (courseId: string, userId?: string): { success: boolean; message: string } => {
  if (!userId || !currentUser) {
    return { success: false, message: 'Please login to purchase courses' };
  }

  const course = getCourseById(courseId);
  if (!course) {
    return { success: false, message: 'Course not found' };
  }

  if (!course.isPaid) {
    return { success: false, message: 'This course is already free' };
  }

  if (currentUser.hasPurchased.includes(courseId)) {
    return { success: false, message: 'You already own this course' };
  }

  currentUser.hasPurchased.push(courseId);
  return { success: true, message: `Successfully purchased ${course.title}` };
};
