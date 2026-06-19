import React, { useState, useCallback } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import SelectClubModal from '@/components/SelectClubModal';
import { useAppStore } from '@/store/useAppStore';
import type { Book } from '@/types';
import styles from './index.module.scss';

const BookDetailPage: React.FC = () => {
  const router = useRouter();
  const bookId = router.params.id || '1';
  const book = useAppStore(state => state.books.find(b => b.id === bookId)) as Book;
  const { toggleShelf, updateChapter, getResponsesForBook, getUrgeTasksForBook } = useAppStore();

  const [currentChapter, setCurrentChapter] = useState(book?.currentChapter || 1);
  const [showClubModal, setShowClubModal] = useState(false);

  const bookResponses = getResponsesForBook(bookId);
  const bookUrgeTasks = getUrgeTasksForBook(bookId);
  const activeUrge = bookUrgeTasks.find(t => t.status === 'active')
    || bookUrgeTasks.find(t => t.status === 'responded');

  const handleChapterChange = (delta: number) => {
    if (!book) return;
    const newChapter = Math.min(book.totalChapters, Math.max(1, currentChapter + delta));
    setCurrentChapter(newChapter);
    updateChapter(bookId, newChapter);
  };

  const handleToggleShelf = () => {
    toggleShelf(bookId);
    Taro.showToast({
      title: book?.isInShelf ? '已移出书架' : '已加入书架',
      icon: book?.isInShelf ? 'none' : 'success'
    });
  };

  const handleUrge = () => {
    Taro.switchTab({ url: '/pages/surge/index' });
    Taro.showToast({
      title: '去催更广场发起',
      icon: 'none'
    });
  };

  const handleJoinClub = () => {
    if (!book?.isInShelf) {
      Taro.showToast({
        title: '请先将作品加入书架',
        icon: 'none'
      });
      return;
    }
    setShowClubModal(true);
  };

  const goToUrgeDetail = (taskId: string) => {
    Taro.navigateTo({ url: `/pages/urge-detail/index?id=${taskId}` });
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  if (!book) {
    return null;
  }

  const progressPercent = Math.round((currentChapter / book.totalChapters) * 100);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.bookInfo}>
          <Image className={styles.cover} src={book.cover} mode="aspectFill" />
          <View className={styles.info}>
            <View>
              <Text className={styles.title}>{book.title}</Text>
              <Text className={styles.author}>作者：{book.author}</Text>
              <View className={styles.tags}>
                <Tag text={book.category} type="default" size="sm" />
                <Tag text={book.status === 'ongoing' ? '连载中' : book.status === 'paused' ? '暂停' : '已完结'} type={book.status === 'ongoing' ? 'primary' : 'warning'} size="sm" />
              </View>
            </View>
            <View className={styles.stats}>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{formatNumber(book.fanCount)}</Text>
                <Text className={styles.statLabel}>书友</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{formatNumber(book.commentHeat)}</Text>
                <Text className={styles.statLabel}>热度</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{book.totalChapters}</Text>
                <Text className={styles.statLabel}>章节</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionTitleIcon}>📖</Text>
            作品简介
          </Text>
          <Text className={styles.desc}>{book.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionTitleIcon}>📚</Text>
            阅读进度
          </Text>

          <View className={styles.updateInfo}>
            <Text className={styles.updateText}>最新：{book.latestChapter}</Text>
            <Text className={styles.updateTime}>{book.daysSinceUpdate}天前更新</Text>
          </View>

          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressLabel}>阅读进度</Text>
              <Text className={styles.progressValue}>{progressPercent}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </View>

            <View className={styles.chapterSelect}>
              <Button
                className={styles.selectBtn}
                onClick={() => handleChapterChange(-1)}
                disabled={currentChapter <= 1}
              >
                <Text>－</Text>
              </Button>
              <View className={styles.chapterInfo}>
                <Text className={styles.chapterText}>第 {currentChapter} 章</Text>
                <Text className={styles.chapterTotal}>共 {book.totalChapters} 章</Text>
              </View>
              <Button
                className={styles.selectBtn}
                onClick={() => handleChapterChange(1)}
                disabled={currentChapter >= book.totalChapters}
              >
                <Text>＋</Text>
              </Button>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionTitleIcon}>💬</Text>
            互动
          </Text>
          <View className={styles.urgeSection}>
            <Button className={styles.urgeBtn} onClick={handleUrge}>
              <Text className={styles.urgeBtnText}>发起催更</Text>
            </Button>
            <Button className={styles.clubBtn} onClick={handleJoinClub}>
              <Text className={styles.clubBtnText}>加入书友会</Text>
            </Button>
          </View>
          {activeUrge && (
            <View className={styles.activeUrgeCard} onClick={() => goToUrgeDetail(activeUrge.id)}>
              <View className={styles.urgeCardLeft}>
                <View className={styles.urgeProgressWrap}>
                  <View className={styles.urgeProgressBar}>
                    <View
                      className={classnames(
                        styles.urgeProgressFill,
                        activeUrge.status === 'responded' && styles.fillResponded
                      )}
                      style={{ width: `${Math.min(100, Math.round((activeUrge.currentCount / activeUrge.targetCount) * 100))}%` }}
                    />
                  </View>
                  <Text className={styles.urgeProgressText}>
                    {activeUrge.status === 'responded' ? '已回应' : `${activeUrge.currentCount}/${activeUrge.targetCount}`}
                  </Text>
                </View>
              </View>
              <View className={styles.urgeCardRight}>
                <Text className={styles.urgeCardMsg}>
                  {activeUrge.message.length > 20 ? activeUrge.message.slice(0, 20) + '...' : activeUrge.message}
                </Text>
                <Text className={styles.urgeCardArrow}>查看催更详情 →</Text>
              </View>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionTitleIcon}>✍️</Text>
              作者动态
            </Text>
            {bookResponses.length > 0 && (
              <View className={styles.sectionCount}>
                <Text className={styles.sectionCountText}>{bookResponses.length}</Text>
              </View>
            )}
          </View>

          {bookResponses.length > 0 ? (
            <View className={styles.responseList}>
              {bookResponses.map(resp => (
                <View key={resp.id} className={styles.responseItem}>
                  <View className={styles.responseHeader}>
                    <Image
                      className={styles.responseAvatar}
                      src={resp.authorAvatar}
                      mode="aspectFill"
                    />
                    <View className={styles.responseMeta}>
                      <View className={styles.responseTopRow}>
                        <Text className={styles.responseName}>{resp.authorName}</Text>
                        <View
                          className={classnames(
                            styles.scopeTag,
                            resp.scope === 'urge_task' ? styles.scopeUrge : styles.scopeGeneral
                          )}
                        >
                          <Text className={styles.scopeTagText}>
                            {resp.scope === 'urge_task' ? '催更回应' : '作者公告'}
                          </Text>
                        </View>
                      </View>
                      <Text className={styles.responseTime}>{resp.createdAt}</Text>
                    </View>
                    <View
                      className={classnames(
                        styles.responseStatus,
                        styles[`status_${resp.status}`]
                      )}
                    >
                      <Text className={styles.responseStatusText}>{resp.statusText}</Text>
                    </View>
                  </View>
                  <Text className={styles.responseContent}>{resp.message}</Text>
                  {resp.scope === 'urge_task' && resp.urgeTaskId && (
                    <View
                      className={styles.assocUrge}
                      onClick={() => goToUrgeDetail(resp.urgeTaskId as string)}
                    >
                      <Text className={styles.assocUrgeText}>
                        🎯 关联催更任务 · 点击查看催更详情 →
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyResponse}>
              <Text className={styles.emptyResponseIcon}>💭</Text>
              <Text className={styles.emptyResponseText}>暂无作者动态</Text>
              <Text className={styles.emptyResponseDesc}>关注作者或加入催更，第一时间获取更新</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.shelfBtn, book?.isInShelf ? styles.inShelf : styles.addShelf)}
          onClick={handleToggleShelf}
        >
          <Text className={styles.shelfBtnText}>
            {book?.isInShelf ? '✓ 已在书架' : '+ 加入书架'}
          </Text>
        </Button>
      </View>

      <SelectClubModal
        visible={showClubModal}
        bookId={bookId}
        onClose={() => setShowClubModal(false)}
      />
    </View>
  );
};

export default BookDetailPage;
