import React, { useState, useCallback } from 'react';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Empty from '@/components/Empty';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store/useAppStore';
import type { Book } from '@/types';
import styles from './index.module.scss';

const SearchPage: React.FC = () => {
  const { books, toggleShelf } = useAppStore();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const hotKeywords = ['星河彼岸', '长安月', '黎明之剑', '修仙', '科幻', '古风', '美食', '机甲'];

  const searchBooks = (kw: string): Book[] => {
    const lowerKw = kw.toLowerCase();
    return books.filter(
      b => b.title.toLowerCase().includes(lowerKw) ||
           b.author.toLowerCase().includes(lowerKw) ||
           b.category.toLowerCase().includes(lowerKw)
    );
  };

  const handleSearch = useCallback(() => {
    if (!keyword.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const foundBooks = searchBooks(keyword);
    setResults(foundBooks);
    setHasSearched(true);
  }, [keyword, books]);

  const handleKeywordClick = (word: string) => {
    setKeyword(word);
    const foundBooks = searchBooks(word);
    setResults(foundBooks);
    setHasSearched(true);
  };

  const handleAddShelf = (book: Book) => {
    toggleShelf(book.id);
    Taro.showToast({
      title: book.isInShelf ? '已移出书架' : '已加入书架',
      icon: book.isInShelf ? 'none' : 'success'
    });
  };

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/book-detail/index?id=${id}`
    });
  };

  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.searchHeader}>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <View className={styles.searchBar} style={{ flex: 1 }}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              type="text"
              value={keyword}
              placeholder="搜索小说、漫画或作者"
              placeholderTextColor="#A09A94"
              onInput={e => setKeyword(e.detail.value)}
              onConfirm={handleSearch}
              focus
            />
          </View>
          <View className={styles.cancelBtn} onClick={goBack}>
            <Text className={styles.cancelText}>取消</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        {!hasSearched && (
          <View className={styles.hotSearch}>
            <Text className={styles.sectionTitle}>🔥 热门搜索</Text>
            <View className={styles.hotTags}>
              {hotKeywords.map((word, index) => (
                <View
                  key={index}
                  className={styles.hotTag}
                  onClick={() => handleKeywordClick(word)}
                >
                  <Text className={styles.hotTagText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {hasSearched && (
          results.length > 0 ? (
            <View className={styles.results}>
              {results.map(book => (
                <View key={book.id} className={styles.resultItem} onClick={() => goToDetail(book.id)}>
                  <Image
                    className={styles.resultCover}
                    src={book.cover}
                    mode="aspectFill"
                  />
                  <View className={styles.resultInfo}>
                    <View>
                      <Text className={styles.resultTitle}>{book.title}</Text>
                      <Text className={styles.resultAuthor}>{book.author}</Text>
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View className={styles.resultMeta}>
                        <View className={styles.metaItem}>
                          <Text style={{ fontSize: '20rpx' }}>🔥</Text>
                          <Text className={styles.metaText}>{book.commentHeat}</Text>
                        </View>
                        <Tag text={book.category} size="sm" />
                      </View>
                      <Button
                        className={book.isInShelf ? styles.addedBtn : styles.addBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddShelf(book);
                        }}
                      >
                        <Text className={book.isInShelf ? styles.addedBtnText : styles.addBtnText}>
                          {book.isInShelf ? '已加入' : '+ 书架'}
                        </Text>
                      </Button>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.empty}>
              <Empty
                text="没有找到相关作品"
                description="换个关键词试试吧~"
              />
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default SearchPage;
