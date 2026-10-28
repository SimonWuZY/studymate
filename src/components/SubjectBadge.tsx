import { StyleSheet, Text } from 'react-native';
import { subjectColors } from '../constants/theme';
import { Subject } from '../types';

export function SubjectBadge({ subject }: { subject: Subject }) {
  const palette = subjectColors[subject];
  return (
    <Text style={[styles.badge, { backgroundColor: palette.background, color: palette.text }]}>
      {subject}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
});
