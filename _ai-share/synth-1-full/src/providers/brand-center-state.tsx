'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_RECENT = 'brand-center-recent';
const STORAGE_FAVORITES = 'brand-center-favorites';
const MAX_RECENT = 10;

export interface RecentPage {
  href: string;
  label: string;
  group?: string;
  visitedAt: number;
}

export interface FavoriteModule {
  id: string;
  href: string;
  label: string;
  group?: string;
}

interface BrandCenterState {
  recentPages: RecentPage[];
  favorites: FavoriteModule[];
  addRecent: (item: Omit<RecentPage, 'visitedAt'>) => void;
  addFavorite: (item: FavoriteModule) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteModule) => void;
}

const defaultState: BrandCenterState = {
  recentPages: [],
  favorites: [],
  addRecent: () => {},
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  toggleFavorite: () => {},
};

const BrandCenterContext = createContext<BrandCenterState>(defaultState);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function BrandCenterProvider({ children }: { children: React.ReactNode }) {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [favorites, setFavorites] = useState<FavoriteModule[]>([]);

  useEffect(() => {
    setRecentPages(loadFromStorage(STORAGE_RECENT, []));
    setFavorites(loadFromStorage(STORAGE_FAVORITES, []));
  }, []);

  const addRecent = useCallback((item: Omit<RecentPage, 'visitedAt'>) => {
    setRecentPages(prev => {
      const filtered = prev.filter(p => p.href !== item.href);
      const next: RecentPage[] = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT);
      saveToStorage(STORAGE_RECENT, next);
      return next;
    });
  }, []);

  const addFavorite = useCallback((item: FavoriteModule) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      const next = [...prev, item];
      saveToStorage(STORAGE_FAVORITES, next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id);
      saveToStorage(STORAGE_FAVORITES, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.some(f => f.id === id), [favorites]);

  const toggleFavorite = useCallback((item: FavoriteModule) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      const next = exists ? prev.filter(f => f.id !== item.id) : [...prev, item];
      saveToStorage(STORAGE_FAVORITES, next);
      return next;
    });
  }, []);

  const value: BrandCenterState = {
    recentPages,
    favorites,
    addRecent,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };

  return (
    <BrandCenterContext.Provider value={value}>
      {children}
    </BrandCenterContext.Provider>
  );
}

export function useBrandCenter() {
  const ctx = useContext(BrandCenterContext);
  return ctx || defaultState;
}
