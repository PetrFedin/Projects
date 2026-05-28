'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { reportError } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4 sm:gap-6 sm:p-6 md:p-8">
      <div className="flex w-full max-w-md flex-col items-center gap-3 text-center sm:gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 sm:h-14 sm:w-14">
          <AlertTriangle className="h-6 w-6 text-destructive sm:h-7 sm:w-7" />
        </div>
        <h2 className="text-lg font-bold sm:text-xl md:text-2xl">Что-то пошло не так</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу.
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}
