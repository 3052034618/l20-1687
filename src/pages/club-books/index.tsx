import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import Tag from '@/components/Tag';
import Empty from '@/components/Empty';
import { useAppStore } from '@/store/useAppStore';
import { updateTypeMap, responseStatusMap } from '@/types';
import styles from './index.module.scss';

const ClubBooksPage: React.FC = () => {
  const router = useRouter();
  const clubId = router.params.id || '1';

  const club = useAppStore(state => state.bookClubs.find(c => c.id === clubId));
  const clubBookIds = useAppStore(state => state.clubBooks[clubId] || []);
  const books = useAppStore(state => state.books.filter(b => clubBookIds.includes(b.id)));
  const { getUrgeTasksForBook, responses } = useAppStore();

  const goToBookDetail = (bookId: string) => {
    Taro.navigateTo({ url: `/pages/book-detail/index?id=${bookId}` });
  };

  if (!club) {
    return (
      <View className={styles.page}>
        <Empty text="书友会不存在" />
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Image className={styles.clubAvatar} src={club.avatar} mode="aspectFill" />
        <View className={styles.clubInfo}>
          <Text className={styles.clubName}>{club.name}</Text>
          <Text className={styles.clubDesc}>{club.memberCount}名成员 · {clubBookIds.length}本共追</Text>
        </View>
      </View>

      {books.length > 0 ? (
        <View className={styles.list}>
          {books.map(book => {
            const bookUrgeTasks = getUrgeTasksForBook(book.id);
            const latestUrge = bookUrgeTasks[0];
            const bookResponses = responses.filter(r => r.bookId === book.id);
            const latestResponse = bookResponses[0];

            return (
              <View
                key={book.id}
                className={styles.bookItem}
                onClick={() => goToBookDetail(book.id)}
              >
                <View className={styles.bookMain}>
                  <Image className={styles.bookCover} src={book.cover} mode="aspectFill" />
                  <View className={styles.bookInfo}>
                    <Text className={styles.bookTitle}>{book.title}</Text>
                    <Text className={styles.bookAuthor}>{book.author}</Text>
                    <View className={styles.bookMeta}>
                      <Text className={styles.metaItem}>
                        👥 {book.fanCount}人追更
                      </Text>
                      <Text className={styles.metaDivider}>·</Text>
                      <Text className={styles.metaItem}>
                        📖 第{book.currentChapter}/{book.totalChapters}章
                      </Text>
                    </View>
                  </View>
                </View>

                <View className={styles.bookStatus}>
                  {latestUrge && (
                    <View className={styles.statusRow}>
                      <Tag type="primary" size="sm">
                        {latestUrge.status === 'responded' ? '已回应' :
                         latestUrge.status === 'completed' ? '已达成' :
                         `催更中 ${latestUrge.currentCount}/${latestUrge.targetCount}`}
                      </Tag>
                      <Text className={styles.statusText}>
                        {updateTypeMap[latestUrge.updateType]} · {latestUrge.message.length > 10 ? latestUrge.message.slice(0, 10) + '...' : latestUrge.message}
                      </Text>
                    </View>
                  )}

                  {latestResponse && (
                    <View className={styles.statusRow}>
                      <Tag type="secondary" size="sm">
                        {latestResponse.statusText}
                      </Tag>
                      <Text className={styles.statusText}>
                        {latestResponse.message.length > 12 ? latestResponse.message.slice(0, 12) + '...' : latestResponse.message}
                      </Text>
                    </View>
                  )}

                  {!latestUrge && !latestResponse && (
                    <Text className={styles.noActivity}>暂无催更动态</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Empty text="暂无共追作品" description="在作品详情页可以把书加入共追清单哦~" />
      )}
    </View>
  );
};

export default ClubBooksPage;
