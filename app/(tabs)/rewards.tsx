import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { PageHeader } from '../../src/components/PageHeader';
import { Screen } from '../../src/components/Screen';
import { colors, shadow } from '../../src/constants/theme';
import { useStudyStore } from '../../src/store/useStudyStore';
import { Reward } from '../../src/types';

export default function RewardsScreen() {
  const { points, rewards, pointEntries, redeemReward, resetDemo } = useStudyStore();
  const [message, setMessage] = useState('');

  const redeem = (reward: Reward) => {
    if (redeemReward(reward.id)) setMessage(`兑换成功！记得和家人领取「${reward.name}」。`);
  };

  const handleRedeem = (reward: Reward) => {
    const description = `将使用 ${reward.points} 成长值兑换「${reward.name}」。`;
    if (Platform.OS === 'web') {
      if (window.confirm(`兑换这份快乐？\n${description}`)) redeem(reward);
      return;
    }
    Alert.alert('兑换这份快乐？', description, [
      { text: '再想想', style: 'cancel' },
      { text: '确认兑换', onPress: () => redeem(reward) },
    ]);
  };

  const handleReset = () => {
    const reset = () => {
      resetDemo();
      setMessage('演示数据已恢复。');
    };
    if (Platform.OS === 'web') {
      if (window.confirm('重置演示数据？')) reset();
      return;
    }
    Alert.alert('重置演示数据？', '任务、错题和成长值都会恢复到初始状态。', [
      { text: '取消', style: 'cancel' },
      { text: '重置', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <Screen>
      <PageHeader
        eyebrow="GROWTH & JOY"
        title="认真长大，也收集快乐"
        subtitle="每一点成长，都值得被好好庆祝。"
        action={
          <View style={styles.giftIcon}>
            <Ionicons name="gift-outline" size={25} color="#91691E" />
          </View>
        }
      />

      <View style={styles.balanceCard}>
        <View style={styles.balanceCopy}>
          <Text style={styles.balanceLabel}>我的成长值</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="sparkles" size={30} color="#F5C765" />
            <Text style={styles.balanceNumber}>{points}</Text>
          </View>
          <Text style={styles.balanceHint}>完成任务、攻克错题，就能收集更多</Text>
        </View>
        <View style={styles.plantIllustration}>
          <View style={styles.sun} />
          <Ionicons name="leaf" size={53} color="#80A68B" style={styles.leafOne} />
          <Ionicons name="leaf" size={43} color="#A7C3A6" style={styles.leafTwo} />
          <View style={styles.plantPot} />
        </View>
      </View>

      {message ? (
        <View style={styles.message}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          <Text style={styles.messageText}>{message}</Text>
          <Pressable onPress={() => setMessage('')} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.primary} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>心愿兑换处</Text>
        <Text style={styles.sectionHint}>和家人一起兑现</Text>
      </View>

      <View style={styles.rewardList}>
        {rewards.map((reward) => {
          const affordable = points >= reward.points;
          const progress = Math.min(points / reward.points, 1);
          return (
            <View key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardTop}>
                <View style={styles.rewardIcon}>
                  <Ionicons name={reward.icon} size={25} color={colors.primaryDark} />
                </View>
                <View style={styles.rewardCopy}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                </View>
              </View>
              <View style={styles.rewardProgressTrack}>
                <View
                  style={[styles.rewardProgress, { width: `${Math.max(progress * 100, 2)}%` }]}
                />
              </View>
              <View style={styles.rewardFooter}>
                <View>
                  <Text style={styles.rewardPoints}>{reward.points} 成长值</Text>
                  {!affordable ? (
                    <Text style={styles.rewardGap}>还差 {reward.points - points}，继续加油</Text>
                  ) : null}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`兑换${reward.name}`}
                  disabled={!affordable}
                  onPress={() => handleRedeem(reward)}
                  style={({ pressed }) => [
                    styles.redeemButton,
                    !affordable && styles.redeemDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.redeemText, !affordable && styles.redeemTextDisabled]}>
                    {affordable ? '兑换' : '未集齐'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>成长值动态</Text>
        <Text style={styles.sectionHint}>最近记录</Text>
      </View>
      <View style={styles.ledgerCard}>
        {pointEntries.slice(0, 5).map((entry, index) => (
          <View
            key={entry.id}
            style={[
              styles.ledgerRow,
              index < Math.min(pointEntries.length, 5) - 1 && styles.ledgerBorder,
            ]}
          >
            <View style={[styles.ledgerIcon, entry.amount < 0 && styles.ledgerIconNegative]}>
              <Ionicons
                name={entry.amount >= 0 ? 'arrow-down' : 'gift-outline'}
                size={17}
                color={entry.amount >= 0 ? colors.primary : '#A36C31'}
              />
            </View>
            <View style={styles.ledgerCopy}>
              <Text style={styles.ledgerTitle} numberOfLines={1}>
                {entry.title}
              </Text>
              <Text style={styles.ledgerDate}>
                {entry.createdAt.slice(5, 10).replace('-', '月')}日
              </Text>
            </View>
            <Text style={[styles.ledgerAmount, entry.amount < 0 && styles.ledgerAmountNegative]}>
              {entry.amount > 0 ? '+' : ''}
              {entry.amount}
            </Text>
          </View>
        ))}
      </View>

      <Pressable onPress={handleReset} style={styles.resetButton}>
        <Ionicons name="refresh-outline" size={15} color={colors.muted} />
        <Text style={styles.resetText}>重置演示数据</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  giftIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
    transform: [{ rotate: '5deg' }],
  },
  balanceCard: {
    minHeight: 170,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 25,
    padding: 22,
    backgroundColor: colors.primaryDark,
  },
  balanceCopy: {
    flex: 1,
    zIndex: 1,
  },
  balanceLabel: {
    color: '#C6D7CB',
    fontSize: 13,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  balanceNumber: {
    color: colors.white,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  balanceHint: {
    marginTop: 10,
    maxWidth: 205,
    color: '#B6CABC',
    fontSize: 11,
    lineHeight: 17,
  },
  plantIllustration: {
    width: 105,
    position: 'relative',
  },
  sun: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1C360',
    top: 6,
    right: 0,
  },
  leafOne: {
    position: 'absolute',
    bottom: 30,
    right: 23,
    transform: [{ rotate: '-18deg' }],
  },
  leafTwo: {
    position: 'absolute',
    bottom: 32,
    right: 49,
    transform: [{ rotate: '35deg' }],
  },
  plantPot: {
    position: 'absolute',
    width: 58,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#D89C63',
    bottom: 2,
    right: 20,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 13,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  messageText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: -8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionHint: {
    color: colors.muted,
    fontSize: 11,
  },
  rewardList: {
    gap: 12,
  },
  rewardCard: {
    padding: 17,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  rewardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  rewardIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  rewardCopy: {
    flex: 1,
    gap: 3,
  },
  rewardName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  rewardDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  rewardProgressTrack: {
    height: 5,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: colors.background,
    marginTop: 15,
  },
  rewardProgress: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  rewardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rewardPoints: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  rewardGap: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
  },
  redeemButton: {
    minWidth: 68,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  redeemDisabled: {
    backgroundColor: colors.background,
  },
  redeemText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  redeemTextDisabled: {
    color: colors.muted,
  },
  pressed: {
    opacity: 0.72,
  },
  ledgerCard: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 14,
  },
  ledgerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ledgerIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  ledgerIconNegative: {
    backgroundColor: colors.accentLight,
  },
  ledgerCopy: {
    flex: 1,
    gap: 3,
  },
  ledgerTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  ledgerDate: {
    color: colors.muted,
    fontSize: 10,
  },
  ledgerAmount: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  ledgerAmountNegative: {
    color: '#A36C31',
  },
  resetButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 8,
  },
  resetText: {
    color: colors.muted,
    fontSize: 11,
  },
});
