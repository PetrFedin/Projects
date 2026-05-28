'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AppNotification {
  id: string;
  type: 'sla' | 'qc' | 'po' | 'payment' | 'order' | 'edo' | 'system';
  title: string;
  body?: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    setNotifications((prev) => [
      {
        ...n,
        id: `n-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Seed B2B-style notifications for demo (once per session)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = 'synth-notifications-seeded';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    addNotification({
      type: 'order',
      title: 'Заказ B2B-0012 зарезервирован',
      body: 'Syntha · 750 000 ₽',
      href: '/shop/b2b/orders',
    });
    addNotification({
      type: 'payment',
      title: 'Оплата по счёту получена',
      body: 'B2B-0011 · ЦУМ',
      href: '/shop/b2b/orders',
    });
    addNotification({
      type: 'system',
      title: 'Доступна видео-консультация',
      body: 'Забронируйте слот со стилистом',
      href: '/shop/b2b/video-consultation',
    });
  }, [addNotification]);

  // Simulated WebSocket / push — в проде подключить реальный WS
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () =>
      addNotification({
        type: 'system',
        title: 'Сеть восстановлена',
        body: 'Синхронизация продолжена',
      });
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [addNotification]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
