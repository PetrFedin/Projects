'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client root boundary: keep logging minimal; avoid Sentry/telemetry hooks here.
    console.error('[global-error]', error.digest ?? 'no-digest', error.stack ?? error.message);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          <div style={{ maxWidth: 560, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>Произошла ошибка приложения</h1>
            <p style={{ opacity: 0.8, marginBottom: 16 }}>
              Попробуйте перезагрузить страницу. Если ошибка повторяется, откройте приложение
              заново.
            </p>
            <button
              onClick={reset}
              style={{
                border: '1px solid #d4d4d8',
                borderRadius: 10,
                background: '#111827',
                color: 'white',
                padding: '10px 14px',
                cursor: 'pointer',
              }}
            >
              Попробовать снова
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
