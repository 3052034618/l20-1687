import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

interface SelectClubModalProps {
  visible: boolean;
  bookId: string;
  onClose: () => void;
}

const SelectClubModal: React.FC<SelectClubModalProps> = ({ visible, bookId, onClose }) => {
  const { getJoinedClubs, addBookToClub, clubBooks } = useAppStore();
  const joinedClubs = getJoinedClubs();

  const isBookInClub = (clubId: string) => {
    return (clubBooks[clubId] || []).includes(bookId);
  };

  const handleSelect = (clubId: string, clubName: string) => {
    if (isBookInClub(clubId)) {
      Taro.showToast({ title: '已在该书友会共追清单中', icon: 'none' });
      return;
    }
    addBookToClub(bookId, clubId);
    Taro.showToast({ title: `已加入「${clubName}」共追清单`, icon: 'success' });
    onClose();
  };

  if (!visible) return null;

  return (
    <View className={styles.mask} onClick={onClose}>
      <View className={styles.modal} onClick={e => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>选择书友会</Text>
          <View className={styles.closeBtn} onClick={onClose}>
            <Text>✕</Text>
          </View>
        </View>

        <View className={styles.tip}>
          <Text className={styles.tipText}>将这本书加入哪个书友会的共追清单？</Text>
        </View>

        <View className={styles.clubList}>
          {joinedClubs.length > 0 ? (
            joinedClubs.map(club => (
              <View
                key={club.id}
                className={classnames(styles.clubItem, isBookInClub(club.id) && styles.disabled)}
                onClick={() => handleSelect(club.id, club.name)}
              >
                <Image
                  className={styles.clubAvatar}
                  src={club.avatar}
                  mode="aspectFill"
                />
                <View className={styles.clubInfo}>
                  <Text className={styles.clubName}>{club.name}</Text>
                  <Text className={styles.clubDesc}>
                    {club.memberCount}名成员 · {club.bookCount}本共追
                  </Text>
                </View>
                {isBookInClub(club.id) ? (
                  <View className={styles.addedTag}>
                    <Text className={styles.addedText}>已加入</Text>
                  </View>
                ) : (
                  <View className={styles.arrow}>
                    <Text>{'>'}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className={styles.empty}>
              <Text className={styles.emptyText}>还没有加入任何书友会</Text>
              <Text className={styles.emptyDesc}>快去首页加入书友会吧~</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SelectClubModal;
