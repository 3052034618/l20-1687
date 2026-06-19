import React, { useState, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import UrgeCard from '@/components/UrgeCard';
import Empty from '@/components/Empty';
import { mockUrgeTasks } from '@/data/urges';
import type { UrgeTask } from '@/types';
import styles from './index.module.scss';

type TabType = 'active' | 'completed';

const SurgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [tasks, setTasks] = useState<UrgeTask[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setTasks([...mockUrgeTasks]);
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

  const handleJoin = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.hasJoined && task.status === 'active') {
        const newCount = task.currentCount + 1;
        return {
          ...task,
          hasJoined: true,
          currentCount: newCount,
          status: newCount >= task.targetCount ? 'completed' : task.status
        };
      }
      return task;
    }));
    Taro.showToast({
      title: '已参与催更',
      icon: 'success',
      duration: 1500
    });
  };

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/urge-detail/index?id=${id}`
    });
  };

  const handleCreate = () => {
    Taro.showToast({
      title: '发起催更功能',
      icon: 'none'
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'active') {
      return task.status === 'active';
    }
    return task.status === 'completed';
  });

  const activeCount = tasks.filter(t => t.status === 'active').length;

  return (
    <View className={styles.page}>
      {activeTab === 'active' && activeCount > 0 && (
        <View className={styles.hotBanner}>
          <Text className={styles.hotTitle}>🔥 今日热门催更</Text>
          <Text className={styles.hotDesc}>
            正在进行 <Text className={styles.hotCount}>{activeCount}</Text> 场催更活动
            ，快来为你喜欢的作品打call吧！
          </Text>
        </View>
      )}

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'active' && styles.active)}
          onClick={() => setActiveTab('active')}
        >
          <Text className={styles.tabText}>进行中</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'completed' && styles.active)}
          onClick={() => setActiveTab('completed')}
        >
          <Text className={styles.tabText}>已达成</Text>
        </View>
      </View>

      {filteredTasks.length > 0 ? (
        <View className={styles.list}>
          {filteredTasks.map(task => (
            <UrgeCard
              key={task.id}
              task={task}
              onJoin={() => handleJoin(task.id)}
              onClick={() => goToDetail(task.id)}
            />
          ))}
        </View>
      ) : (
        <View className={styles.empty}>
          <Empty
            text={activeTab === 'active' ? '暂无进行中的催更' : '暂无已达成的催更'}
            description="快去发起第一个催更吧~"
          />
        </View>
      )}

      <Button className={styles.createBtn} onClick={handleCreate}>
        <Text className={styles.createBtnIcon}>✏️</Text>
        <Text className={styles.createBtnText}>发起</Text>
      </Button>
    </View>
  );
};

export default SurgePage;
