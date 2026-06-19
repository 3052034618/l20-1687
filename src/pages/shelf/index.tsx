import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import BookCard from '@/components/BookCard';
import Empty from '@/components/Empty';
import { getShelfBooks } from '@/data/books';
import { getJoinedBookClubs } from '@/data/bookclubs';
import type { Book, BookClub } from '@/types';
import styles from './index.module.scss';

const ShelfPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookClubs, setBookClubs] = useState<BookClub[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setBooks(getShelfBooks());
      setBookClubs(getJoinedBookClubs());
      setLoading(false);
      Taro.stopPullDownRefresh();
    }, 300);
  }, []);

  useDidShow(() => {
    loadData();
  });

  usePullDownRefresh(() => {
    loadData();
  });

  const goToSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  };

  const goToBookDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/book-detail/index?id=${id}`
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.greeting}>
          <Text className={styles.greetingText}>早上好，读书人</Text>
          <Text className={styles.subGreeting}>今天也要好好追更呀~</Text>
        </View>
        <View className={styles.searchBar} onClick={goToSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索小说、漫画或作者</Text>
        </View>
      </View>

      {bookClubs.length > 0 && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>书友会共追</Text>
            <Text className={styles.sectionMore}>查看全部 {'>'}</Text>
          </View>
          <ScrollView scrollX className={styles.clubScroll} enhanced showScrollbar={false}>
            {bookClubs.map(club => (
              <View key={club.id} className={styles.clubCard}>
                <View className={styles.clubHeader}>
                  <Image
                    className={styles.clubAvatar}
                    src={club.avatar}
                    mode="aspectFill"
                  />
                  <View className={styles.clubInfo}>
                    <Text className={styles.clubName}>{club.name}</Text>
                    <Text className={styles.clubCount}>{club.memberCount}人 · {club.bookCount}本书</Text>
                  </View>
                </View>
                <View className={styles.clubBooks}>
                  {books.slice(0, 3).map(book => (
                    <Image
                      key={book.id}
                      className={styles.clubBookCover}
                      src={book.cover}
                      mode="aspectFill"
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的书架</Text>
          <Text className={styles.sectionMore}>{books.length}本</Text>
        </View>
        {books.length > 0 ? (
          <View className={styles.bookList}>
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => goToBookDetail(book.id)}
              />
            ))}
          </View>
        ) : (
          <Empty
            text="书架还是空的"
            description="去搜索你喜欢的作品吧~"
          />
        )}
      </View>
    </View>
  );
};

export default ShelfPage;
