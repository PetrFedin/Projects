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
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-md w-full">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-destructive" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Что-то пошло не так</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
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
