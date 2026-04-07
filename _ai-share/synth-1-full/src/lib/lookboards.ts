
import type { Look, Lookboard } from './types';

export const userLooks: Look[] = [
    {
        id: 'user-look-1',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzdHlsZSUyMHdvbWFufGVufDB8fHx8MTc2MDgzNTM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'street style woman',
        description: 'Образ для прогулки по городу.',
        likesCount: 15,
        commentsCount: 2,
        author: { name: 'Вы', handle: '@me', avatarUrl: '' }
    },
    {
        id: 'user-look-2',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzdHJlZXQlMjBzdHlsZSUyMHdvbWFufGVufDB8fHx8MTc2MDgzNTM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'street style woman',
        description: 'Вечерний выход.',
        likesCount: 42,
        commentsCount: 5,
        author: { name: 'Вы', handle: '@me', avatarUrl: '' }
    },
    {
        id: 'user-look-3',
        imageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzdHJlZXQlMjBzdHlsZSUyMHdvbWFufGVufDB8fHx8MTc2MDgzNTM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
        imageHint: 'street style woman',
        description: 'Для деловой встречи.',
        likesCount: 8,
        commentsCount: 1,
        author: { name: 'Вы', handle: '@me', avatarUrl: '' }
    }
];

export const lookboards: Lookboard[] = [
    {
        id: '1',
        title: 'Летнее настроение',
        description: 'Образы для теплых дней и отпуска.',
        looks: [
            userLooks[0],
            { id: 'lb1-2', imageUrl: 'https://picsum.photos/seed/look1/400/500', description: '', imageHint: 'summer clothes', author: { name: '', handle: '', avatarUrl: '' }, likesCount: 112, commentsCount: 10 },
            { id: 'lb1-3', imageUrl: 'https://picsum.photos/seed/look2/400/500', description: '', imageHint: 'beach outfit', author: { name: '', handle: '', avatarUrl: '' }, likesCount: 230, commentsCount: 25 },
            { id: 'lb1-4', imageUrl: 'https://picsum.photos/seed/look3/400/500', description: '', imageHint: 'sunglasses hat', author: { name: '', handle: '', avatarUrl: '' }, likesCount: 98, commentsCount: 7 },
            { id: 'lb1-5', imageUrl: 'https://picsum.photos/seed/look4/400/500', description: '', imageHint: 'sandals feet', author: { name: '', handle: '', avatarUrl: '' }, likesCount: 76, commentsCount: 4 },
        ]
    },
    {
        id: '2',
        title: 'Осенний гардероб',
        description: 'Уютные и стильные сочетания.',
        looks: [
            userLooks[1],
            userLooks[2],
            { id: 'lb2-3', imageUrl: 'https://picsum.photos/seed/look5/400/500', description: '', imageHint: 'autumn coat', author: { name: '', handle: '', avatarUrl: '' }, likesCount: 150, commentsCount: 12 },
        ]
    }
];
