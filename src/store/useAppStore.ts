import { create } from 'zustand';
import type { Book, UrgeTask, AuthorResponse, BookClub } from '@/types';
import { mockBooks, mockUrgeTasks, mockResponses, mockBookClubs } from '@/data';

interface AppState {
  books: Book[];
  urgeTasks: UrgeTask[];
  responses: AuthorResponse[];
  bookClubs: BookClub[];
  clubBooks: Record<string, string[]>;

  toggleShelf: (bookId: string) => void;
  updateChapter: (bookId: string, chapter: number) => void;
  addBookToClub: (bookId: string, clubId: string) => void;
  joinUrge: (taskId: string) => void;
  createUrgeTask: (task: Omit<UrgeTask, 'id' | 'currentCount' | 'status' | 'hasJoined' | 'createdAt'>) => void;
  createResponse: (response: Omit<AuthorResponse, 'id' | 'createdAt' | 'isRead'>) => void;
  markResponseRead: (responseId: string) => void;
  markAllResponsesRead: () => void;
  getBookById: (bookId: string) => Book | undefined;
  getShelfBooks: () => Book[];
  getClubBooks: (clubId: string) => Book[];
  getJoinedClubs: () => BookClub[];
}

export const useAppStore = create<AppState>((set, get) => ({
  books: [...mockBooks],
  urgeTasks: [...mockUrgeTasks],
  responses: [...mockResponses],
  bookClubs: [...mockBookClubs],
  clubBooks: {
    '1': ['2'],
    '2': ['1']
  },

  toggleShelf: (bookId: string) => {
    console.log('[Store] toggleShelf:', bookId);
    set(state => ({
      books: state.books.map(book =>
        book.id === bookId
          ? { ...book, isInShelf: !book.isInShelf }
          : book
      )
    }));
  },

  updateChapter: (bookId: string, chapter: number) => {
    console.log('[Store] updateChapter:', bookId, chapter);
    set(state => ({
      books: state.books.map(book =>
        book.id === bookId
          ? { ...book, currentChapter: chapter }
          : book
      )
    }));
  },

  addBookToClub: (bookId: string, clubId: string) => {
    console.log('[Store] addBookToClub:', bookId, clubId);
    set(state => {
      const currentClubBooks = state.clubBooks[clubId] || [];
      if (currentClubBooks.includes(bookId)) return state;
      return {
        clubBooks: {
          ...state.clubBooks,
          [clubId]: [...currentClubBooks, bookId]
        }
      };
    });
  },

  joinUrge: (taskId: string) => {
    console.log('[Store] joinUrge:', taskId);
    set(state => ({
      urgeTasks: state.urgeTasks.map(task => {
        if (task.id !== taskId || task.status !== 'active' || task.hasJoined) {
          return task;
        }
        const newCount = task.currentCount + 1;
        return {
          ...task,
          hasJoined: true,
          currentCount: newCount,
          status: newCount >= task.targetCount ? 'completed' : task.status
        };
      })
    }));
  },

  createUrgeTask: (taskData) => {
    console.log('[Store] createUrgeTask:', taskData);
    const newTask: UrgeTask = {
      ...taskData,
      id: Date.now().toString(),
      currentCount: 0,
      status: 'active',
      hasJoined: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    set(state => ({
      urgeTasks: [newTask, ...state.urgeTasks]
    }));
  },

  createResponse: (responseData) => {
    console.log('[Store] createResponse:', responseData);
    const newResponse: AuthorResponse = {
      ...responseData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      isRead: false
    };
    set(state => ({
      responses: [newResponse, ...state.responses]
    }));
  },

  markResponseRead: (responseId: string) => {
    console.log('[Store] markResponseRead:', responseId);
    set(state => ({
      responses: state.responses.map(r =>
        r.id === responseId ? { ...r, isRead: true } : r
      )
    }));
  },

  markAllResponsesRead: () => {
    console.log('[Store] markAllResponsesRead');
    set(state => ({
      responses: state.responses.map(r => ({ ...r, isRead: true }))
    }));
  },

  getBookById: (bookId: string) => {
    return get().books.find(b => b.id === bookId);
  },

  getShelfBooks: () => {
    return get().books.filter(b => b.isInShelf);
  },

  getClubBooks: (clubId: string) => {
    const bookIds = get().clubBooks[clubId] || [];
    return get().books.filter(b => bookIds.includes(b.id));
  },

  getJoinedClubs: () => {
    return get().bookClubs.filter(c => c.isJoined);
  }
}));
