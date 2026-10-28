import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialPointEntries, initialQuestions, initialRewards, initialTasks } from '../data/demo';
import { PointEntry, Question, Reward, Subject, Task } from '../types';

type StudyState = {
  tasks: Task[];
  questions: Question[];
  rewards: Reward[];
  points: number;
  pointEntries: PointEntry[];
  streak: number;
  completeTask: (taskId: string) => void;
  addQuestion: (input: { title: string; subject: Subject; imageUri?: string }) => void;
  toggleQuestion: (questionId: string) => void;
  redeemReward: (rewardId: string) => boolean;
  resetDemo: () => void;
};

const makePointEntry = (title: string, amount: number): PointEntry => ({
  id: `entry-${Date.now()}`,
  title,
  amount,
  createdAt: new Date().toISOString(),
});

const initialState = {
  tasks: initialTasks,
  questions: initialQuestions,
  rewards: initialRewards,
  points: 320,
  pointEntries: initialPointEntries,
  streak: 6,
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      ...initialState,
      completeTask: (taskId) => {
        const task = get().tasks.find((item) => item.id === taskId);
        if (!task || task.completed) return;

        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === taskId ? { ...item, completed: true } : item,
          ),
          points: state.points + task.points,
          pointEntries: [
            makePointEntry(`完成任务 · ${task.title}`, task.points),
            ...state.pointEntries,
          ],
        }));
      },
      addQuestion: ({ title, subject, imageUri }) => {
        const question: Question = {
          id: `question-${Date.now()}`,
          title: title.trim() || '拍照上传的新题目',
          subject,
          tag: '待复习',
          imageUri,
          mastered: false,
          rewarded: false,
        };
        set((state) => ({ questions: [question, ...state.questions] }));
      },
      toggleQuestion: (questionId) => {
        const question = get().questions.find((item) => item.id === questionId);
        if (!question) return;

        const earnedPoints = !question.mastered && !question.rewarded ? 30 : 0;
        set((state) => ({
          questions: state.questions.map((item) =>
            item.id === questionId
              ? {
                  ...item,
                  mastered: !item.mastered,
                  rewarded: item.rewarded || !item.mastered,
                }
              : item,
          ),
          points: state.points + earnedPoints,
          pointEntries: earnedPoints
            ? [makePointEntry(`攻克错题 · ${question.tag}`, earnedPoints), ...state.pointEntries]
            : state.pointEntries,
        }));
      },
      redeemReward: (rewardId) => {
        const reward = get().rewards.find((item) => item.id === rewardId);
        if (!reward || get().points < reward.points) return false;

        set((state) => ({
          points: state.points - reward.points,
          pointEntries: [
            makePointEntry(`兑换奖励 · ${reward.name}`, -reward.points),
            ...state.pointEntries,
          ],
        }));
        return true;
      },
      resetDemo: () => set(initialState),
    }),
    {
      name: 'sprout-study-demo',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
