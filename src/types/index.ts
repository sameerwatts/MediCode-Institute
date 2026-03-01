export interface INavLink {
  label: string;
  path: string;
}

export interface ITeacher {
  id: string;
  name: string;
  designation: string;
  department: 'medical' | 'cs';
  bio: string;
  avatar: string;
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  category: 'medical' | 'cs';
  thumbnail: string;
  teacher: ITeacher;
  price: number;
  originalPrice: number;
  duration: string;
  lessonsCount: number;
  studentsEnrolled: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface IQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz {
  id: string;
  title: string;
  description: string;
  category: 'medical' | 'cs';
  questionsCount: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: IQuizQuestion[];
}

export interface IBlog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'medical' | 'cs' | 'general';
  thumbnail: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type TApplicationStatus = 'pending' | 'approved' | 'rejected' | 'registered';
export type TSubjectArea = 'medical' | 'cs';

export interface ITeacherApplication {
  name: string;
  email: string;
  phone: string;
  subject_area: TSubjectArea;
  qualifications: string;
  experience_years: number;
  teaching_philosophy: string;
}

export interface IApplicationSubmitResponse {
  id: string;
  message: string;
  status: TApplicationStatus;
}

export interface IApplicationStatusCheck {
  id: string;
  status: TApplicationStatus;
  created_at: string;
  reviewed_at: string | null;
}

export interface IInviteValidation {
  valid: boolean;
  name?: string;
  email?: string;
  reason?: string;
}
