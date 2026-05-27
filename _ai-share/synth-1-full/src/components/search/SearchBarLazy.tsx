'use client';

import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Command palette + framer-motion — отдельный чанк; placeholder совпадает с кнопкой поиска в header. */
export const SearchBar = dynamic(
  () => import('@/components/search/SearchBar').then((m) => ({ default: m.SearchBar })),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        aria-label="Поиск по платформе"
        disabled
      >
        <Search className="h-3.5 w-3.5 opacity-40" />
      </Button>
    ),
  }
);
