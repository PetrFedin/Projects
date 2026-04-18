'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  Gift,
  Crown,
  Flame,
  TrendingUp,
  Users,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Level {
  current: number;
  name: string;
  points: number;
  nextLevelPoints: number;
  progress: number;
  benefits: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward?: { type: string; amount: number };
  unlockedAt?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'special';
  progress: number;
  maxProgress: number;
  reward: { points: number; badge?: string; discount?: number };
  expiresAt?: string;
  status: 'active' | 'completed' | 'expired';
}

interface Streak {
  days: number;
  longestStreak: number;
  nextReward: number;
}

export default function GamificationSystem() {
  const { user } = useAuth();
  const { wishlist, lookboards, cart } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [level, setLevel] = useState<Level | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadGamificationData = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Calculate level
        const totalPoints =
          (user.loyaltyPoints || 0) +
          userOrders.reduce((sum, o) => sum + Math.round(o.total / 100), 0);
        const calculatedLevel = calculateLevel(totalPoints);
        setLevel(calculatedLevel);

        // Load achievements
        const userAchievements = generateAchievements(
          userOrders,
          wishlist.length,
          lookboards.length,
          cart.length
        );
        setAchievements(userAchievements);

        // Load challenges
        const userChallenges = generateChallenges(userOrders, wishlist.length);
        setChallenges(userChallenges);

        // Calculate streak
        const userStreak = calculateStreak(userOrders);
        setStreak(userStreak);
      } catch (error) {
        console.error('Failed to load gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGamificationData();
  }, [user, wishlist.length, lookboards.length, cart.length]);

  if (loading || !level) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-4 text-center">Загрузка системы геймификации...</div>
        </CardContent>
      </Card>
    );
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const activeChallenges = challenges.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="border-accent/30 bg-gradient-to-br from-background to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Ваш уровень: {level.name}
          </CardTitle>
          <CardDescription>
            {level.points.toLocaleString('ru-RU')} баллов • До следующего уровня:{' '}
            {level.nextLevelPoints - level.points} баллов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={level.progress} className="h-4" />
            <div className="grid grid-cols-3 gap-3">
              {level.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      {streak && streak.days > 0 && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:border-orange-800 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              Серия активностей
            </CardTitle>
            <CardDescription>
              {streak.days} дней подряд • Рекорд: {streak.longestStreak} дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-orange-600">{streak.days}</p>
                <p className="text-sm text-muted-foreground">Дней подряд</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Следующая награда через</p>
                <p className="text-sm font-bold text-orange-600">
                  {streak.nextReward - streak.days} дней
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Активные челленджи
          </CardTitle>
          <CardDescription>Выполняйте задания и получайте награды</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges
              .filter((c) => c.status === 'active')
              .map((challenge) => (
                <div key={challenge.id} className="rounded-lg border bg-muted/50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {challenge.type === 'daily'
                            ? 'Ежедневный'
                            : challenge.type === 'weekly'
                              ? 'Еженедельный'
                              : challenge.type === 'seasonal'
                                ? 'Сезонный'
                                : 'Специальный'}
                        </Badge>
                        <h4 className="text-sm font-semibold">{challenge.title}</h4>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{challenge.description}</p>
                      <Progress
                        value={(challenge.progress / challenge.maxProgress) * 100}
                        className="mb-2 h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {challenge.progress} / {challenge.maxProgress}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">{challenge.reward.points} баллов</span>
                      {challenge.reward.discount && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <Gift className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">
                            {challenge.reward.discount}% скидка
                          </span>
                        </>
                      )}
                    </div>
                    {challenge.expiresAt && (
                      <span className="text-xs text-muted-foreground">
                        До {new Date(challenge.expiresAt).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            {activeChallenges === 0 && (
              <div className="py-4 text-center text-muted-foreground">
                <Target className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Нет активных челленджей</p>
                <p className="mt-1 text-xs">Новые челленджи появятся скоро!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Достижения
          </CardTitle>
          <CardDescription>
            {unlockedAchievements} из {achievements.length} разблокировано
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  'rounded-lg border p-4 text-center transition-all',
                  achievement.unlocked
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                    : 'border-border bg-muted/50 opacity-60'
                )}
              >
                <div className="mb-2 text-base">{achievement.icon}</div>
                <h4 className="mb-1 text-sm font-semibold">{achievement.title}</h4>
                <p className="mb-2 text-xs text-muted-foreground">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <Progress
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className="h-1"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                )}
                {achievement.unlocked && achievement.reward && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    +{achievement.reward.amount} {achievement.reward.type}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Рейтинг
          </CardTitle>
          <CardDescription>Ваше место среди других пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((position, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-3',
                  position === 2 ? 'border-2 border-accent bg-accent/10' : 'bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                    position === 1 && 'bg-yellow-500 text-white',
                    position === 2 && 'bg-accent text-accent-foreground',
                    position === 3 && 'bg-orange-500 text-white',
                    position > 3 && 'bg-muted'
                  )}
                >
                  {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {position === 2 ? (user?.displayName ?? 'Вы') : `Пользователь ${position}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {position === 2
                      ? level.points.toLocaleString('ru-RU')
                      : (level.points + (position - 2) * 1000).toLocaleString('ru-RU')}{' '}
                    баллов
                  </p>
                </div>
                {position === 2 && <Badge variant="default">Вы</Badge>}
              </div>
            ))}
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/community?tab=leaderboard">
                <Users className="mr-2 h-4 w-4" />
                Посмотреть полный рейтинг
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="from-accent-primary/10 to-accent-primary/10 dark:from-bg-surface2/80 dark:to-bg-surface2/80 border-accent-primary/25 dark:border-border-default bg-gradient-to-br">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="text-accent-primary h-5 w-5" />
            Реферальная программа
          </CardTitle>
          <CardDescription>Приглашайте друзей и получайте награды</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-accent-primary text-sm font-bold">3</p>
                <p className="mt-1 text-xs text-muted-foreground">Приглашено друзей</p>
              </div>
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <p className="text-accent-primary text-sm font-bold">1,500</p>
                <p className="mt-1 text-xs text-muted-foreground">Баллов заработано</p>
              </div>
            </div>
            <div className="rounded-lg bg-background/50 p-4">
              <p className="mb-2 text-sm font-medium">Ваша реферальная ссылка:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted p-2 text-xs">
                  syntha.com/ref/{(user?.uid ?? 'guest').slice(0, 8)}
                </code>
                <Button size="sm" variant="outline">
                  Копировать
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Вы получаете 500 баллов за каждого друга</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Друг получает 300 баллов при регистрации</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Дополнительно 200 баллов при первой покупке друга</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateLevel(totalPoints: number): Level {
  const levels = [
    { level: 1, name: 'Новичок', points: 0, benefits: ['Базовые скидки', 'Доступ к каталогу'] },
    {
      level: 2,
      name: 'Покупатель',
      points: 1000,
      benefits: ['Скидки 5%', 'Бесплатная доставка от 5000₽'],
    },
    { level: 3, name: 'Любитель', points: 5000, benefits: ['Скидки 7%', 'Приоритетная поддержка'] },
    { level: 4, name: 'Эксперт', points: 15000, benefits: ['Скидки 10%', 'Эксклюзивные товары'] },
    { level: 5, name: 'VIP', points: 50000, benefits: ['Скидки 15%', 'Персональный стилист'] },
  ];

  let currentLevel = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].points) {
      currentLevel = levels[i];
      break;
    }
  }

  const nextLevel = levels.find((l) => l.level === currentLevel.level + 1);
  const nextLevelPoints = nextLevel ? nextLevel.points : currentLevel.points * 2;
  const progress = nextLevel
    ? ((totalPoints - currentLevel.points) / (nextLevelPoints - currentLevel.points)) * 100
    : 100;

  return {
    current: currentLevel.level,
    name: currentLevel.name,
    points: totalPoints,
    nextLevelPoints,
    progress: Math.min(100, Math.max(0, progress)),
    benefits: currentLevel.benefits,
  };
}

function generateAchievements(
  orders: Order[],
  wishlistCount: number,
  lookboardsCount: number,
  cartCount: number
): Achievement[] {
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItems = orders.reduce((sum, o) => sum + o.items.length, 0);

  return [
    {
      id: 'first_purchase',
      title: 'Первая покупка',
      description: 'Сделайте первую покупку',
      icon: '🛍️',
      progress: orders.length > 0 ? 1 : 0,
      maxProgress: 1,
      unlocked: orders.length > 0,
      reward: { type: 'баллов', amount: 100 },
      unlockedAt: orders.length > 0 ? orders[orders.length - 1].createdAt : undefined,
    },
    {
      id: 'spender_1k',
      title: 'Потратил 10,000₽',
      description: 'Накопите 10,000₽ покупок',
      icon: '💰',
      progress: Math.min(totalSpent, 10000),
      maxProgress: 10000,
      unlocked: totalSpent >= 10000,
      reward: { type: 'баллов', amount: 500 },
    },
    {
      id: 'spender_50k',
      title: 'Большой покупатель',
      description: 'Накопите 50,000₽ покупок',
      icon: '💎',
      progress: Math.min(totalSpent, 50000),
      maxProgress: 50000,
      unlocked: totalSpent >= 50000,
      reward: { type: 'баллов', amount: 2000 },
    },
    {
      id: 'collector',
      title: 'Коллекционер',
      description: 'Добавьте 10 товаров в избранное',
      icon: '❤️',
      progress: Math.min(wishlistCount, 10),
      maxProgress: 10,
      unlocked: wishlistCount >= 10,
      reward: { type: 'баллов', amount: 200 },
    },
    {
      id: 'stylist',
      title: 'Стилист',
      description: 'Создайте 5 лукбордов',
      icon: '🎨',
      progress: Math.min(lookboardsCount, 5),
      maxProgress: 5,
      unlocked: lookboardsCount >= 5,
      reward: { type: 'баллов', amount: 300 },
    },
    {
      id: 'loyal_customer',
      title: 'Постоянный клиент',
      description: 'Сделайте 10 заказов',
      icon: '⭐',
      progress: Math.min(orders.length, 10),
      maxProgress: 10,
      unlocked: orders.length >= 10,
      reward: { type: 'баллов', amount: 1000 },
    },
    {
      id: 'early_bird',
      title: 'Ранняя пташка',
      description: 'Сделайте покупку до 10 утра',
      icon: '🌅',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      reward: { type: 'баллов', amount: 150 },
    },
    {
      id: 'social_butterfly',
      title: 'Социальная бабочка',
      description: 'Поделитесь 5 лукбордами',
      icon: '🦋',
      progress: Math.min(lookboardsCount, 5),
      maxProgress: 5,
      unlocked: lookboardsCount >= 5,
      reward: { type: 'баллов', amount: 250 },
    },
  ];
}

function generateChallenges(orders: Order[], wishlistCount: number): Challenge[] {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'daily_login',
      title: 'Ежедневный вход',
      description: 'Войдите в кабинет 3 дня подряд',
      type: 'daily',
      progress: 2,
      maxProgress: 3,
      reward: { points: 50 },
      expiresAt: weekFromNow.toISOString(),
      status: 'active',
    },
    {
      id: 'add_to_wishlist',
      title: 'Пополните избранное',
      description: 'Добавьте 5 товаров в избранное на этой неделе',
      type: 'weekly',
      progress: wishlistCount,
      maxProgress: 5,
      reward: { points: 100, discount: 5 },
      expiresAt: weekFromNow.toISOString(),
      status: wishlistCount >= 5 ? 'completed' : 'active',
    },
    {
      id: 'spring_collection',
      title: 'Весенняя коллекция',
      description: 'Купите 3 товара из весенней коллекции',
      type: 'seasonal',
      progress: 1,
      maxProgress: 3,
      reward: { points: 300, discount: 10 },
      expiresAt: new Date(now.getFullYear(), 5, 1).toISOString(),
      status: 'active',
    },
  ];
}

function calculateStreak(orders: Order[]): Streak {
  if (orders.length === 0) {
    return { days: 0, longestStreak: 0, nextReward: 7 };
  }

  // Simple streak calculation (mock)
  const days = Math.min(14, orders.length * 2);
  const longestStreak = Math.max(days, 21);
  const nextReward = days < 7 ? 7 : days < 14 ? 14 : days < 30 ? 30 : 30;

  return { days, longestStreak, nextReward };
}
