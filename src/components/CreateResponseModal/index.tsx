import React, { useState } from 'react';
import { View, Text, Button, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import type { ResponseStatus } from '@/types';
import { responseStatusMap } from '@/types';
import styles from './index.module.scss';

interface CreateResponseModalProps {
  visible: boolean;
  onClose: () => void;
}

const statuses: ResponseStatus[] = ['writing', 'tonight', 'leave', 'thank'];

const CreateResponseModal: React.FC<CreateResponseModalProps> = ({ visible, onClose }) => {
  const { books, createResponse, getShelfBooks } = useAppStore();
  
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ResponseStatus>('writing');
  const [message, setMessage] = useState('');

  const shelfBooks = getShelfBooks();

  const handleSubmit = () => {
    if (!selectedBook) {
      Taro.showToast({ title: '请选择作品', icon: 'none' });
      return;
    }
    if (!message.trim()) {
      Taro.showToast({ title: '请输入回应内容', icon: 'none' });
      return;
    }

    const book = books.find(b => b.id === selectedBook);
    if (!book) return;

    createResponse({
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.cover,
      authorName: '作者大大',
      authorAvatar: 'https://picsum.photos/id/1005/200/200',
      status: selectedStatus,
      statusText: responseStatusMap[selectedStatus],
      message: message.trim()
    });

    Taro.showToast({ title: '回应已发布', icon: 'success' });
    handleClose();
  };

  const handleClose = () => {
    setSelectedBook('');
    setSelectedStatus('writing');
    setMessage('');
    onClose();
  };

  if (!visible) return null;

  return (
    <View className={styles.mask} onClick={handleClose}>
      <View className={styles.modal} onClick={e => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>发布作者回应</Text>
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
            <Text className={styles.label}>回应状态</Text>
            <View className={styles.statusList}>
              {statuses.map(status => (
                <View
                  key={status}
                  className={classnames(styles.statusItem, selectedStatus === status && styles.selectedStatus)}
                  onClick={() => setSelectedStatus(status)}
                >
                  <Text className={styles.statusEmoji}>
                    {status === 'writing' && '✍️'}
                    {status === 'tonight' && '🌙'}
                    {status === 'leave' && '🤒'}
                    {status === 'thank' && '❤️'}
                  </Text>
                  <Text className={styles.statusText}>{responseStatusMap[status]}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>回应内容</Text>
            <Input
              className={styles.input}
              type="text"
              value={message}
              onInput={e => setMessage(e.detail.value)}
              placeholder="输入回应内容..."
              placeholderTextColor="#A09A94"
            />
          </View>

          <View className={styles.tipSection}>
            <Text className={styles.tipText}>💡 小贴士：温和的回应可以让读者更有耐心等待哦~</Text>
          </View>
        </ScrollView>

        <View className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={handleClose}>
            <Text className={styles.cancelText}>取消</Text>
          </Button>
          <Button className={styles.submitBtn} onClick={handleSubmit}>
            <Text className={styles.submitText}>发布回应</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CreateResponseModal;
