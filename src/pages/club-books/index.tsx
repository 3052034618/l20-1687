import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import Empty from '@/components/Empty';
import { useAppStore } from '@/store/useAppStore';
import { updateTypeMap } from '@/types';
import type { ClubActivity } from '@/types';
import styles from './index.module.scss';

type TabType = 'books' | 'activity';

const typeConfig: Record<ClubActivity['type'], { icon: string; label: string; bgClass: string; }> = {
  add_book: { icon: '📚', label: '加入共追', bgClass: styles.typeAdd },
  urge: { icon: '🔥', label: '发起催更', bgClass: styles.typeUrge },
  urge_complete: { icon: '🎉', label: '催更达成', bgClass: styles.typeComplete },
  author_response: { icon: '✍️', label: '作者回应', bgClass: styles.typeResponse },
  join_member: { icon: '👋', label: '成员加入', bgClass: styles.typeJoin },
  other: { icon: '📢', label: '动态', bgClass: styles.typeOther },
};

const ClubBooksPage: React.FC = () => {
  const router = useRouter();
  const clubId = router.params.id || '1';
  const [tab, setTab] = useState<TabType>('books');

  const club = useAppStore(state => state.bookClubs.find(c => c.id === clubId));
  const clubBookIds = useAppStore(state => state.clubBooks[clubId] || []);
  const books = useAppStore(state => state.books.filter(b => clubBookIds.includes(b.id)));
  const { getUrgeTasksForBook, getClubActivities, getResponsesForBook } = useAppStore();

  const activities = getClubActivities(clubId);

  const goToBookDetail = (bookId: string) => {
    Taro.navigateTo({ url: `/pages/book-detail/index?id=${bookId}` });
  };

  const goToUrgeDetail = (taskId?: string) => {
    if (!taskId) return;
    Taro.navigateTo({ url: `/pages/urge-detail/index?id=${taskId}` });
  };

  const handleActivityClick = (act: ClubActivity) => {
    if (act.urgeTaskId) {
      goToUrgeDetail(act.urgeTaskId);
    } else if (act.bookId) {
      goToBookDetail(act.bookId);
    }
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
          <Text className={styles.clubDesc}>
            {club.memberCount}名成员 · {clubBookIds.length}本共追
          </Text>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, tab === 'books' && styles.tabActive)}
          onClick={() => setTab('books')}
        >
          <Text className={styles.tabText}>📚 共追作品</Text>
          <View className={styles.tabCount}>
            <Text className={styles.tabCountText}>{clubBookIds.length}</Text>
          </View>
        </View>
        <View
          className={classnames(styles.tabItem, tab === 'activity' && styles.tabActive)}
          onClick={() => setTab('activity')}
        >
          <Text className={styles.tabText}>🎞️ 动态时间线</Text>
          <View className={styles.tabCount}>
            <Text className={styles.tabCountText}>{activities.length}</Text>
          </View>
        </View>
      </View>

      {tab === 'books' ? (
        books.length > 0 ? (
          <View className={styles.list}>
            {books.map(book => {
              const bookUrgeTasks = getUrgeTasksForBook(book.id);
              const latestUrge = bookUrgeTasks[0];
              const bookResponses = getResponsesForBook(book.id);
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
                        <Text className={styles.metaItem}>👥 {book.fanCount}人追更</Text>
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
                        <Tag
                          type={latestUrge.status === 'responded' ? 'secondary' : 'primary'}
                          size="sm"
                        >
                          {latestUrge.status === 'responded'
                            ? '已回应'
                            : latestUrge.status === 'completed'
                            ? '已达成'
                            : `催更中 ${latestUrge.currentCount}/${latestUrge.targetCount}`}
                        </Tag>
                        <Text className={styles.statusText}>
                          {updateTypeMap[latestUrge.updateType]} · 点击催更详情
                        </Text>
                      </View>
                    )}

                    {latestResponse && (
                      <View className={styles.statusRow}>
                        <Tag type="success" size="sm">
                          {latestResponse.scope === 'urge_task' ? '催更回应' : '作者公告'}
                        </Tag>
                        <Text className={styles.statusText}>
                          {latestResponse.statusText}：
                          {latestResponse.message.length > 12
                            ? latestResponse.message.slice(0, 12) + '...'
                            : latestResponse.message}
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
        )
      ) : activities.length > 0 ? (
        <View className={styles.timeline}>
          {activities.map(act => {
            const cfg = typeConfig[act.type] || typeConfig.other;
            return (
              <View
                key={act.id}
                className={styles.timelineItem}
                onClick={() => handleActivityClick(act)}
              >
                <View className={styles.timelineLeft}>
                  <View className={classnames(styles.typeIcon, cfg.bgClass)}>
                    <Text className={styles.typeIconText}>{cfg.icon}</Text>
                  </View>
                  <View className={styles.timelineLine} />
                </View>
                <View className={styles.timelineContent}>
                  <View className={styles.timelineHeader}>
                    <View className={classnames(styles.typeLabel, cfg.bgClass)}>
                      <Text className={styles.typeLabelText}>{cfg.label}</Text>
                    </View>
                    <Text className={styles.timelineTime}>{act.createdAt}</Text>
                  </View>
                  <Text className={styles.timelineUser}>
                    <Image
                      className={styles.userAvatar}
                      src={act.userAvatar}
                      mode="aspectFill"
                    />
                    <Text className={styles.userName}>{act.userName}</Text>
                  </Text>
                  <Text className={styles.timelineMsg}>{act.content}</Text>
                  {(act.bookTitle || act.urgeTaskId) && (
                    <View className={styles.assocCard}>
                      {act.bookCover && (
                        <Image
                          className={styles.assocCover}
                          src={act.bookCover}
                          mode="aspectFill"
                        />
                      )}
                      <View className={styles.assocInfo}>
                        {act.bookTitle && (
                          <Text className={styles.assocTitle}>📖 {act.bookTitle}</Text>
                        )}
                        {act.urgeTaskId && (
                          <Text className={styles.assocSub}>👉 点击跳转到催更详情</Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Empty
          text="暂无动态"
          description="加入共追、发起催更后这里会有动态时间线哦~"
        />
      )}
    </View>
  );
};

export default ClubBooksPage;
