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
