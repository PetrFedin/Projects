'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Clock, X, TrendingUp, Filter, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount?: number;
  filters?: Record<string, any>;
}

export default function SearchHistory() {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (!user) return;

    // Загружаем историю поиска из localStorage
    const stored = localStorage.getItem(`search_history_${user.uid}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setSearchHistory(parsed);
        setFilteredHistory(parsed);
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!searchFilter.trim()) {
      setFilteredHistory(searchHistory);
      return;
    }

    const filtered = searchHistory.filter(item =>
      item.query.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchFilter, searchHistory]);

  const handleClearHistory = () => {
    if (!user) return;
    localStorage.removeItem(`search_history_${user.uid}`);
    setSearchHistory([]);
    setFilteredHistory([]);
  };

  const handleRemoveItem = (id: string) => {
    if (!user) return;
    const updated = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updated);
    setFilteredHistory(updated.filter(item =>
      !searchFilter.trim() || item.query.toLowerCase().includes(searchFilter.toLowerCase())
    ));
    localStorage.setItem(`search_history_${user.uid}`, JSON.stringify(updated));
  };

  const popularSearches = searchHistory
    .reduce((acc, item) => {
      const existing = acc.find(p => p.query === item.query);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ query: item.query, count: 1 });
      }
      return acc;
    }, [] as Array<{ query: string; count: number }>)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-accent" />
              История поиска
            </CardTitle>
            <CardDescription className="mt-1">
              Ваши недавние поисковые запросы
            </CardDescription>
          </div>
          {searchHistory.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <X className="mr-2 h-4 w-4" />
              Очистить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {searchHistory.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в истории..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {filteredHistory.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {searchHistory.length === 0
                ? 'История поиска пуста'
                : 'Ничего не найдено'}
            </p>
            <p className="text-sm mt-2">
              {searchHistory.length === 0
                ? 'Ваши поисковые запросы будут сохраняться здесь'
                : 'Попробуйте другой запрос'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/search?q=${encodeURIComponent(item.query)}`}
                        className="font-medium hover:text-accent transition-colors block truncate"
                      >
                        {item.query}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(item.timestamp, 'd MMM yyyy, HH:mm', { locale: ru })}
                        {item.resultsCount !== undefined && (
                          <span className="ml-2">
                            • {item.resultsCount} {item.resultsCount === 1 ? 'результат' : 'результатов'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link href={`/search?q=${encodeURIComponent(item.query)}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {popularSearches.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Популярные запросы</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((popular, index) => (
                    <Link
                      key={index}
                      href={`/search?q=${encodeURIComponent(popular.query)}`}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {popular.query}
                        <span className="ml-2 text-xs opacity-70">
                          {popular.count}x
                        </span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}





