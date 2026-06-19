import React, { useState, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import ResponseCard from '@/components/ResponseCard';
import Empty from '@/components/Empty';
import { mockResponses } from '@/data/responses';
import type { AuthorResponse } from '@/types';
import styles from './index.module.scss';

type TabType = 'response' | 'system';

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('response');
  const [responses, setResponses] = useState<AuthorResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setResponses([...mockResponses]);
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

  const unreadCount = responses.filter(r => !r.isRead).length;

  const handleResponseClick = (id: string) => {
    setResponses(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, isRead: true };
      }
      return r;
    }));
  };

  const handleMarkAll = () => {
    setResponses(prev => prev.map(r => ({ ...r, isRead: true })));
    Taro.showToast({
      title: '已全部标为已读',
      icon: 'success'
    });
  };

  const systemMessages = [
    {
      id: 's1',
      icon: '🎉',
      title: '恭喜加入长安月官方书友会',
      desc: '欢迎加入墨白大大的书友会，一起追更、讨论剧情~',
      time: '2026-06-19 10:00'
    },
    {
      id: 's2',
      icon: '📚',
      title: '催更任务已达成',
      desc: '《黎明之剑》催更任务已达成，快去看看作者有没有回应吧~',
      time: '2026-06-18 15:30'
    },
    {
      id: 's3',
      icon: '💬',
      title: '有新的共追清单',
      desc: '星河彼岸读者群新增了共追作品，快来看看吧~',
      time: '2026-06-17 09:00'
    }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'response' && styles.active)}
          onClick={() => setActiveTab('response')}
        >
          <Text className={styles.tabText}>作者回应</Text>
          {unreadCount > 0 && activeTab !== 'response' && (
            <View className={styles.badge}>
              <Text className={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'system' && styles.active)}
          onClick={() => setActiveTab('system')}
        >
          <Text className={styles.tabText}>系统通知</Text>
        </View>
      </View>

      {activeTab === 'response' && (
        <>
          {responses.length > 0 && (
            <View className={styles.markAll} onClick={handleMarkAll}>
              <Text className={styles.markAllText}>全部标为已读</Text>
            </View>
          )}
          {responses.length > 0 ? (
            <View className={styles.list}>
              {responses.map(response => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  onClick={() => handleResponseClick(response.id)}
                />
              ))}
            </View>
          ) : (
            <View className={styles.empty}>
              <Empty
                text="暂无作者回应"
                description="参与催更后等待作者回复吧~"
              />
            </View>
          )}
        </>
      )}

      {activeTab === 'system' && (
        <View className={styles.list}>
          <Text className={styles.sectionTitle}>今天</Text>
          {systemMessages.map(item => (
            <View key={item.id} className={styles.systemItem}>
              <View className={styles.systemIcon}>
                <Text className={styles.systemIconText}>{item.icon}</Text>
              </View>
              <View className={styles.systemContent}>
                <Text className={styles.systemTitle}>{item.title}</Text>
                <Text className={styles.systemDesc}>{item.desc}</Text>
                <Text className={styles.systemTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default MessagePage;
