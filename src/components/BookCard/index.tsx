import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import type { Book } from '@/types';
import styles from './index.module.scss';

interface BookCardProps {
  book: Book;
  showProgress?: boolean;
  onClick?: () => void;
}

const formatHeat = (heat: number): string => {
  if (heat >= 10000) {
    return (heat / 10000).toFixed(1) + 'w';
  }
  if (heat >= 1000) {
    return (heat / 1000).toFixed(1) + 'k';
  }
  return heat.toString();
};

const formatFanCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  }
  return count.toString();
};

const BookCard: React.FC<BookCardProps> = ({
  book,
  showProgress = true,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/book-detail/index?id=${book.id}`
      });
    }
  };

  const progressPercent = Math.round((book.currentChapter / book.totalChapters) * 100);

  const updateStatus = () => {
    if (book.status === 'paused') return 'paused';
    if (book.daysSinceUpdate === 0) return 'today';
    if (book.daysSinceUpdate <= 2) return 'recent';
    if (book.daysSinceUpdate <= 7) return 'normal';
    return 'slow';
  };

  const updateText = () => {
    if (book.status === 'paused') return '暂停更新';
    if (book.daysSinceUpdate === 0) return '今日更新';
    return `${book.daysSinceUpdate}天前更新`;
  };

  const status = updateStatus();

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrap}>
        <Image
          className={styles.cover}
          src={book.cover}
          mode="aspectFill"
        />
        <View className={classnames(styles.updateBadge, styles[status])}>
          <Text className={styles.updateText}>{updateText()}</Text>
        </View>
      </View>
      <View className={styles.info}>
        <Text className={styles.title}>{book.title}</Text>
        <Text className={styles.author}>{book.author}</Text>

        {showProgress && (
          <View className={styles.progressSection}>
            <View className={styles.progressInfo}>
              <Text className={styles.progressText}>
                读到第{book.currentChapter}章
              </Text>
              <Text className={styles.progressPercent}>
                {progressPercent}%
              </Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        )}

        <View className={styles.meta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🔥</Text>
            <Text className={styles.metaText}>{formatHeat(book.commentHeat)}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>👥</Text>
            <Text className={styles.metaText}>{formatFanCount(book.fanCount)}</Text>
          </View>
          <Tag text={book.category} type="default" size="sm" />
        </View>
      </View>
    </View>
  );
};

export default BookCard;
