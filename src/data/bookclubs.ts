import type { BookClub } from '@/types';

export const mockBookClubs: BookClub[] = [
  {
    id: '1',
    name: '长安月官方书友会',
    avatar: 'https://picsum.photos/id/1062/200/200',
    memberCount: 2890,
    bookCount: 3,
    description: '墨白大大《长安月》官方书友群，一起追更、讨论剧情、产粮~',
    isJoined: true
  },
  {
    id: '2',
    name: '星河彼岸读者群',
    avatar: 'https://picsum.photos/id/1025/200/200',
    memberCount: 1560,
    bookCount: 5,
    description: '望川作品读者聚集地，科幻爱好者的乐园',
    isJoined: true
  },
  {
    id: '3',
    name: '黎明之剑官方书友会',
    avatar: 'https://picsum.photos/id/1074/200/200',
    memberCount: 5680,
    bookCount: 8,
    description: '领地建设者联盟，欢迎加入高文的领地！',
    isJoined: false
  },
  {
    id: '4',
    name: '古风小说爱好者',
    avatar: 'https://picsum.photos/id/1025/200/200',
    memberCount: 8900,
    bookCount: 25,
    description: '古风小说大杂烩，什么都聊~',
    isJoined: false
  }
];

export function getJoinedBookClubs(): BookClub[] {
  return mockBookClubs.filter(club => club.isJoined);
}
