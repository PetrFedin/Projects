import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';

interface OrderStats {
  totalSpent: number;
  totalOrders: number;
  avgOrderValue: number;
  returnRate: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
}

/**
 * Хук для загрузки и управления заказами пользователя
 * Предоставляет единую точку доступа к данным заказов с кэшированием
 */
export function useUserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError(err instanceof Error ? err : new Error('Failed to load orders'));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  // Расчет статистики заказов
  const stats: OrderStats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const returnRate =
      (orders.filter((o) => o.returnRequested).length / Math.max(1, orders.length)) * 100;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const ordersByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalSpent,
      totalOrders,
      avgOrderValue,
      returnRate,
      recentOrders,
      ordersByStatus,
    };
  }, [orders]);

  const refreshOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userOrders = await ordersRepository.getOrders(user.uid);
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to refresh orders:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh orders'));
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    stats,
    loading,
    error,
    refreshOrders,
  };
}
