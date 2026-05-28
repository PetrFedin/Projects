import { useMemo } from 'react';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { useUserOrders } from './use-user-orders';

interface ActivityStats {
  wishlistCount: number;
  lookboardsCount: number;
  cartCount: number;
  ordersCount: number;
  totalActivity: number;
  engagementLevel: number;
  loyaltyPoints: number;
  loyaltyPlan: string;
}

/**
 * Хук для расчета статистики активности пользователя
 * Объединяет данные из разных источников (UI state, orders, user profile)
 */
export function useUserActivity() {
  const { wishlist, lookboards, cart } = useUIState();
  const { user } = useAuth();
  const { stats: orderStats } = useUserOrders();

  const activity: ActivityStats = useMemo(() => {
    const wishlistCount = wishlist.length;
    const lookboardsCount = lookboards.length;
    const cartCount = cart.length;
    const ordersCount = orderStats.totalOrders;

    const totalActivity = wishlistCount + lookboardsCount + cartCount + ordersCount;

    // Расчет уровня вовлеченности (0-100)
    const engagementLevel = Math.min(100, totalActivity * 10);

    const loyaltyPoints = user?.loyaltyPoints || 0;
    const loyaltyPlan = user?.loyaltyPlan || 'base';

    return {
      wishlistCount,
      lookboardsCount,
      cartCount,
      ordersCount,
      totalActivity,
      engagementLevel,
      loyaltyPoints,
      loyaltyPlan,
    };
  }, [
    wishlist.length,
    lookboards.length,
    cart.length,
    orderStats.totalOrders,
    user?.loyaltyPoints,
    user?.loyaltyPlan,
  ]);

  return activity;
}
