import React, { useState, useCallback } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { updateTypeMap, responseStatusMap } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import type { UrgeTask, UrgeParticipant, AuthorResponse } from '@/types';
import styles from './index.module.scss';

const UrgeDetailPage: React.FC = () => {
  const router = useRouter();
  const taskId = router.params.id || '1';

  const task = useAppStore(state => state.urgeTasks.find(t => t.id === taskId)) as UrgeTask;
  const participants = useAppStore(state => state.getUrgeParticipants(taskId));
  const taskResponses = useAppStore(state => state.getResponsesForTask(taskId));
  const { joinUrge } = useAppStore();

  const [commentInput, setCommentInput] = useState('');
  const [showJoinWithComment, setShowJoinWithComment] = useState(false);

  const handleJoin = useCallback(() => {
    if (!task || task.status !== 'active' || task.hasJoined) return;
    const msg = commentInput.trim() || undefined;
    joinUrge(taskId, msg);
    setCommentInput('');
    setShowJoinWithComment(false);
    Taro.showToast({
      title: '已参与催更',
      icon: 'success',
      duration: 1500
    });
  }, [task, taskId, joinUrge, commentInput]);

  if (!task) {
    return null;
  }

  const progressPercent = Math.min(100, Math.round((task.currentCount / task.targetCount) * 100));
  const remaining = task.targetCount - task.currentCount;

  const statusText = () => {
    if (task.status === 'responded') return '✍️ 作者已回应';
    if (task.status === 'completed') return '🎉 目标已达成';
    return `还差 ${remaining} 人达成目标`;
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.taskInfo}>
          <Image className={styles.bookCover} src={task.bookCover} mode="aspectFill" />
          <View className={styles.info}>
            <Text className={styles.bookTitle}>{task.bookTitle}</Text>
            <View className={styles.updateType}>
              <Text className={styles.updateTypeText}>
                催更类型：{updateTypeMap[task.updateType]}
              </Text>
            </View>
            {task.status === 'responded' && (
              <View className={styles.respondedTag}>
                <Text className={styles.respondedTagText}>✍️ 作者已回应</Text>
              </View>
            )}
            <View className={styles.initiator}>
              <Image
                className={styles.initiatorAvatar}
                src={task.initiatorAvatar}
                mode="aspectFill"
              />
              <Text className={styles.initiatorName}>发起者：{task.initiator}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.progressCard}>
          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressLabel}>催更进度</Text>
              <Text className={styles.progressCount}>
                <Text className={styles.progressNum}>{task.currentCount}</Text> / {task.targetCount}人
              </Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={classnames(
                  styles.progressFill,
                  task.status === 'responded' && styles.progressFillResponded,
                  task.status === 'completed' && styles.progressFillCompleted
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <Text className={styles.progressTip}>{statusText()}</Text>
          </View>
        </View>

        <View className={styles.messageCard}>
          <Text className={styles.sectionTitle}>💬 催更话术</Text>
          <Text className={styles.messageText}>{task.message}</Text>
          <View className={styles.deadlineInfo}>
            <Text className={styles.deadlineLabel}>发起时间</Text>
            <Text className={styles.deadlineValue}>{task.createdAt}</Text>
          </View>
          <View className={styles.deadlineInfo} style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
            <Text className={styles.deadlineLabel}>截止时间</Text>
            <Text className={styles.deadlineValue}>{task.deadline}</Text>
          </View>
          {task.bookClubName && (
            <View className={styles.deadlineInfo} style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
              <Text className={styles.deadlineLabel}>来自书友会</Text>
              <Text className={styles.deadlineValue}>{task.bookClubName}</Text>
            </View>
          )}
        </View>

        {taskResponses.length > 0 && (
          <View className={styles.responseCard}>
            <Text className={styles.sectionTitle}>✍️ 作者回应</Text>
            {taskResponses.map(resp => (
              <View key={resp.id} className={styles.responseItem}>
                <View className={styles.responseHeader}>
                  <Image
                    className={styles.responseAvatar}
                    src={resp.authorAvatar}
                    mode="aspectFill"
                  />
                  <View className={styles.responseInfo}>
                    <Text className={styles.responseName}>{resp.authorName}</Text>
                    <Text className={styles.responseTime}>{resp.createdAt}</Text>
                  </View>
                  <View className={classnames(styles.responseStatus, styles[`status_${resp.status}`])}>
                    <Text className={styles.responseStatusText}>{resp.statusText}</Text>
                  </View>
                </View>
                <Text className={styles.responseMessage}>{resp.message}</Text>
              </View>
            ))}
          </View>
        )}

        <View className={styles.participantsCard}>
          <Text className={styles.sectionTitle}>
            👥 参与催更的书友 ({task.currentCount})
          </Text>
          <View className={styles.participantList}>
            {participants.map(p => (
              <View key={p.id} className={styles.participantItem}>
                <Image
                  className={styles.participantAvatar}
                  src={p.userAvatar}
                  mode="aspectFill"
                />
                <View className={styles.participantInfo}>
                  <Text className={styles.participantName}>{p.userName}</Text>
                  {p.message && (
                    <Text className={styles.participantMessage}>{p.message}</Text>
                  )}
                </View>
                <Text className={styles.participantTime}>{p.joinedAt}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        {task.status === 'responded' ? (
          <Button className={styles.respondedBtn} disabled>
            <Text className={styles.respondedBtnText}>✍️ 作者已回应</Text>
          </Button>
        ) : task.status === 'completed' ? (
          <Button className={styles.completedBtn} disabled>
            <Text className={styles.completedBtnText}>🎉 催更已达成</Text>
          </Button>
        ) : task.hasJoined ? (
          <Button className={styles.joinedBtn} disabled>
            <Text className={styles.joinBtnText}>✓ 已参与催更</Text>
          </Button>
        ) : showJoinWithComment ? (
          <View className={styles.joinWithComment}>
            <Input
              className={styles.commentInput}
              type="text"
              value={commentInput}
              onInput={e => setCommentInput(e.detail.value)}
              placeholder="留一句话给作者加油~"
              placeholderTextColor="#A09A94"
            />
            <Button className={styles.joinSubmitBtn} onClick={handleJoin}>
              <Text className={styles.joinBtnText}>参与</Text>
            </Button>
          </View>
        ) : (
          <View className={styles.joinActions}>
            <Button className={styles.joinBtn} onClick={() => setShowJoinWithComment(true)}>
              <Text className={styles.joinBtnText}>💬 留言参与</Text>
            </Button>
            <Button className={styles.joinQuickBtn} onClick={handleJoin}>
              <Text className={styles.joinQuickText}>快速参与</Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default UrgeDetailPage;
