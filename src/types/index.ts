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
  signup: (name: string, email: string, password: string, inviteToken?: string) => Promise<void>;
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

export interface IAdminApplicationListItem {
  id: string;
  name: string;
  email: string;
  subject_area: TSubjectArea;
  status: TApplicationStatus;
  created_at: string;
}

export interface IAdminApplicationDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject_area: TSubjectArea;
  qualifications: string;
  experience_years: number;
  teaching_philosophy: string;
  status: TApplicationStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  invite_token_expires_at: string | null;
}

export interface IPaginatedApplications {
  items: IAdminApplicationListItem[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface IApproveResponse {
  message: string;
  invite_token_expires_at: string;
}

export interface IRejectResponse {
  message: string;
}

export interface IResendInviteResponse {
  message: string;
  invite_token_expires_at: string;
}

export interface IStudentListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface IPaginatedStudents {
  items: IStudentListItem[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export type IStudentDetail = IStudentListItem;
