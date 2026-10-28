import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageHeader } from '../../src/components/PageHeader';
import { Screen } from '../../src/components/Screen';
import { SubjectBadge } from '../../src/components/SubjectBadge';
import { colors, shadow } from '../../src/constants/theme';
import { useStudyStore } from '../../src/store/useStudyStore';

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export default function TodayScreen() {
  const { tasks, points, streak, completeTask } = useStudyStore();
  const [message, setMessage] = useState('');
  const completed = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? completed / tasks.length : 0;
  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}月${now.getDate()}日 · ${weekdays[now.getDay()]}`;

  const handleComplete = (taskId: string, title: string) => {
    completeTask(taskId);
    setMessage(`太棒了！「${title}」已打卡`);
  };

  return (
    <Screen>
      <PageHeader
        eyebrow={dateLabel}
        title="今天，继续发芽"
        subtitle="把每一件小事做好，就是很大的进步。"
        action={
          <View style={styles.avatar}>
            <Ionicons name="leaf" size={25} color={colors.primaryDark} />
          </View>
        }
      />

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>今日学习进度</Text>
            <Text style={styles.heroCount}>
              {completed}
              <Text style={styles.heroTotal}> / {tasks.length} 项</Text>
            </Text>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={17} color="#F7C45C" />
            <Text style={styles.streakText}>连续 {streak} 天</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 3)}%` }]} />
        </View>
        <Text style={styles.heroHint}>
          {completed === tasks.length
            ? '今日任务全部完成，好好休息吧！'
            : `再完成 ${tasks.length - completed} 项，就能收下今日全部成长`}
        </Text>
        <View style={styles.heroBubbleOne} />
        <View style={styles.heroBubbleTwo} />
      </View>

      {message ? (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          <Text style={styles.successText}>{message}</Text>
          <Pressable onPress={() => setMessage('')} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.primary} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>今日任务</Text>
        <View style={styles.pointsPill}>
          <Ionicons name="sparkles" size={14} color="#9B6C16" />
          <Text style={styles.pointsText}>{points} 成长值</Text>
        </View>
      </View>

      <View style={styles.taskList}>
        {tasks.map((task) => (
          <Pressable
            key={task.id}
            accessibilityRole="button"
            accessibilityLabel={task.completed ? `${task.title}，已完成` : `打卡：${task.title}`}
            disabled={task.completed}
            onPress={() => handleComplete(task.id, task.title)}
            style={({ pressed }) => [
              styles.taskCard,
              task.completed && styles.taskCompleted,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.taskTop}>
              <SubjectBadge subject={task.subject} />
              <Text style={styles.taskPoints}>+{task.points} 成长值</Text>
            </View>
            <Text style={[styles.taskTitle, task.completed && styles.completedText]}>
              {task.title}
            </Text>
            <Text style={styles.taskDetail}>{task.detail}</Text>
            <View style={styles.taskFooter}>
              <Text style={styles.taskAction}>
                {task.completed ? '已完成，做得真棒' : '完成后，点这里打卡'}
              </Text>
              <View style={[styles.checkButton, task.completed && styles.checkButtonDone]}>
                <Ionicons
                  name={task.completed ? 'checkmark' : 'arrow-forward'}
                  size={18}
                  color={task.completed ? colors.white : colors.primary}
                />
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Ionicons name="bulb-outline" size={21} color="#946718" />
        </View>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>小芽加油站</Text>
          <Text style={styles.tipText}>不和别人比速度，只和昨天的自己比进步。</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
  },
  hero: {
    overflow: 'hidden',
    borderRadius: 25,
    padding: 22,
    backgroundColor: colors.primaryDark,
    gap: 16,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  heroLabel: {
    color: '#D8E6DC',
    fontSize: 13,
    fontWeight: '600',
  },
  heroCount: {
    marginTop: 5,
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
  },
  heroTotal: {
    color: '#B9CCBF',
    fontSize: 16,
    fontWeight: '500',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3A5C47',
  },
  streakText: {
    color: '#F5E7C4',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: '#456552',
    zIndex: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#F3C668',
  },
  heroHint: {
    color: '#C8D8CD',
    fontSize: 12,
    lineHeight: 18,
    zIndex: 1,
  },
  heroBubbleOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#385A46',
    right: -72,
    bottom: -100,
  },
  heroBubbleTwo: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#496D57',
    right: 45,
    top: -48,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  successText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    color: '#8A631D',
    fontSize: 12,
    fontWeight: '700',
  },
  taskList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  taskCompleted: {
    backgroundColor: '#F7F9F6',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  taskTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskPoints: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  taskTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  completedText: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  taskDetail: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  taskAction: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  checkButtonDone: {
    backgroundColor: colors.primary,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBE5B5',
  },
  tipCopy: {
    flex: 1,
    gap: 3,
  },
  tipTitle: {
    color: '#76571F',
    fontSize: 13,
    fontWeight: '800',
  },
  tipText: {
    color: '#8D7040',
    fontSize: 12,
    lineHeight: 18,
  },
});
