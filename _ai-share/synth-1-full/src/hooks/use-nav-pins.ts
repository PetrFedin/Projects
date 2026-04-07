'use client';

import { useState, useCallback, useEffect } from 'react';
import * as store from '@/lib/nav-pins-store';

export function useNavPins() {
  const [pins, setPins] = useState<Record<string, store.NavPinEntry>>({});

  const load = useCallback(() => {
    setPins(store.getAllPins());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePin = useCallback((key: string) => {
    store.togglePin(key);
    load();
  }, [load]);

  const setReminder = useCallback((key: string, reminder: string | undefined) => {
    store.setReminder(key, reminder);
    load();
  }, [load]);

  return { pins, togglePin, setReminder, refresh: load };
}
