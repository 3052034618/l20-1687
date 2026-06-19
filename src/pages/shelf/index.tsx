import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import BookCard from '@/components/BookCard';
import Empty from '@/components/Empty';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const ShelfPage: React.FC = () => {
  const { getShelfBooks, getJoinedClubs, getClubBooks } = useAppStore();
  const shelfBooks = useAppStore(state => state.books.filter(b => b.isInShelf));
  const bookClubs = useAppStore(state => state.bookClubs.filter(c => c.isJoined));
  const clubBooksMap = useAppStore(state => state.clubBooks);

  const [loading, setLoading] = React.useState(false);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Taro.stopPullDownRefresh();
    }, 300);
  }, []);

  usePullDownRefresh(() => {
    handleRefresh();
  });

  const getClubBooksCount = (clubId: string) => {
    return (clubBooksMap[clubId] || []).length;
  };

  const goToSearch = () => {
    Taro.navigateTo({ url: '/pages/search/index' });
  };

  const goToBookDetail = (bookId: string) => {
    Taro.navigateTo({ url: `/pages/book-detail/index?id=${bookId}` });
  };

  const goToClubBooks = (clubId: string) => {
    Taro.navigateTo({ url: `/pages/club-books/index?id=${clubId}` });
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
              <View key={club.id} className={styles.clubCard} onClick={() => goToClubBooks(club.id)}>
                <View className={styles.clubHeader}>
                  <Image
                    className={styles.clubAvatar}
                    src={club.avatar}
                    mode="aspectFill"
                  />
                  <View className={styles.clubInfo}>
                    <Text className={styles.clubName}>{club.name}</Text>
                    <Text className={styles.clubCount}>{club.memberCount}人 · {getClubBooksCount(club.id)}本书</Text>
                  </View>
                </View>
                <View className={styles.clubBooks}>
                  {getClubBooks(club.id).slice(0, 3).map(book => (
                    <Image
                      key={book.id}
                      className={styles.clubBookCover}
                      src={book.cover}
                      mode="aspectFill"
                    />
                  ))}
                  {getClubBooks(club.id).length === 0 && (
                    <View className={styles.clubBooksEmpty}>
                      <Text className={styles.clubBooksEmptyText}>暂无共追作品</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的书架</Text>
          <Text className={styles.sectionMore}>{shelfBooks.length}本</Text>
        </View>
        {shelfBooks.length > 0 ? (
          <View className={styles.bookList}>
            {shelfBooks.map(book => (
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
