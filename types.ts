// Fix: Provided full implementation for the types used throughout the application.
export interface Course {
  id: string;
  name: string;
  credits: number;
  score: number | null;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
  ips: number | null;
}

export interface StudentProfile {
  name: string;
  nim: string;
  email: string;
  major: string;
  classYear: string;
}

export interface UserData {
  profile: StudentProfile;
  semesters: Semester[];
  password: string;
}

export type AuthView = 'login' | 'register' | 'forgotPassword';

export type View = 'dashboard' | 'coursework' | 'reports' | 'profile';
