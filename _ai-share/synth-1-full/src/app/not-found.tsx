import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4 sm:gap-6 sm:p-6 md:p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-5xl font-black text-slate-900 sm:text-6xl md:text-7xl">404</h1>
        <p className="text-sm font-medium text-slate-500 sm:text-base">Страница не найдена</p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild>
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/" className="gap-2">
            <Search className="h-4 w-4" />
            Поиск
          </Link>
        </Button>
      </div>
    </div>
  );
}
