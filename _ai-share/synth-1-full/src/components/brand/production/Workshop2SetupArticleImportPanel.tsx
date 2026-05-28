'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { importWorkshop2ArticlesCsv } from '@/lib/production/workshop2-references-client';
import { WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS } from '@/lib/production/workshop2-articles-import';

type Props = {
  defaultCollectionId?: string;
};

/** Панель импорта артикулов CSV на странице setup. */
export function Workshop2SetupArticleImportPanel({ defaultCollectionId = 'SS27' }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [collectionId, setCollectionId] = useState(defaultCollectionId);
  const [commitToServer, setCommitToServer] = useState(false);

  const runImport = useCallback(
    async (file: File) => {
      setBusy(true);
      setMessage(null);
      try {
        const csv = await file.text();
        const res = await importWorkshop2ArticlesCsv(csv, collectionId.trim() || undefined, {
          commit: commitToServer,
        });
        if (!res) {
          setMessage('Ошибка сети при вызове API импорта.');
          return;
        }
        if (!res.ok && res.imported === 0) {
          setMessage(res.message ?? res.error ?? 'Импорт не выполнен.');
          return;
        }
        const commitPart =
          res.commit && typeof res.committed === 'number'
            ? ` На сервер записано досье: ${res.committed}.`
            : commitToServer
              ? ''
              : ' Примените строки в хабе или включите «Записать досье на сервер».';
        setMessage(
          `Собрано ${res.imported} из ${res.total} строк (ошибок: ${res.failed}).${commitPart}`
        );
      } finally {
        setBusy(false);
      }
    },
    [collectionId, commitToServer]
  );

  return (
    <div className="space-y-3 text-sm text-slate-700">
      <p>
        Пакетное создание артикулов: CSV{' '}
        <code className="text-[11px]">sku,name,audience,leafId</code> — до{' '}
        {WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS} строк. API:{' '}
        <code className="text-[11px]">POST /api/workshop2/articles/import</code>
      </p>
      <p>
        <Link
          href="/workshop2/sample-articles-import.csv"
          className="text-indigo-600 underline"
          download
        >
          Скачать образец CSV
        </Link>
      </p>
      <label className="flex items-center gap-2 text-xs text-slate-700">
        <input
          type="checkbox"
          checked={commitToServer}
          onChange={(e) => setCommitToServer(e.target.checked)}
        />
        Записать досье на сервер (PUT по каждой строке)
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-slate-600">
          collectionId (для метаданных ответа)
        </span>
        <input
          className="h-8 w-full max-w-xs rounded-md border border-slate-200 px-2 text-xs"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
        />
      </label>
      <div>
        <Button type="button" variant="outline" size="sm" disabled={busy} asChild>
          <label className="cursor-pointer">
            {busy ? 'Импорт…' : 'Загрузить CSV и проверить сборку'}
            <input
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void runImport(f);
                e.target.value = '';
              }}
            />
          </label>
        </Button>
      </div>
      {message ? <p className="text-xs text-slate-600">{message}</p> : null}
    </div>
  );
}
