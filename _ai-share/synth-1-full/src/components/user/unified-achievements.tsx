'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Trophy, Star, Zap, Target, Award, Gift, Crown, Flame, TrendingUp, 
  Eye, Heart, ShoppingBag, Search, Clock, Filter, Calendar, 
  BarChart3, PieChart, LineChart, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useUserOrders } from '@/hooks/use-user-orders';
import { useUserActivity } from '@/hooks/use-user-activity';
import { achievements as allAchievements } from '@/lib/achievements';
import { cn } from '@/lib/utils';
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { 
  LineChart as RechartsLineChart, 
  BarChart as RechartsBarChart, 
  PieChart as RechartsPieChart,
  Line, 
  Bar, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface Activity {
  id: string;
  type: 'view' | 'wishlist' | 'cart' | 'purchase' | 'search' | 'comparison' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

type Period = 'week' | 'month' | 'year' | 'all';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  period: Period;
  onPeriodChange: (period: Period) => void;
}

function DetailModal({ isOpen, onClose, title, data, period, onPeriodChange }: DetailModalProps) {
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'pie'>('line');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const chartData = useMemo(() => {
    // Filter data by custom date range if selected
    let filteredData = data;
    if (dateRange.from && dateRange.to) {
      filteredData = data.filter(item => {
        const itemDate = new Date(item.timestamp || item.date || item.createdAt);
        return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
      });
    }

    const now = new Date();
    let dates: Date[] = [];
    let dateFormat: string;
    
    switch (period) {
      case 'week':
        dates = eachDayOfInterval({ 
          start: startOfWeek(subDays(now, 7), { weekStartsOn: 1 }), 
          end: endOfWeek(now, { weekStartsOn: 1 })
        });
        dateFormat = 'dd MMM';
        break;
      case 'month':
        dates = eachDayOfInterval({ 
          start: startOfMonth(subMonths(now, 1)), 
          end: endOfMonth(now)
        });
        dateFormat = 'dd MMM';
        break;
      case 'year':
        dates = eachMonthOfInterval({ 
          start: startOfYear(subMonths(now, 12)), 
          end: endOfMonth(now)
        });
        dateFormat = 'MMM yyyy';
        break;
      default:
        dates = eachMonthOfInterval({ 
          start: startOfYear(subMonths(now, 12)), 
          end: endOfMonth(now)
        });
        dateFormat = 'MMM yyyy';
    }

    return dates.map(date => {
      const dateStr = format(date, dateFormat, { locale: ru });
      const count = filteredData.filter(item => {
        if (!item.timestamp && !item.date && !item.createdAt) return false;
        try {
          const itemDate = new Date(item.timestamp || item.date || item.createdAt);
          const itemDateStr = format(itemDate, dateFormat, { locale: ru });
          return itemDateStr === dateStr;
        } catch {
          return false;
        }
      }).length;
      
      return { date: dateStr, value: count, name: dateStr };
    }).filter(d => period === 'all' || d.value > 0);
  }, [data, period, dateRange]);

  const COLORS = ['#3E82F7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-headline">{title}</DialogTitle>
          <DialogDescription>
            Детальная аналитика с возможностью выбора периода
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period Selector */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Tabs value={period} onValueChange={(v) => onPeriodChange(v as Period)}>
              <TabsList>
                <TabsTrigger value="week">Неделя</TabsTrigger>
                <TabsTrigger value="month">Месяц</TabsTrigger>
                <TabsTrigger value="year">Год</TabsTrigger>
                <TabsTrigger value="all">Все время</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Custom Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, 'dd MMM', { locale: ru })} - ${format(dateRange.to, 'dd MMM', { locale: ru })}`
                    : 'Выбрать период'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange(range);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectedChart === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('line')}
            >
              <LineChart className="h-4 w-4 mr-2" />
              Линейный
            </Button>
            <Button
              variant={selectedChart === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('bar')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Столбчатый
            </Button>
            <Button
              variant={selectedChart === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart('pie')}
            >
              <PieChart className="h-4 w-4 mr-2" />
              Круговой
            </Button>
          </div>

          {/* Chart */}
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                {selectedChart === 'line' ? (
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3E82F7" strokeWidth={2} />
                  </RechartsLineChart>
                ) : selectedChart === 'bar' ? (
                  <RechartsBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3E82F7" />
                  </RechartsBarChart>
                ) : (
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="cursor-pointer hover:border-accent transition-colors">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm font-bold">{data.length}</p>
                  <p className="text-xs text-muted-foreground">Всего записей</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent transition-colors">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm font-bold">
                    {data.length > 0 
                      ? Math.max(1, Math.round(data.length / (period === 'week' ? 7 : period === 'month' ? 30 : period === 'year' ? 365 : 365)))
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">В день (среднее)</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent transition-colors">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm font-bold">
                    {data.length > 0 && (data[0]?.timestamp || data[0]?.date || data[0]?.createdAt)
                      ? format(new Date(data[0].timestamp || data[0].date || data[0].createdAt), 'dd MMM', { locale: ru })
                      : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">Последняя активность</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UnifiedAchievements() {
  const { user } = useAuth();
  const { cart, wishlist, lookboards, comparisonList } = useUIState();
  const { orders, stats: orderStats } = useUserOrders();
  const activity = useUserActivity();
  const [achievements, setAchievements] = useState(allAchievements);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    title: string;
    data: any[];
    type: 'activity' | 'achievements' | 'stats';
  }>({
    isOpen: false,
    title: '',
    data: [],
    type: 'activity',
  });
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    if (!user) return;

    // Update achievements
    const updatedAchievements = achievements.map(ach => {
      if (ach.id === 'stylist' && lookboards.length >= 5) {
        return { ...ach, achieved: true };
      }
      return ach;
    });
    setAchievements(updatedAchievements);

    // Generate activities
    const generatedActivities: Activity[] = [];

    // Recent orders
    orders.slice(0, 5).forEach(order => {
      generatedActivities.push({
        id: `order-${order.id}`,
        type: 'purchase',
        title: 'Заказ оформлен',
        description: `Заказ на сумму ${order.total.toLocaleString('ru-RU')} ₽`,
        timestamp: new Date(order.createdAt),
        metadata: { orderId: order.id },
      });
    });

    // Achievements unlocked
    updatedAchievements.filter(a => a.achieved).forEach(ach => {
      generatedActivities.push({
        id: `achievement-${ach.id}`,
        type: 'achievement',
        title: `Достижение: ${ach.title}`,
        description: ach.description,
        timestamp: new Date(),
        metadata: { achievementId: ach.id },
      });
    });

    // Cart activity
    if (cart.length > 0) {
      generatedActivities.push({
        id: 'cart-activity',
        type: 'cart',
        title: 'Товары в корзине',
        description: `${cart.length} ${cart.length === 1 ? 'товар' : 'товаров'} ожидают оформления`,
        timestamp: new Date(),
      });
    }

    // Wishlist activity
    if (wishlist.length > 0) {
      generatedActivities.push({
        id: 'wishlist-activity',
        type: 'wishlist',
        title: 'Избранное обновлено',
        description: `В избранном ${wishlist.length} ${wishlist.length === 1 ? 'товар' : 'товаров'}`,
        timestamp: new Date(),
      });
    }

    // Simulated view activities
    for (let i = 0; i < 10; i++) {
      generatedActivities.push({
        id: `view-${i}`,
        type: 'view',
        title: 'Просмотр товара',
        description: 'Просмотрен товар из каталога',
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    generatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setActivities(generatedActivities);
  }, [user, orders, cart.length, wishlist.length, lookboards.length]);

  const unlockedAchievements = achievements.filter(a => a.achieved).length;
  const activityStats = {
    totalViews: activities.filter(a => a.type === 'view').length,
    totalPurchases: orders.length,
    totalWishlist: wishlist.length,
    cartItems: cart.length,
    achievements: unlockedAchievements,
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'wishlist': return <Star className="h-4 w-4" />;
      case 'cart': return <ShoppingBag className="h-4 w-4" />;
      case 'purchase': return <ShoppingBag className="h-4 w-4" />;
      case 'search': return <Search className="h-4 w-4" />;
      case 'comparison': return <Filter className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'purchase': return 'text-green-600 bg-green-100 dark:bg-green-950';
      case 'cart': return 'text-blue-600 bg-blue-100 dark:bg-blue-950';
      case 'wishlist': return 'text-pink-600 bg-pink-100 dark:bg-pink-950';
      case 'view': return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
      case 'search': return 'text-purple-600 bg-purple-100 dark:bg-purple-950';
      case 'comparison': return 'text-orange-600 bg-orange-100 dark:bg-orange-950';
      case 'achievement': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const openDetailModal = (title: string, data: any[], type: 'activity' | 'achievements' | 'stats') => {
    setDetailModal({ isOpen: true, title, data, type });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => openDetailModal('Просмотры товаров', activities.filter(a => a.type === 'view'), 'activity')}
        >
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-bold">{activityStats.totalViews}</p>
            <p className="text-xs text-muted-foreground">Просмотров</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => openDetailModal('Покупки', orders, 'activity')}
        >
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-bold">{activityStats.totalPurchases}</p>
            <p className="text-xs text-muted-foreground">Покупок</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => openDetailModal('Избранное', activities.filter(a => a.type === 'wishlist'), 'activity')}
        >
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-pink-600" />
            <p className="text-sm font-bold">{activityStats.totalWishlist}</p>
            <p className="text-xs text-muted-foreground">В избранном</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => openDetailModal('Достижения', achievements, 'achievements')}
        >
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm font-bold">{unlockedAchievements}</p>
            <p className="text-xs text-muted-foreground">Достижений</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => openDetailModal('Статистика активности', activities, 'stats')}
        >
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
            <p className="text-sm font-bold">{activities.length}</p>
            <p className="text-xs text-muted-foreground">Всего действий</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Достижения
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="h-4 w-4 mr-2" />
            Активность
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Статистика
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Ваши достижения
                  </CardTitle>
                  <CardDescription>
                    {unlockedAchievements} из {achievements.length} разблокировано
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDetailModal('Все достижения', achievements, 'achievements')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Детализация
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements.map(ach => (
                  <Card 
                    key={ach.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      ach.achieved 
                        ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20" 
                        : "opacity-60 hover:opacity-100"
                    )}
                    onClick={() => openDetailModal(ach.title, [ach], 'achievements')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0",
                          ach.achieved ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600" : "bg-muted text-muted-foreground"
                        )}>
                          <ach.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{ach.title}</p>
                            {ach.achieved && (
                              <Badge variant="default" className="bg-yellow-600">Получено</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{ach.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    История активности
                  </CardTitle>
                  <CardDescription>
                    Все ваши действия на платформе
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDetailModal('Активность', activities, 'activity')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  График
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.slice(0, 20).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openDetailModal(activity.title, [activity], 'activity')}
                  >
                    <div className={cn("p-2 rounded-lg", getActivityColor(activity.type))}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(activity.timestamp, 'dd MMM, HH:mm', { locale: ru })}
                        </div>
                      </div>
                      {activity.metadata?.orderId && (
                        <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-xs" asChild>
                          <Link href={`/orders/${activity.metadata.orderId}`}>
                            Посмотреть заказ <ArrowRight className="h-3 w-3 ml-1 inline" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Пока нет активности
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-3">
            <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => openDetailModal('Распределение активности', activities, 'stats')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Распределение активности</CardTitle>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Просмотры', value: activityStats.totalViews },
                        { name: 'Покупки', value: activityStats.totalPurchases },
                        { name: 'Избранное', value: activityStats.totalWishlist },
                        { name: 'Достижения', value: activityStats.achievements },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {['#3E82F7', '#10B981', '#EF4444', '#F59E0B'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => openDetailModal('Тренд активности', activities, 'activity')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Тренд активности</CardTitle>
                  <Button variant="ghost" size="sm">
                    <LineChart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={activities.slice(0, 7).map((a, i) => ({
                    day: format(a.timestamp, 'dd MMM', { locale: ru }),
                    value: i + 1,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3E82F7" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
        title={detailModal.title}
        data={detailModal.data}
        period={period}
        onPeriodChange={setPeriod}
      />
    </div>
  );
}

