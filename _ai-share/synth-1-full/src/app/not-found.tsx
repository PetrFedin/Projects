import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900">404</h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">Страница не найдена</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
