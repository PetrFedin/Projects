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

  const updateDraft = (updater: (s: UserSettings) => UserSettings) => {
    setDraft(updater);
  };

  return {
    draft, setDraft, isSaving, save, updateDraft,
    changePwdOpen, setChangePwdOpen, resetPwdOpen, setResetPwdOpen,
    pwdCurrent, setPwdCurrent, pwdNext, setPwdNext, pwdNext2, setPwdNext2,
    resetEmail, setResetEmail, isPreviewOpen, setIsPreviewOpen
  };
}
