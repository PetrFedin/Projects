import type { Look } from './types';

export const looks: Look[] = [
  {
    id: '1',
    author: {
      name: 'Sofia',
      handle: '@sofia_style',
      avatarUrl: 'https://picsum.photos/seed/look-user1/40/40',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzdHJlZXQlMjBzdHlsZSUyMHdvbWFufGVufDB8fHx8MTc2MDgzNTM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'street style woman',
    description: 'Парижский шик',
    likesCount: 10254,
    commentsCount: 32,
    products: [{ productId: '7' }, { productId: '1' }, { productId: '3' }],
  },
  {
    id: '2',
    author: {
      name: 'Max',
      handle: '@max_fashion',
      avatarUrl: 'https://picsum.photos/seed/look-user2/40/40',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    imageHint: 'fashion model editorial',
    description: 'Минимализм и комфорт для города.',
    likesCount: 892,
    commentsCount: 18,
  },
  {
    id: '3',
    author: {
      name: 'Anna',
      handle: '@anna_looks',
      avatarUrl: 'https://picsum.photos/seed/look-user3/40/40',
    },
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be06109d74e?q=80&w=1000',
    imageHint: 'editorial fashion photography',
    description: 'Яркие акценты в осеннем гардеробе.',
    likesCount: 2310,
    commentsCount: 55,
  },
  {
    id: '4',
    author: {
      name: 'Nordic Wool',
      handle: '@nordicwool',
      avatarUrl: 'https://picsum.photos/seed/nordic-wool/40/40',
    },
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000',
    imageHint: 'high fashion editorial acne',
    description: 'Новая коллекция уже в продаже!',
    likesCount: 5432,
    commentsCount: 123,
  },
  {
    id: '5',
    author: {
      name: 'Eva',
      handle: '@eva_trends',
      avatarUrl: 'https://picsum.photos/seed/look-user4/40/40',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1525972828884-b74149db49ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzdHJlZXQlMjBzdHlsZSUyMHdvbWFufGVufDB8fHx8MTc2MDgzNTM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'street style woman',
    description: 'Уютный трикотаж для прохладных вечеров.',
    likesCount: 978,
    commentsCount: 25,
  },
  {
    id: '6',
    author: {
      name: 'Denis',
      handle: '@denis_daily',
      avatarUrl: 'https://picsum.photos/seed/look-user5/40/40',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1551874259-8e9f29d2b719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdHJlZXQlMjBzdHlsZSUyMG1hbnxlbnwwfHx8fDE3NjA4MzU0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'street style man',
    description: 'Классика и спорт в одном образе.',
    likesCount: 750,
    commentsCount: 15,
  },
  {
    id: '7',
    author: {
      name: 'Maison Margiela',
      handle: '@maisonmargiela',
      avatarUrl: 'https://picsum.photos/seed/logo5/40/40',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1555529771-838f664030a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2FtcGFpZ258ZW58MHx8fHwxNzYwODM1NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'fashion campaign',
    description: 'Авангардный взгляд на моду.',
    likesCount: 8901,
    commentsCount: 250,
  },
  {
    id: '8',
    author: {
      name: 'Olga',
      handle: '@olga_vogue',
      avatarUrl: 'https://picsum.photos/seed/look-user6/40/40',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1539669528938-a23863450974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdHJlZXQlMjBzdHlsZSUyMHdvbWFufGVufDB8fHx8MTc2MDgzNTM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'street style woman',
    description: 'Элегантность в каждой детали.',
    likesCount: 1500,
    commentsCount: 45,
  },
];
