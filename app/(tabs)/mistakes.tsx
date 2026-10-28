import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PageHeader } from '../../src/components/PageHeader';
import { Screen } from '../../src/components/Screen';
import { SubjectBadge } from '../../src/components/SubjectBadge';
import { colors, shadow } from '../../src/constants/theme';
import { useStudyStore } from '../../src/store/useStudyStore';
import { Subject } from '../../src/types';

const subjects: ('全部' | Subject)[] = ['全部', '语文', '数学', '英语'];
const inputSubjects: Subject[] = ['语文', '数学', '英语'];

export default function MistakesScreen() {
  const { questions, addQuestion, toggleQuestion } = useStudyStore();
  const [subject, setSubject] = useState<'全部' | Subject>('全部');
  const [showMastered, setShowMastered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [inputSubject, setInputSubject] = useState<Subject>('数学');
  const [imageUri, setImageUri] = useState<string>();
  const [message, setMessage] = useState('');

  const visibleQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          (subject === '全部' || question.subject === subject) &&
          question.mastered === showMastered,
      ),
    [questions, subject, showMastered],
  );

  const pickImage = async (useCamera: boolean) => {
    if (useCamera && Platform.OS === 'web') {
      Alert.alert('请在手机上拍照', 'Web 预览可以选择相册图片，真机支持直接拍照。');
      return;
    }

    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('需要相机权限', '请在系统设置中允许使用相机后再试。');
        return;
      }
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTitle('');
    setImageUri(undefined);
    setInputSubject('数学');
  };

  const submitQuestion = () => {
    addQuestion({ title, subject: inputSubject, imageUri });
    closeModal();
    setShowMastered(false);
    setSubject('全部');
    setMessage('新题目已放进错题本，记得找个时间攻克它。');
  };

  const handleToggle = (id: string, mastered: boolean) => {
    toggleQuestion(id);
    if (!mastered) setMessage('又消灭一道错题！30 成长值已到账。');
  };

  return (
    <Screen>
      <PageHeader
        eyebrow="MY QUESTION BOOK"
        title="错题变身计划"
        subtitle="错题不是包袱，是下一步要升级的地方。"
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="上传新题目"
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Ionicons name="add" size={27} color={colors.white} />
          </Pressable>
        }
      />

      {message ? (
        <View style={styles.message}>
          <Ionicons name="sparkles" size={18} color={colors.primary} />
          <Text style={styles.messageText}>{message}</Text>
          <Pressable onPress={() => setMessage('')} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.primary} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{questions.filter((q) => !q.mastered).length}</Text>
          <Text style={styles.summaryLabel}>等待攻克</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{questions.filter((q) => q.mastered).length}</Text>
          <Text style={styles.summaryLabel}>已经掌握</Text>
        </View>
        <View style={styles.masteryIcon}>
          <Ionicons name="trending-up" size={26} color={colors.primary} />
        </View>
      </View>

      <View style={styles.filters}>
        {subjects.map((item) => (
          <Pressable
            key={item}
            onPress={() => setSubject(item)}
            style={[styles.filterChip, subject === item && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, subject === item && styles.filterTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.statusTabs}>
        <Pressable
          onPress={() => setShowMastered(false)}
          style={[styles.statusTab, !showMastered && styles.statusTabActive]}
        >
          <Text style={[styles.statusText, !showMastered && styles.statusTextActive]}>待攻克</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowMastered(true)}
          style={[styles.statusTab, showMastered && styles.statusTabActive]}
        >
          <Text style={[styles.statusText, showMastered && styles.statusTextActive]}>已掌握</Text>
        </Pressable>
      </View>

      <View style={styles.questionList}>
        {visibleQuestions.map((question) => (
          <View
            key={question.id}
            style={[styles.questionCard, question.mastered && styles.masteredCard]}
          >
            {question.imageUri ? (
              <Image source={{ uri: question.imageUri }} style={styles.questionImage} />
            ) : (
              <View style={styles.questionPlaceholder}>
                <Ionicons name="document-text-outline" size={26} color={colors.primary} />
              </View>
            )}
            <View style={styles.questionBody}>
              <View style={styles.questionMeta}>
                <SubjectBadge subject={question.subject} />
                <Text style={styles.questionTag}>#{question.tag}</Text>
              </View>
              <Text style={styles.questionTitle}>{question.title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  question.mastered
                    ? `重新复习：${question.title}`
                    : `标记已掌握：${question.title}`
                }
                onPress={() => handleToggle(question.id, question.mastered)}
                style={({ pressed }) => [
                  styles.masterButton,
                  question.mastered && styles.reviewButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={question.mastered ? 'refresh-outline' : 'checkmark-circle-outline'}
                  size={17}
                  color={question.mastered ? colors.muted : colors.primary}
                />
                <Text
                  style={[styles.masterButtonText, question.mastered && styles.reviewButtonText]}
                >
                  {question.mastered ? '放回待复习' : '我掌握了 +30'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
        {visibleQuestions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={34} color={colors.primary} />
            <Text style={styles.emptyTitle}>这里空空如也</Text>
            <Text style={styles.emptyText}>换个筛选条件，或上传一道新题目吧。</Text>
          </View>
        ) : null}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>NEW QUESTION</Text>
                <Text style={styles.modalTitle}>收进错题本</Text>
              </View>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Pressable onPress={() => pickImage(false)} style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.pickedImage} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={30} color={colors.primary} />
                  <Text style={styles.imagePickerTitle}>从相册选择题目照片</Text>
                  <Text style={styles.imagePickerHint}>也可以只输入题目文字</Text>
                </>
              )}
            </Pressable>
            <Pressable onPress={() => pickImage(true)} style={styles.cameraLink}>
              <Ionicons name="camera-outline" size={18} color={colors.primary} />
              <Text style={styles.cameraLinkText}>使用相机拍照</Text>
            </Pressable>

            <Text style={styles.inputLabel}>题目内容</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="例如：解方程 2x + 3 = 11"
              placeholderTextColor="#A1AAA3"
              multiline
              style={styles.textInput}
            />
            <Text style={styles.inputLabel}>选择科目</Text>
            <View style={styles.subjectInputRow}>
              {inputSubjects.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setInputSubject(item)}
                  style={[styles.subjectInput, inputSubject === item && styles.subjectInputActive]}
                >
                  <Text
                    style={[
                      styles.subjectInputText,
                      inputSubject === item && styles.subjectInputTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="保存到错题本"
              disabled={!title.trim() && !imageUri}
              onPress={submitQuestion}
              style={[styles.submitButton, !title.trim() && !imageUri && styles.submitDisabled]}
            >
              <Text style={styles.submitText}>保存到错题本</Text>
              <Ionicons name="arrow-forward" size={19} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 47,
    height: 47,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    ...shadow,
  },
  pressed: {
    opacity: 0.72,
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
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 19,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    gap: 2,
  },
  summaryNumber: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '800',
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  summaryDivider: {
    width: 1,
    height: 37,
    backgroundColor: colors.border,
    marginRight: 20,
  },
  masteryIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: -10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  statusTabs: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#E9EDE6',
    marginBottom: -8,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  statusTabActive: {
    backgroundColor: colors.card,
    ...shadow,
  },
  statusText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextActive: {
    color: colors.text,
    fontWeight: '800',
  },
  questionList: {
    gap: 12,
  },
  questionCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  masteredCard: {
    shadowOpacity: 0,
    elevation: 0,
  },
  questionImage: {
    width: 76,
    height: 92,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
  },
  questionPlaceholder: {
    width: 66,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  questionBody: {
    flex: 1,
    gap: 9,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },
  questionTag: {
    color: colors.muted,
    fontSize: 11,
  },
  questionTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  masterButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
  },
  reviewButton: {
    backgroundColor: colors.background,
  },
  masterButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  reviewButtonText: {
    color: colors.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(25, 38, 30, 0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    maxHeight: '92%',
    padding: 22,
    paddingBottom: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
    gap: 13,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  modalEyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  modalTitle: {
    marginTop: 3,
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  imagePicker: {
    height: 130,
    overflow: 'hidden',
    borderRadius: 17,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#A9BBAE',
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  pickedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePickerTitle: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  imagePickerHint: {
    color: colors.muted,
    fontSize: 11,
  },
  cameraLink: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 3,
  },
  cameraLinkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  textInput: {
    minHeight: 70,
    padding: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  subjectInputRow: {
    flexDirection: 'row',
    gap: 9,
  },
  subjectInput: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectInputActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  subjectInputText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  subjectInputTextActive: {
    color: colors.primaryDark,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
