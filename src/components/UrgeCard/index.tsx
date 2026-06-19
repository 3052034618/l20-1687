import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import ProgressBar from '@/components/ProgressBar';
import type { UrgeTask } from '@/types';
import { updateTypeMap } from '@/types';
import styles from './index.module.scss';

interface UrgeCardProps {
  task: UrgeTask;
  onJoin?: () => void;
  onClick?: () => void;
}

const UrgeCard: React.FC<UrgeCardProps> = ({ task, onJoin, onClick }) => {
  const progressPercent = Math.round((task.currentCount / task.targetCount) * 100);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/urge-detail/index?id=${task.id}`
      });
    }
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin();
    }
  };

  const statusTagType = () => {
    if (task.status === 'completed') return 'success';
    if (task.hasJoined) return 'primary';
    return 'default';
  };

  const statusText = () => {
    if (task.status === 'completed') return '已达成';
    if (task.hasJoined) return '已参与';
    return '催更中';
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.bookInfo}>
          <Image
            className={styles.bookCover}
            src={task.bookCover}
            mode="aspectFill"
          />
          <View className={styles.bookMeta}>
            <Text className={styles.bookTitle}>{task.bookTitle}</Text>
            <View className={styles.tags}>
              <Tag text={updateTypeMap[task.updateType]} type="primary" size="sm" />
              <Tag text={statusText()} type={statusTagType()} size="sm" />
            </View>
          </View>
        </View>
        <View className={styles.initiator}>
          <Image className={styles.initiatorAvatar} src={task.initiatorAvatar} mode="aspectFill" />
          <Text className={styles.initiatorName}>{task.initiator}</Text>
        </View>
      </View>

      <Text className={styles.message}>{task.message}</Text>

      <View className={styles.progressSection}>
        <View className={styles.progressInfo}>
          <Text className={styles.countText}>
            <Text className={styles.currentCount}>{task.currentCount}</Text>
            <Text className={styles.targetCount}> / {task.targetCount}人</Text>
          </Text>
          <Text className={styles.deadline}>截止 {task.deadline}</Text>
        </View>
        <ProgressBar
          percent={progressPercent}
          showText={false}
          size="md"
          color={task.status === 'completed' ? 'success' : 'primary'}
        />
      </View>

      {task.status === 'active' && (
        <View className={styles.actionSection}>
          <Button
            className={classnames(styles.joinBtn, task.hasJoined && styles.joined)}
            onClick={handleJoin}
          >
            <Text className={styles.joinBtnText}>
              {task.hasJoined ? '已参与催更' : '参与催更'}
            </Text>
          </Button>
        </View>
      )}

      {task.bookClubName && (
        <View className={styles.clubInfo}>
          <Text className={styles.clubLabel}>来自书友会：</Text>
          <Text className={styles.clubName}>{task.bookClubName}</Text>
        </View>
      )}
    </View>
  );
};

export default UrgeCard;
