import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyProps {
  text?: string;
  description?: string;
}

const Empty: React.FC<EmptyProps> = ({
  text = '暂无数据',
  description
}) => {
  return (
    <View className={styles.empty}>
      <View className={styles.emptyIcon}>
        <Text className={styles.iconText}>📚</Text>
      </View>
      <Text className={styles.emptyText}>{text}</Text>
      {description && (
        <Text className={styles.emptyDesc}>{description}</Text>
      )}
    </View>
  );
};

export default Empty;
