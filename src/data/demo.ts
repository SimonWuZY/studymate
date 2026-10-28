import { PointEntry, Question, Reward, Task } from '../types';

export const initialTasks: Task[] = [
  {
    id: 'task-words',
    title: '背诵 20 个英语单词',
    subject: '英语',
    detail: 'Unit 4 · 完成后大声朗读一遍',
    points: 20,
    completed: false,
  },
  {
    id: 'task-math',
    title: '完成数学练习第 3 页',
    subject: '数学',
    detail: '重点检查一元一次方程的计算',
    points: 30,
    completed: false,
  },
  {
    id: 'task-reading',
    title: '阅读《草房子》20 分钟',
    subject: '语文',
    detail: '摘抄一句最喜欢的话',
    points: 15,
    completed: true,
  },
];

export const initialQuestions: Question[] = [
  {
    id: 'question-equation',
    title: '解方程：3(x − 2) = 2x + 5',
    subject: '数学',
    tag: '一元一次方程',
    mastered: false,
    rewarded: false,
  },
  {
    id: 'question-reading',
    title: '概括文章第 2 自然段的主要内容',
    subject: '语文',
    tag: '阅读理解',
    mastered: false,
    rewarded: false,
  },
  {
    id: 'question-grammar',
    title: '选择正确的一般过去时动词形式',
    subject: '英语',
    tag: '时态',
    mastered: true,
    rewarded: true,
  },
];

export const initialRewards: Reward[] = [
  {
    id: 'reward-movie',
    name: '周末看电影',
    description: '和家人一起选一部喜欢的电影',
    points: 300,
    icon: 'film-outline',
  },
  {
    id: 'reward-dessert',
    name: '下午茶自由选',
    description: '挑选一份喜欢的甜点或饮品',
    points: 180,
    icon: 'cafe-outline',
  },
  {
    id: 'reward-book',
    name: '挑选一本课外书',
    description: '在书店挑选一本感兴趣的书',
    points: 500,
    icon: 'book-outline',
  },
];

export const initialPointEntries: PointEntry[] = [
  {
    id: 'entry-welcome',
    title: '连续学习奖励',
    amount: 50,
    createdAt: '2026-10-28T08:00:00.000Z',
  },
  {
    id: 'entry-reading',
    title: '完成阅读任务',
    amount: 15,
    createdAt: '2026-10-28T07:30:00.000Z',
  },
];
