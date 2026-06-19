import React, { useState, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import UrgeCard from '@/components/UrgeCard';
import Empty from '@/components/Empty';
import CreateUrgeModal from '@/components/CreateUrgeModal';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

type TabType = 'active' | 'completed' | 'responded';

const SurgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { urgeTasks, joinUrge } = useAppStore();

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

  const handleJoin = (taskId: string) => {
    const task = urgeTasks.find(t => t.id === taskId);
    if (!task || task.hasJoined || task.status !== 'active') return;
    joinUrge(taskId);
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
    setShowCreateModal(true);
  };

  const filteredTasks = urgeTasks.filter(task => {
    if (activeTab === 'active') return task.status === 'active';
    if (activeTab === 'completed') return task.status === 'completed';
    return task.status === 'responded';
  });

  const activeCount = urgeTasks.filter(t => t.status === 'active').length;
  const respondedCount = urgeTasks.filter(t => t.status === 'responded').length;

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
        <View
          className={classnames(styles.tabItem, activeTab === 'responded' && styles.active)}
          onClick={() => setActiveTab('responded')}
        >
          <Text className={styles.tabText}>已回应</Text>
          {respondedCount > 0 && (
            <View className={styles.tabBadge}>
              <Text className={styles.tabBadgeText}>{respondedCount}</Text>
            </View>
          )}
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
            text={activeTab === 'active' ? '暂无进行中的催更' : activeTab === 'responded' ? '暂无已回应的催更' : '暂无已达成的催更'}
            description="快去发起第一个催更吧~"
          />
        </View>
      )}

      <Button className={styles.createBtn} onClick={handleCreate}>
        <Text className={styles.createBtnIcon}>✏️</Text>
        <Text className={styles.createBtnText}>发起</Text>
      </Button>

      <CreateUrgeModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </View>
  );
};

export default SurgePage;
