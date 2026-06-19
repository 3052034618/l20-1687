import type { AuthorResponse } from '@/types';

export const mockResponses: AuthorResponse[] = [
  {
    id: '1',
    bookId: '3',
    bookTitle: '黎明之剑',
    bookCover: 'https://picsum.photos/id/1074/300/400',
    authorName: '流浪的蛤蟆',
    authorAvatar: 'https://picsum.photos/id/1012/200/200',
    status: 'tonight',
    statusText: '今晚更',
    message: '看到大家的催更啦！龙脊山脉剧情已经写完，今晚八点准时更新两章，感谢各位的支持~',
    createdAt: '2026-06-19 14:30',
    isRead: false
  },
  {
    id: '2',
    bookId: '1',
    bookTitle: '星河彼岸',
    bookCover: 'https://picsum.photos/id/1025/300/400',
    authorName: '望川',
    authorAvatar: 'https://picsum.photos/id/1005/200/200',
    status: 'writing',
    statusText: '已在写',
    message: '星门篇的大纲已经调整好，正在努力码字中。这一卷会有大场面，敬请期待！',
    createdAt: '2026-06-18 10:00',
    isRead: false
  },
  {
    id: '3',
    bookId: '2',
    bookTitle: '长安月',
    bookCover: 'https://picsum.photos/id/1062/300/400',
    authorName: '墨白',
    authorAvatar: 'https://picsum.photos/id/1006/200/200',
    status: 'leave',
    statusText: '请假说明',
    message: '抱歉大家，最近身体不太舒服，需要休息两天。下周三恢复正常更新，感谢理解~',
    createdAt: '2026-06-15 09:00',
    isRead: true
  },
  {
    id: '4',
    bookId: '5',
    bookTitle: '代码修仙录',
    bookCover: 'https://picsum.photos/id/60/300/400',
    authorName: '程序猿',
    authorAvatar: 'https://picsum.photos/id/1003/200/200',
    status: 'thank',
    statusText: '感谢支持',
    message: '谢谢大家的催更和鼓励！看到这么多人喜欢这本书，码字更有动力了。下周加更一章！',
    createdAt: '2026-06-17 20:00',
    isRead: true
  }
];

export function getUnreadCount(): number {
  return mockResponses.filter(r => !r.isRead).length;
}

export function markAsRead(id: string): void {
  const response = mockResponses.find(r => r.id === id);
  if (response) {
    response.isRead = true;
  }
}
