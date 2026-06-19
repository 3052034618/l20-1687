import React, { useState, useCallback } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { getUrgeParticipants } from '@/data/urges';
import { updateTypeMap } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import type { UrgeTask, UrgeParticipant } from '@/types';
import styles from './index.module.scss';

const UrgeDetailPage: React.FC = () => {
  const router = useRouter();
  const taskId = router.params.id || '1';

  const task = useAppStore(state => state.urgeTasks.find(t => t.id === taskId)) as UrgeTask;
  const { joinUrge } = useAppStore();
  const [participants, setParticipants] = useState<UrgeParticipant[]>([]);

  React.useEffect(() => {
    setParticipants(getUrgeParticipants(taskId));
  }, [taskId]);

  const handleJoin = useCallback(() => {
    if (!task || task.status !== 'active' || task.hasJoined) return;
    joinUrge(taskId);
    Taro.showToast({
      title: '已参与催更',
      icon: 'success',
      duration: 1500
    });
  }, [task, taskId, joinUrge]);

  if (!task) {
    return null;
  }

  const progressPercent = Math.round((task.currentCount / task.targetCount) * 100);
  const remaining = task.targetCount - task.currentCount;

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
                <Text>{task.currentCount}</Text> / {task.targetCount}人
              </Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <Text className={styles.progressTip}>
              {task.status === 'completed'
                ? '🎉 催更目标已达成！'
                : `还差 ${remaining} 人达成目标`}
            </Text>
          </View>
        </View>

        <View className={styles.messageCard}>
          <Text className={styles.sectionTitle}>💬 催更留言</Text>
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

        <View className={styles.participantsCard}>
          <Text className={styles.sectionTitle}>
            👥 参与催更的书友 ({participants.length})
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
        {task.status === 'completed' ? (
          <Button className={styles.completedBtn} disabled>
            <Text className={styles.completedBtnText}>🎉 催更已达成</Text>
          </Button>
        ) : (
          <Button
            className={task.hasJoined ? styles.joinedBtn : styles.joinBtn}
            onClick={handleJoin}
          >
            <Text className={styles.joinBtnText}>
              {task.hasJoined ? '✓ 已参与催更' : '参与催更'}
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default UrgeDetailPage;
