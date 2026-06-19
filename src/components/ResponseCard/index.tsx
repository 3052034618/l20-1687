import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import type { AuthorResponse } from '@/types';
import styles from './index.module.scss';

interface ResponseCardProps {
  response: AuthorResponse;
  onClick?: () => void;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ response, onClick }) => {
  const statusTagType = (): 'primary' | 'success' | 'warning' | 'secondary' => {
    switch (response.status) {
      case 'tonight': return 'success';
      case 'writing': return 'primary';
      case 'leave': return 'warning';
      case 'thank': return 'secondary';
      default: return 'default';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <View
      className={classnames(styles.card, !response.isRead && styles.unread)}
      onClick={handleClick}
    >
      {!response.isRead && <View className={styles.unreadDot} />}

      <View className={styles.header}>
        <View className={styles.authorInfo}>
          <Image
            className={styles.authorAvatar}
            src={response.authorAvatar}
            mode="aspectFill"
          />
          <View className={styles.authorMeta}>
            <Text className={styles.authorName}>{response.authorName}</Text>
            <Text className={styles.bookName}>《{response.bookTitle}》</Text>
          </View>
        </View>
        <Tag text={response.statusText} type={statusTagType()} size="sm" />
      </View>

      <View className={styles.message}>
        <Text className={styles.messageText}>{response.message}</Text>
      </View>

      <View className={styles.footer}>
        <Image
          className={styles.bookCover}
          src={response.bookCover}
          mode="aspectFill"
        />
        <Text className={styles.time}>{response.createdAt}</Text>
      </View>
    </View>
  );
};

export default ResponseCard;
