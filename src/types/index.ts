// 作品类型
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  latestChapter: string;
  latestChapterTime: string;
  totalChapters: number;
  currentChapter: number;
  daysSinceUpdate: number;
  commentHeat: number;
  fanCount: number;
  description: string;
  status: 'ongoing' | 'completed' | 'paused';
  isInShelf: boolean;
}

// 催更任务
export interface UrgeTask {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  initiator: string;
  initiatorAvatar: string;
  updateType: 'chapter' | 'extra' | 'ending' | 'illustration';
  targetCount: number;
  currentCount: number;
  message: string;
  deadline: string;
  createdAt: string;
  status: 'active' | 'completed' | 'expired';
  hasJoined: boolean;
  bookClubName?: string;
}

// 作者回应
export interface AuthorResponse {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  authorName: string;
  authorAvatar: string;
  status: 'writing' | 'tonight' | 'leave' | 'thank';
  statusText: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// 书友会
export interface BookClub {
  id: string;
  name: string;
  avatar: string;
  memberCount: number;
  bookCount: number;
  description: string;
  isJoined: boolean;
}

// 催更参与记录
export interface UrgeParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  joinedAt: string;
  message?: string;
}

// 更新类型
export type UpdateType = 'chapter' | 'extra' | 'ending' | 'illustration';

export const updateTypeMap: Record<UpdateType, string> = {
  chapter: '正文更新',
  extra: '番外',
  ending: '结局揭秘',
  illustration: '插画福利'
};

// 作者回应状态
export type ResponseStatus = 'writing' | 'tonight' | 'leave' | 'thank';

export const responseStatusMap: Record<ResponseStatus, string> = {
  writing: '已在写',
  tonight: '今晚更',
  leave: '请假说明',
  thank: '感谢支持'
};
