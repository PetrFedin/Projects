
import {
    PackageCheck,
    ShoppingBag,
    Gem,
    Store,
    Leaf,
    Heart,
    Star,
    MessageSquare,
    Users,
    Crown,
    Palette,
    Sparkles,
    Camera,
    Gamepad2,
    Video,
    Bot,
    Shirt,
    Share2,
    Calendar,
    Trophy
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Achievement {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    achieved: boolean;
}

export const achievements: Achievement[] = [
    // Покупки
    { id: 'first_purchase', icon: PackageCheck, title: 'Первооткрыватель', description: 'Совершить первую покупку', achieved: true },
    { id: 'shopaholic', icon: ShoppingBag, title: 'Шопоголик', description: 'Совершить 5 покупок', achieved: true },
    { id: 'high_roller', icon: Gem, title: 'Крупная рыба', description: 'Потратить более 100 000 ₽', achieved: false },
    { id: 'brand_lover', icon: Store, title: 'Ценитель брендов', description: 'Купить товары 3 разных брендов', achieved: true },
    { id: 'eco_friendly', icon: Leaf, title: 'Осознанный выбор', description: 'Купить товар с эко-маркировкой', achieved: true },

    // Активность на платформе
    { id: 'first_wishlist', icon: Heart, title: 'Коллекционер желаний', description: 'Добавить первый товар в избранное', achieved: true },
    { id: 'first_review', icon: Star, title: 'Критик', description: 'Оставить первый отзыв на товар', achieved: true },
    { id: 'communicator', icon: MessageSquare, title: 'Душа компании', description: 'Оставить 10 комментариев', achieved: false },
    { id: 'influencer', icon: Users, title: 'Инфлюенсер', description: 'Получить 100 подписчиков', achieved: false },
    { id: 'weekly_winner', icon: Crown, title: 'Икона стиля', description: 'Ваш образ стал "Образом недели"', achieved: false },

    // Создание контента
    { id: 'stylist', icon: Palette, title: 'Стилист', description: 'Создать первый лукборд', achieved: false },
    { id: 'sharer', icon: Share2, title: 'Амбассадор', description: 'Поделиться 5 товарами или образами', achieved: false },
    { id: 'my_wardrobe', icon: Shirt, title: 'Мой гардероб', description: 'Впервые зайти в свой виртуальный гардероб', achieved: true },
    { id: 'ai_assistant', icon: Bot, title: 'Друг AI', description: 'Воспользоваться помощью AI-ассистента', achieved: true },
    { id: 'ai_stylist_chat', icon: Sparkles, title: 'Разговор по душам', description: 'Впервые пообщаться с AI-стилистом', achieved: true },

    // Технологические фишки
    { id: 'ar_try_on', icon: Camera, title: 'Новатор', description: 'Примерить вещь в AR', achieved: false },
    { id: 'metaverse_visitor', icon: Gamepad2, title: 'Гость из будущего', description: 'Посетить мероприятие в метавселенной', achieved: false },
    { id: 'video_creator', icon: Video, title: 'Режиссер', description: 'Сгенерировать видео для соцсетей', achieved: false },
    { id: 'ab_tester', icon: Trophy, title: 'Исследователь', description: 'Запустить A/B тест для своего товара', achieved: false },
    { id: 'planner', icon: Calendar, title: 'Планировщик', description: 'Запланировать скидку на свой товар', achieved: false },
];
