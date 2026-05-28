'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface StreamDateDisplayProps {
  date: string;
  isLive?: boolean;
}

export function StreamDateDisplay({ date, isLive = false }: StreamDateDisplayProps) {
  const [formattedDate, setFormattedDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && date) {
      if (isLive) {
        const startTime = parseISO(date).getTime();
        const updateElapsedTime = () => {
          const now = new Date().getTime();
          const distance = now - startTime;
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setFormattedDate(
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        };

        updateElapsedTime();
        const interval = setInterval(updateElapsedTime, 1000);
        return () => clearInterval(interval);
      } else if (new Date(date) > new Date()) {
        setFormattedDate(format(parseISO(date), "d MMM yyyy 'в' HH:mm", { locale: ru }));
      } else {
        setFormattedDate(formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ru }));
      }
    }
  }, [date, isClient, isLive]);

  if (!isClient) {
    return <span className="text-sm text-muted-foreground">Загрузка...</span>;
  }

  const Tag = isLive ? 'div' : 'p';

  return (
    <Tag
      className={`text-xs ${isLive ? 'rounded-md bg-black/50 px-2 py-1 font-mono text-white' : 'text-muted-foreground'}`}
    >
      {formattedDate}
    </Tag>
  );
}
