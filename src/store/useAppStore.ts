import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, UrgeTask, AuthorResponse, BookClub, UrgeParticipant } from '@/types';
import { mockBooks, mockUrgeTasks, mockResponses, mockBookClubs, mockParticipants } from '@/data';

interface AppState {
  books: Book[];
  urgeTasks: UrgeTask[];
  responses: AuthorResponse[];
  bookClubs: BookClub[];
  clubBooks: Record<string, string[]>;
  urgeParticipants: Record<string, UrgeParticipant[]>;

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
  getUrgeParticipants: (taskId: string) => UrgeParticipant[];
}

const initialParticipants: Record<string, UrgeParticipant[]> = {};
mockParticipants.forEach(p => {
  if (!initialParticipants[p.taskId]) {
    initialParticipants[p.taskId] = [];
  }
  initialParticipants[p.taskId].push(p);
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      books: [...mockBooks],
      urgeTasks: [...mockUrgeTasks],
      responses: [...mockResponses],
      bookClubs: [...mockBookClubs],
      clubBooks: {
        '1': ['2'],
        '2': ['1']
      },
      urgeParticipants: initialParticipants,

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
    set(state => {
      const newParticipants = { ...state.urgeParticipants };
      if (!newParticipants[taskId]) {
        newParticipants[taskId] = [];
      }
      
      const task = state.urgeTasks.find(t => t.id === taskId);
      if (!task || task.status !== 'active' || task.hasJoined) {
        return state;
      }

      const newCount = task.currentCount + 1;
      
      const newParticipant: UrgeParticipant = {
        id: Date.now().toString(),
        taskId,
        userId: 'me',
        userName: '我',
        userAvatar: 'https://picsum.photos/id/64/200/200',
        joinedAt: new Date().toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-'),
        message: '催更+1'
      };

      newParticipants[taskId] = [newParticipant, ...newParticipants[taskId]];

      return {
        urgeParticipants: newParticipants,
        urgeTasks: state.urgeTasks.map(t => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            hasJoined: true,
            currentCount: newCount,
            status: newCount >= t.targetCount ? 'completed' : t.status
          };
        })
      };
    });
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
  },

  getUrgeParticipants: (taskId: string) => {
    return get().urgeParticipants[taskId] || [];
  }
}),
    {
      name: 'bookclub-app-storage-v2',
      partialize: (state) => ({
        books: state.books,
        urgeTasks: state.urgeTasks,
        responses: state.responses,
        clubBooks: state.clubBooks,
        urgeParticipants: state.urgeParticipants
      })
    }
  )
);
