'use client';

import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  DEFAULT_USER_SETTINGS,
  USER_SETTINGS_UPDATED_EVENT,
  applyUiPreferences,
  readUserSettings,
  writeUserSettings,
  type UserSettings,
} from '@/lib/user-settings';
import type { UserProfile } from '@/lib/types';

export function useSettingsForm(user: UserProfile) {
  const { toast } = useToast();
  const [draft, setDraft] = useState<UserSettings>(() => readUserSettings());
  const [isSaving, setIsSaving] = useState(false);

  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNext, setPwdNext] = useState('');
  const [pwdNext2, setPwdNext2] = useState('');
  const [resetEmail, setResetEmail] = useState(user.email);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => setDraft(readUserSettings());
    window.addEventListener(USER_SETTINGS_UPDATED_EVENT, sync);
    return () => window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, sync);
  }, []);

  const save = async () => {
    setIsSaving(true);
    try {
      writeUserSettings(draft);
      applyUiPreferences(draft);
      toast({ title: 'Настройки сохранены' });
    } finally {
      setIsSaving(false);
    }
  };

  /** Скачать JSON: профиль (без секретов) + текущие настройки из localStorage. */
  const exportSettingsJson = () => {
    if (typeof window === 'undefined') return;
    const payload = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      profile: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      settings: readUserSettings(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntha-settings-${user.uid.slice(0, 8)}.json`;
    a.rel = 'noopener';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Файл сохранён', description: 'Экспорт настроек и профиля в JSON.' });
  };

  /** Сбросить только сохранённые настройки UI (ключ user-settings), без токенов авторизации. */
  const resetLocalSettingsToDefaults = () => {
    if (typeof window === 'undefined') return;
    writeUserSettings(DEFAULT_USER_SETTINGS);
    applyUiPreferences(DEFAULT_USER_SETTINGS);
    setDraft(readUserSettings());
    toast({
      title: 'Локальные настройки сброшены',
      description: 'Интерфейс возвращён к значениям по умолчанию на этом устройстве.',
    });
  };

  const updateDraft = (updater: (s: UserSettings) => UserSettings) => {
    setDraft(updater);
  };

  return {
    draft,
    setDraft,
    isSaving,
    save,
    updateDraft,
    changePwdOpen,
    setChangePwdOpen,
    resetPwdOpen,
    setResetPwdOpen,
    pwdCurrent,
    setPwdCurrent,
    pwdNext,
    setPwdNext,
    pwdNext2,
    setPwdNext2,
    resetEmail,
    setResetEmail,
    isPreviewOpen,
    setIsPreviewOpen,
    exportSettingsJson,
    resetLocalSettingsToDefaults,
  };
}
