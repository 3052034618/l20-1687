import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, UrgeTask, AuthorResponse, BookClub, UrgeParticipant, ClubActivity } from '@/types';
import { mockBooks, mockUrgeTasks, mockResponses, mockBookClubs, mockParticipants } from '@/data';

interface AppState {
  books: Book[];
  urgeTasks: UrgeTask[];
  responses: AuthorResponse[];
  bookClubs: BookClub[];
  clubBooks: Record<string, string[]>;
  urgeParticipants: Record<string, UrgeParticipant[]>;
  clubActivities: ClubActivity[];

  toggleShelf: (bookId: string) => void;
  updateChapter: (bookId: string, chapter: number) => void;
  addBookToClub: (bookId: string, clubId: string) => void;
  joinUrge: (taskId: string, message?: string) => void;
  toggleLikeParticipant: (taskId: string, participantId: string) => void;
  createUrgeTask: (
    task: Omit<UrgeTask, 'id' | 'currentCount' | 'status' | 'hasJoined' | 'createdAt'> & { clubId?: string }
  ) => void;
  createResponse: (response: Omit<AuthorResponse, 'id' | 'createdAt' | 'isRead'> & { clubId?: string }) => void;
  markResponseRead: (responseId: string) => void;
  markAllResponsesRead: () => void;
  markTaskResponded: (taskId: string) => void;
  getBookById: (bookId: string) => Book | undefined;
  getShelfBooks: () => Book[];
  getClubBooks: (clubId: string) => Book[];
  getJoinedClubs: () => BookClub[];
  getUrgeParticipants: (taskId: string) => UrgeParticipant[];
  getResponsesForTask: (taskId: string) => AuthorResponse[];
  getResponsesForBook: (bookId: string) => AuthorResponse[];
  getUrgeTasksForBook: (bookId: string) => UrgeTask[];
  getClubActivities: (clubId: string) => ClubActivity[];
}

const initialParticipants: Record<string, UrgeParticipant[]> = {};
mockParticipants.forEach(p => {
  if (!initialParticipants[p.taskId]) {
    initialParticipants[p.taskId] = [];
  }
  initialParticipants[p.taskId].push({
    ...p,
    likeCount: Math.floor(Math.random() * 20),
    likedByMe: false
  });
});

const initialActivities: ClubActivity[] = [
  {
    id: 'act1',
    clubId: '1',
    type: 'add_book',
    bookId: '2',
    bookTitle: '长安月',
    bookCover: mockBooks.find(b => b.id === '2')?.cover,
    content: '把《长安月》加入了共追清单',
    userName: '书友会管理员',
    userAvatar: 'https://picsum.photos/id/1005/200/200',
    createdAt: '06-18 15:30'
  },
  {
    id: 'act2',
    clubId: '1',
    type: 'urge',
    urgeTaskId: '1',
    urgeMessage: '剧情太精彩了！求更新~',
    bookId: '1',
    bookTitle: '星河彼岸',
    bookCover: mockBooks.find(b => b.id === '1')?.cover,
    content: '发起了一场催更：求更新正文',
    userName: '小书迷',
    userAvatar: 'https://picsum.photos/id/1012/200/200',
    createdAt: '06-19 09:10'
  }
];

