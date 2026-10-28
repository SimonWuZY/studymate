export type Subject = '语文' | '数学' | '英语';

export type Task = {
  id: string;
  title: string;
  subject: Subject;
  detail: string;
  points: number;
  completed: boolean;
};

export type Question = {
  id: string;
  title: string;
  subject: Subject;
  tag: string;
  imageUri?: string;
  mastered: boolean;
  rewarded: boolean;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: 'film-outline' | 'cafe-outline' | 'book-outline';
};

export type PointEntry = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
};
