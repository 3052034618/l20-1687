import React, { useState } from 'react';
import { View, Text, Button, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import type { UpdateType } from '@/types';
import { updateTypeMap } from '@/types';
import styles from './index.module.scss';

interface CreateUrgeModalProps {
  visible: boolean;
  onClose: () => void;
}

const updateTypes: UpdateType[] = ['chapter', 'extra', 'ending', 'illustration'];

const presetMessages = [
  '太太写得太好看了！求更新~',
  '剧情太精彩了，催更催更！',
  '每天都在等更新，太太加油！',
  '期待接下来的剧情发展~',
  '这么好的作品不能断更呀！'
];

const CreateUrgeModal: React.FC<CreateUrgeModalProps> = ({ visible, onClose }) => {
  const { books, createUrgeTask, getShelfBooks } = useAppStore();
  
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedType, setSelectedType] = useState<UpdateType>('chapter');
  const [message, setMessage] = useState('');
  const [targetCount, setTargetCount] = useState('100');
  const [deadline, setDeadline] = useState('');

  const shelfBooks = getShelfBooks();

  const handleSelectPreset = (text: string) => {
    setMessage(text);
  };

  const handleSubmit = () => {
    if (!selectedBook) {
      Taro.showToast({ title: '请选择作品', icon: 'none' });
      return;
    }
    if (!message.trim()) {
      Taro.showToast({ title: '请输入催更话术', icon: 'none' });
      return;
    }
    if (!targetCount || parseInt(targetCount) <= 0) {
      Taro.showToast({ title: '请输入目标人数', icon: 'none' });
      return;
    }

    const book = books.find(b => b.id === selectedBook);
    if (!book) return;

    createUrgeTask({
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.cover,
      initiator: '管理员',
      initiatorAvatar: 'https://picsum.photos/id/1005/200/200',
      updateType: selectedType,
      targetCount: parseInt(targetCount),
      message: message.trim(),
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    Taro.showToast({ title: '催更任务已发布', icon: 'success' });
    handleClose();
  };

  const handleClose = () => {
    setSelectedBook('');
    setSelectedType('chapter');
    setMessage('');
    setTargetCount('100');
    setDeadline('');
    onClose();
  };

  if (!visible) return null;

  return (
    <View className={styles.mask} onClick={handleClose}>
      <View className={styles.modal} onClick={e => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>发起催更</Text>
          <View className={styles.closeBtn} onClick={handleClose}>
            <Text>✕</Text>
          </View>
        </View>

        <ScrollView scrollY className={styles.content}>
          <View className={styles.section}>
            <Text className={styles.label}>选择作品</Text>
            <ScrollView scrollX className={styles.bookList} enhanced showScrollbar={false}>
              {shelfBooks.map(book => (
                <View
                  key={book.id}
                  className={classnames(styles.bookItem, selectedBook === book.id && styles.selected)}
                  onClick={() => setSelectedBook(book.id)}
                >
                  <View className={styles.bookCoverWrap}>
                    <Text className={styles.checkIcon}>{selectedBook === book.id ? '✓' : ''}</Text>
                  </View>
                  <Image
                    className={styles.bookCover}
                    src={book.cover}
                    mode="aspectFill"
                  />
                  <Text className={styles.bookName}>{book.title}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>期望更新类型</Text>
            <View className={styles.typeList}>
              {updateTypes.map(type => (
                <View
                  key={type}
                  className={classnames(styles.typeItem, selectedType === type && styles.selectedType)}
                  onClick={() => setSelectedType(type)}
                >
                  <Text className={styles.typeText}>{updateTypeMap[type]}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>催更话术</Text>
            <Input
              className={styles.input}
              type="text"
              value={message}
              onInput={e => setMessage(e.detail.value)}
              placeholder="输入温和的催更话语..."
              placeholderTextColor="#A09A94"
            />
            <Text className={styles.presetLabel}>快捷话术：</Text>
            <View className={styles.presetList}>
              {presetMessages.map((text, index) => (
                <View
                  key={index}
                  className={classnames(styles.presetItem, message === text && styles.selectedPreset)}
                  onClick={() => handleSelectPreset(text)}
                >
                  <Text className={styles.presetText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>目标参与人数</Text>
            <Input
              className={styles.input}
              type="number"
              value={targetCount}
              onInput={e => setTargetCount(e.detail.value)}
              placeholder="输入目标人数"
              placeholderTextColor="#A09A94"
            />
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>截止日期（可选）</Text>
            <Input
              className={styles.input}
              type="text"
              value={deadline}
              onInput={e => setDeadline(e.detail.value)}
              placeholder="例如：2026-06-30"
              placeholderTextColor="#A09A94"
            />
          </View>
        </ScrollView>

        <View className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={handleClose}>
            <Text className={styles.cancelText}>取消</Text>
          </Button>
          <Button className={styles.submitBtn} onClick={handleSubmit}>
            <Text className={styles.submitText}>发布催更</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CreateUrgeModal;
