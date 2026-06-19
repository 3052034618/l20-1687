import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getJoinedBookClubs } from '@/data/bookclubs';
import { getShelfBooks } from '@/data/books';
import type { BookClub } from '@/types';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const [bookClubs, setBookClubs] = useState<BookClub[]>([]);

  const loadData = useCallback(() => {
    setBookClubs(getJoinedBookClubs());
  }, []);

  useDidShow(() => {
    loadData();
  });

  const shelfBooks = getShelfBooks();

  const menuItems = [
    { icon: '📝', title: '我的催更记录', key: 'urge-record' },
    { icon: '❤️', title: '我的收藏', key: 'favorite' },
    { icon: '⏰', title: '更新提醒设置', key: 'reminder' },
    { icon: '⚙️', title: '设置', key: 'settings' },
    { icon: '💬', title: '意见反馈', key: 'feedback' },
    { icon: 'ℹ️', title: '关于我们', key: 'about' },
  ];

  const handleMenuClick = (key: string) => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image
            className={styles.avatar}
            src="https://picsum.photos/id/64/200/200"
            mode="aspectFill"
          />
          <View className={styles.userMeta}>
            <Text className={styles.userName}>追更小能手</Text>
            <Text className={styles.userDesc}>已加入 {bookClubs.length} 个书友会</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{shelfBooks.length}</Text>
          <Text className={styles.statLabel}>追更中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>5</Text>
          <Text className={styles.statLabel}>催更次数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>2</Text>
          <Text className={styles.statLabel}>达成催更</Text>
        </View>
      </View>

      {bookClubs.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>我的书友会</Text>
          <ScrollView scrollX className={styles.clubScroll} enhanced showScrollbar={false}>
            {bookClubs.map(club => (
              <View key={club.id} className={styles.clubItem}>
                <Image
                  className={styles.clubAvatar}
                  src={club.avatar}
                  mode="aspectFill"
                />
                <Text className={styles.clubName}>{club.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>常用功能</Text>
        <View className={styles.menuList}>
          {menuItems.map(item => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.key)}
            >
              <View className={styles.menuIcon}>
                <Text className={styles.menuIconText}>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text className={styles.menuArrow}>{'>'}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MinePage;
