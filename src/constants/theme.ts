import { Subject } from '../types';

export const colors = {
  background: '#F5F7F2',
  card: '#FFFFFF',
  primary: '#527C64',
  primaryDark: '#284A38',
  primaryLight: '#E5EFE7',
  accent: '#F2B84B',
  accentLight: '#FFF3D9',
  text: '#24322A',
  muted: '#7A847D',
  border: '#E5E9E2',
  danger: '#B9564C',
  white: '#FFFFFF',
};

export const subjectColors: Record<Subject, { background: string; text: string }> = {
  语文: { background: '#F9E9E4', text: '#A65E4A' },
  数学: { background: '#E6EEF8', text: '#4B6F9C' },
  英语: { background: '#EEE8F7', text: '#765D9B' },
};

export const shadow = {
  shadowColor: '#20362A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 14,
  elevation: 2,
};
