import type { Book } from '@/types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: '星河彼岸',
    author: '望川',
    cover: 'https://picsum.photos/id/1025/300/400',
    category: '科幻',
    latestChapter: '第128章 星门开启',
    latestChapterTime: '2026-06-18',
    totalChapters: 128,
    currentChapter: 85,
    daysSinceUpdate: 2,
    commentHeat: 3420,
    fanCount: 12580,
    description: '当人类踏上星际征途，发现宇宙深处隐藏着古老的文明遗迹。主角林远在一次意外中获得神秘力量，开始揭开星河彼岸的秘密...',
    status: 'ongoing',
    isInShelf: true
  },
  {
    id: '2',
    title: '长安月',
    author: '墨白',
    cover: 'https://picsum.photos/id/1062/300/400',
    category: '古风',
    latestChapter: '第96章 宫宴惊变',
    latestChapterTime: '2026-06-15',
    totalChapters: 96,
    currentChapter: 60,
    daysSinceUpdate: 5,
    commentHeat: 8920,
    fanCount: 28900,
    description: '大唐盛世，才女沈清月以智谋游走于朝堂与江湖之间，在波诡云谲的权力斗争中谱写传奇...',
    status: 'ongoing',
    isInShelf: true
  },
  {
    id: '3',
    title: '黎明之剑',
    author: '流浪的蛤蟆',
    cover: 'https://picsum.photos/id/1074/300/400',
    category: '奇幻',
    latestChapter: '第256章 龙脊山脉',
    latestChapterTime: '2026-06-19',
    totalChapters: 256,
    currentChapter: 200,
    daysSinceUpdate: 1,
    commentHeat: 15600,
    fanCount: 56000,
    description: '在魔法与剑的世界，高文穿越成为落魄贵族，凭借现代人的知识和智慧，在这片神秘大陆上建立属于自己的领地...',
    status: 'ongoing',
    isInShelf: true
  },
  {
    id: '4',
    title: '山海奇闻录',
    author: '青璃',
    cover: 'https://picsum.photos/id/1059/300/400',
    category: '悬疑',
    latestChapter: '第58章 鲛人泪',
    latestChapterTime: '2026-06-10',
    totalChapters: 58,
    currentChapter: 42,
    daysSinceUpdate: 10,
    commentHeat: 2100,
    fanCount: 8900,
    description: '古玩店老板苏然意外获得一本古书，书中记载的山海异兽逐渐在现实中显现...',
    status: 'paused',
    isInShelf: false
  },
  {
    id: '5',
    title: '代码修仙录',
    author: '程序猿',
    cover: 'https://picsum.photos/id/60/300/400',
    category: '都市',
    latestChapter: '第145章 系统升级',
    latestChapterTime: '2026-06-17',
    totalChapters: 145,
    currentChapter: 108,
    daysSinceUpdate: 3,
    commentHeat: 6780,
    fanCount: 18900,
    description: '程序员林小凡意外获得修仙系统，用代码逻辑修炼成仙，在都市中开启不一样的修真之路...',
    status: 'ongoing',
    isInShelf: false
  },
  {
    id: '6',
    title: '雾都侦探',
    author: '柯南道尔',
    cover: 'https://picsum.photos/id/119/300/400',
    category: '推理',
    latestChapter: '第89章 最后的谜题',
    latestChapterTime: '2026-06-12',
    totalChapters: 89,
    currentChapter: 75,
    daysSinceUpdate: 8,
    commentHeat: 4560,
    fanCount: 15600,
    description: '维多利亚时代的伦敦，天才侦探夏洛克与助手华生一起破解一个个离奇案件...',
    status: 'ongoing',
    isInShelf: false
  },
  {
    id: '7',
    title: '星际美食家',
    author: '吃货',
    cover: 'https://picsum.photos/id/292/300/400',
    category: '轻小说',
    latestChapter: '第67章 星云糕点',
    latestChapterTime: '2026-06-19',
    totalChapters: 67,
    currentChapter: 50,
    daysSinceUpdate: 1,
    commentHeat: 3200,
    fanCount: 9800,
    description: '星际时代，美食成为最珍贵的艺术品。主角带着地球的烹饪技艺，在银河联邦掀起美食风暴...',
    status: 'ongoing',
    isInShelf: false
  },
  {
    id: '8',
    title: '仙路漫漫',
    author: '青云',
    cover: 'https://picsum.photos/id/1039/300/400',
    category: '仙侠',
    latestChapter: '第312章 渡劫飞升',
    latestChapterTime: '2026-06-16',
    totalChapters: 312,
    currentChapter: 280,
    daysSinceUpdate: 4,
    commentHeat: 12300,
    fanCount: 42000,
    description: '少年叶凡从凡间起步，一步步踏上修仙之路，在天劫与心魔中寻找长生之道...',
    status: 'ongoing',
    isInShelf: false
  },
  {
    id: '9',
    title: '海边的咖啡店',
    author: '暖阳',
    cover: 'https://picsum.photos/id/1056/300/400',
    category: '治愈',
    latestChapter: '第33章 雨后彩虹',
    latestChapterTime: '2026-06-08',
    totalChapters: 33,
    currentChapter: 25,
    daysSinceUpdate: 12,
    commentHeat: 1560,
    fanCount: 6700,
    description: '在海边小镇的咖啡店里，每个人都有自己的故事。温暖的咖啡，温柔的人，治愈你的每一天...',
    status: 'paused',
    isInShelf: false
  },
  {
    id: '10',
    title: '机甲风暴',
    author: '钢铁之心',
    cover: 'https://picsum.photos/id/1018/300/400',
    category: '科幻',
    latestChapter: '第201章 最终决战',
    latestChapterTime: '2026-06-18',
    totalChapters: 201,
    currentChapter: 156,
    daysSinceUpdate: 2,
    commentHeat: 7890,
    fanCount: 23400,
    description: '银河战争时代，机甲成为战场主宰。少年凌峰从军校起步，成为最强机甲师，守护人类的希望...',
    status: 'ongoing',
    isInShelf: false
  }
];

export function getBookById(id: string): Book | undefined {
  return mockBooks.find(book => book.id === id);
}

export function searchBooks(keyword: string): Book[] {
  if (!keyword.trim()) return [];
  const lower = keyword.toLowerCase();
  return mockBooks.filter(
    book => book.title.toLowerCase().includes(lower) ||
            book.author.toLowerCase().includes(lower) ||
            book.category.toLowerCase().includes(lower)
  );
}

export function getShelfBooks(): Book[] {
  return mockBooks.filter(book => book.isInShelf);
}
