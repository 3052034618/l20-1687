import type { UrgeTask, UrgeParticipant } from '@/types';

export const mockUrgeTasks: UrgeTask[] = [
  {
    id: '1',
    bookId: '2',
    bookTitle: '长安月',
    bookCover: 'https://picsum.photos/id/1062/300/400',
    initiator: '清月粉丝后援会',
    initiatorAvatar: 'https://picsum.photos/id/64/200/200',
    updateType: 'chapter',
    targetCount: 500,
    currentCount: 386,
    message: '宫宴惊变后剧情太精彩了，太太快更下一章！我们都在等~',
    deadline: '2026-06-22',
    createdAt: '2026-06-18',
    status: 'active',
    hasJoined: true,
    bookClubName: '长安月官方书友会'
  },
  {
    id: '2',
    bookId: '1',
    bookTitle: '星河彼岸',
    bookCover: 'https://picsum.photos/id/1025/300/400',
    initiator: '星际探险队',
    initiatorAvatar: 'https://picsum.photos/id/91/200/200',
    updateType: 'extra',
    targetCount: 300,
    currentCount: 298,
    message: '想看林远和苏清的番外！日常互动也很有爱呀~',
    deadline: '2026-06-21',
    createdAt: '2026-06-17',
    status: 'active',
    hasJoined: false,
    bookClubName: '星河彼岸读者群'
  },
  {
    id: '3',
    bookId: '3',
    bookTitle: '黎明之剑',
    bookCover: 'https://picsum.photos/id/1074/300/400',
    initiator: '领地建设者',
    initiatorAvatar: 'https://picsum.photos/id/177/200/200',
    updateType: 'chapter',
    targetCount: 1000,
    currentCount: 1000,
    message: '龙脊山脉的冒险太刺激了，期待更多精彩！',
    deadline: '2026-06-20',
    createdAt: '2026-06-15',
    status: 'completed',
    hasJoined: true,
    bookClubName: '黎明之剑官方书友会'
  },
  {
    id: '4',
    bookId: '4',
    bookTitle: '山海奇闻录',
    bookCover: 'https://picsum.photos/id/1059/300/400',
    initiator: '山海爱好者',
    initiatorAvatar: 'https://picsum.photos/id/338/200/200',
    updateType: 'chapter',
    targetCount: 200,
    currentCount: 156,
    message: '大大回来更文吧！我们都在等鲛人泪的后续...',
    deadline: '2026-06-25',
    createdAt: '2026-06-12',
    status: 'active',
    hasJoined: false
  },
  {
    id: '5',
    bookId: '5',
    bookTitle: '代码修仙录',
    bookCover: 'https://picsum.photos/id/60/300/400',
    initiator: '码农修仙群',
    initiatorAvatar: 'https://picsum.photos/id/1027/200/200',
    updateType: 'illustration',
    targetCount: 100,
    currentCount: 45,
    message: '想看系统升级的插画！想想都很燃~',
    deadline: '2026-06-23',
    createdAt: '2026-06-16',
    status: 'active',
    hasJoined: false
  }
];

export const mockParticipants: UrgeParticipant[] = [
  { id: '1', userId: 'u1', userName: '月下饮茶', userAvatar: 'https://picsum.photos/id/64/200/200', joinedAt: '2026-06-18 10:30', message: '催更催更！' },
  { id: '2', userId: 'u2', userName: '清月的小迷妹', userAvatar: 'https://picsum.photos/id/65/200/200', joinedAt: '2026-06-18 10:35' },
  { id: '3', userId: 'u3', userName: '古风爱好者', userAvatar: 'https://picsum.photos/id/66/200/200', joinedAt: '2026-06-18 11:00', message: '坐等更新~' },
  { id: '4', userId: 'u4', userName: '墨白家的猫', userAvatar: 'https://picsum.photos/id/67/200/200', joinedAt: '2026-06-18 11:20' },
  { id: '5', userId: 'u5', userName: '长安客', userAvatar: 'https://picsum.photos/id/68/200/200', joinedAt: '2026-06-18 12:00', message: '太太加油！' },
  { id: '6', userId: 'u6', userName: '沈清月', userAvatar: 'https://picsum.photos/id/69/200/200', joinedAt: '2026-06-18 13:30' },
  { id: '7', userId: 'u7', userName: '书虫一枚', userAvatar: 'https://picsum.photos/id/70/200/200', joinedAt: '2026-06-18 14:00' },
  { id: '8', userId: 'u8', userName: '夜读人', userAvatar: 'https://picsum.photos/id/71/200/200', joinedAt: '2026-06-18 15:20', message: '每天都在等更新' },
];

export function getUrgeTaskById(id: string): UrgeTask | undefined {
  return mockUrgeTasks.find(task => task.id === id);
}

export function getActiveUrgeTasks(): UrgeTask[] {
  return mockUrgeTasks.filter(task => task.status === 'active');
}

export function getUrgeParticipants(taskId: string): UrgeParticipant[] {
  return mockParticipants;
}
