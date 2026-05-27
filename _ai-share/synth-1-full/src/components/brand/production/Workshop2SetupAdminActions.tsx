'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { syncWorkshop2CategoriesFromHandbook } from '@/lib/production/workshop2-references-client';

/** Кнопки админ-синхронизации справочников (setup). */
export function Workshop2SetupAdminActions() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSyncCategories = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await syncWorkshop2CategoriesFromHandbook();
      if (!res) {
        setMessage('Ошибка сети.');
        return;
      }
      setMessage(res.message ?? (res.ok ? 'Готово.' : (res.error ?? 'Ошибка')));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={syncing}
        onClick={() => void onSyncCategories()}
      >
        {syncing ? 'Синхронизация…' : 'Синхронизировать категории в PG'}
      </Button>
      <p className="text-xs text-slate-600">
        Идемпотентно загружает 133 листа из <code>category-handbook.snapshot.json</code> в{' '}
        <code>workshop2_category_leaves</code>. Требуется <code>WORKSHOP2_DATABASE_URL</code>.
      </p>
      {message ? <p className="text-xs text-slate-800">{message}</p> : null}
    </div>
  );
}