const now = () => new Date().toLocaleString('zh-CN', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).replace(/\//g, '-');

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      books: [...mockBooks],
      urgeTasks: [...mockUrgeTasks],
      responses: [...mockResponses],
      bookClubs: [...mockBookClubs],
      clubBooks: { '1': ['2'], '2': ['1'] },
      urgeParticipants: initialParticipants,
      clubActivities: initialActivities,

      toggleShelf: (bookId: string) => {
        set(state => ({
          books: state.books.map(book =>
            book.id === bookId ? { ...book, isInShelf: !book.isInShelf } : book
          )
        }));
      },

      updateChapter: (bookId: string, chapter: number) => {
        set(state => ({
          books: state.books.map(book =>
            book.id === bookId ? { ...book, currentChapter: chapter } : book
          )
        }));
      },

      addBookToClub: (bookId: string, clubId: string) => {
        set(state => {
          const currentClubBooks = state.clubBooks[clubId] || [];
          if (currentClubBooks.includes(bookId)) return state;
          const book = state.books.find(b => b.id === bookId);
          const club = state.bookClubs.find(c => c.id === clubId);
          const newAct: ClubActivity = {
            id: 'act_' + Date.now().toString(),
            clubId,
            type: 'add_book',
            bookId,
            bookTitle: book?.title,
            bookCover: book?.cover,
            content: `把《${book?.title}》加入了共追清单`,
            userName: '我',
            userAvatar: 'https://picsum.photos/id/64/200/200',
            createdAt: now()
          };
          return {
            clubBooks: { ...state.clubBooks, [clubId]: [...currentClubBooks, bookId] },
            clubActivities: [newAct, ...state.clubActivities]
          };
        });
      },

      joinUrge: (taskId: string, message?: string) => {
        set(state => {
          const task = state.urgeTasks.find(t => t.id === taskId);
          if (!task || task.status !== 'active' || task.hasJoined) {
            return state;
          }
          const newCount = task.currentCount + 1;
          const newParticipants = { ...state.urgeParticipants };
          if (!newParticipants[taskId]) newParticipants[taskId] = [];

          const newParticipant: UrgeParticipant = {
            id: 'p_' + Date.now().toString(),
            taskId,
            userId: 'me',
            userName: '我',
            userAvatar: 'https://picsum.photos/id/64/200/200',
            joinedAt: now(),
            message: message || '催更+1',
            likeCount: 0,
            likedByMe: false
          };
          newParticipants[taskId] = [newParticipant, ...newParticipants[taskId]];

          const newCompleted = newCount >= task.targetCount;
          const newStatus: UrgeTask['status'] = newCompleted ? 'completed' : task.status;
          const clubActivities = [...state.clubActivities];
          if (newCompleted) {
            const completeAct: ClubActivity = {
              id: 'act_' + Date.now().toString() + '_c',
              clubId: '1',
              type: 'urge_complete',
              urgeTaskId: task.id,
              urgeMessage: task.message,
              bookId: task.bookId,
              bookTitle: task.bookTitle,
              bookCover: task.bookCover,
              content: `🎉 催更达成！《${task.bookTitle}》${newCount}人参与`,
              userName: '系统',
              userAvatar: 'https://picsum.photos/id/1025/200/200',
              createdAt: now()
            };
            clubActivities.unshift(completeAct);
          }
          return {
            urgeParticipants: newParticipants,
            clubActivities,
            urgeTasks: state.urgeTasks.map(t => {
              if (t.id !== taskId) return t;
              return { ...t, hasJoined: true, currentCount: newCount, status: newStatus };
            })
          };
        });
      },

      toggleLikeParticipant: (taskId: string, participantId: string) => {
        set(state => {
          const list = state.urgeParticipants[taskId] || [];
          const newList = list.map(p => {
            if (p.id !== participantId) return p;
            const liked = !p.likedByMe;
            return {
              ...p,
              likedByMe: liked,
              likeCount: (p.likeCount || 0) + (liked ? 1 : -1)
            };
          });
          return {
            urgeParticipants: { ...state.urgeParticipants, [taskId]: newList }
          };
        });
      },

      createUrgeTask: (taskData) => {
        const newTask: UrgeTask = {
          ...taskData,
          id: 'ut_' + Date.now().toString(),
          currentCount: 0,
          status: 'active',
          hasJoined: false,
          createdAt: new Date().toISOString().split('T')[0]
        };
        set(state => {
          const act: ClubActivity = {
            id: 'act_' + Date.now().toString(),
            clubId: taskData.clubId || '1',
            type: 'urge',
            urgeTaskId: newTask.id,
            urgeMessage: newTask.message,
            bookId: newTask.bookId,
            bookTitle: newTask.bookTitle,
            bookCover: newTask.bookCover,
            content: `发起催更：${newTask.message}`,
            userName: taskData.initiator,
            userAvatar: taskData.initiatorAvatar,
            createdAt: now()
          };
          return {
            urgeTasks: [newTask, ...state.urgeTasks],
            clubActivities: [act, ...state.clubActivities]
          };
        });
      },

      createResponse: (responseData) => {
        const newResponse: AuthorResponse = {
          ...responseData,
          id: 'resp_' + Date.now().toString(),
          createdAt: new Date().toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
          }).replace(/\//g, '-'),
          isRead: false
        };
        set(state => {
          const ns: Partial<AppState> = { responses: [newResponse, ...state.responses] };
          if (responseData.urgeTaskId) {
            ns.urgeTasks = state.urgeTasks.map(t => {
              if (t.id === responseData.urgeTaskId && t.status !== 'responded') {
                return { ...t, status: 'responded' as const };
              }
              return t;
            });
          }
          if (responseData.clubId) {
            const task = responseData.urgeTaskId
              ? state.urgeTasks.find(t => t.id === responseData.urgeTaskId)
              : undefined;
            const respAct: ClubActivity = {
              id: 'act_' + Date.now().toString() + '_r',
              clubId: responseData.clubId,
              type: 'author_response',
              bookId: newResponse.bookId,
              bookTitle: newResponse.bookTitle,
              bookCover: newResponse.bookCover,
              urgeTaskId: responseData.urgeTaskId,
              urgeMessage: task?.message,
              responseId: newResponse.id,
              responseStatus: newResponse.status,
              responseStatusText: newResponse.statusText,
              content: `作者回应${responseData.urgeTaskId ? '催更' : '公告'}：${newResponse.statusText}`,
              userName: newResponse.authorName,
              userAvatar: newResponse.authorAvatar,
              createdAt: now()
            };
            ns.clubActivities = [respAct, ...state.clubActivities];
          }
          return ns;
        });
      },

      markResponseRead: (responseId: string) => {
        set(state => ({
          responses: state.responses.map(r => r.id === responseId ? { ...r, isRead: true } : r)
        }));
      },

      markAllResponsesRead: () => {
        set(state => ({
          responses: state.responses.map(r => ({ ...r, isRead: true }))
        }));
      },

      markTaskResponded: (taskId: string) => {
        set(state => ({
          urgeTasks: state.urgeTasks.map(t =>
            t.id === taskId ? { ...t, status: 'responded' as const } : t
          )
        }));
      },

      getBookById: (bookId: string) => get().books.find(b => b.id === bookId),
      getShelfBooks: () => get().books.filter(b => b.isInShelf),
      getClubBooks: (clubId: string) => {
        const ids = get().clubBooks[clubId] || [];
        return get().books.filter(b => ids.includes(b.id));
      },
      getJoinedClubs: () => get().bookClubs.filter(c => c.isJoined),
      getUrgeParticipants: (taskId: string) => get().urgeParticipants[taskId] || [],
      getResponsesForTask: (taskId: string) => get().responses.filter(r => r.urgeTaskId === taskId),
      getResponsesForBook: (bookId: string) => get().responses.filter(r => r.bookId === bookId),
      getUrgeTasksForBook: (bookId: string) => get().urgeTasks.filter(t => t.bookId === bookId),
      getClubActivities: (clubId: string) =>
        get().clubActivities
          .filter(a => a.clubId === clubId)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    }),
    {
      name: 'bookclub-app-storage-v3',
      partialize: (state) => ({
        books: state.books,
        urgeTasks: state.urgeTasks,
        responses: state.responses,
        clubBooks: state.clubBooks,
        urgeParticipants: state.urgeParticipants,
        clubActivities: state.clubActivities
      })
    }
  )
);
