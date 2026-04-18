'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowLeft } from 'lucide-react';
import { ROUTES, passportById } from '@/lib/routes';

/** Примеры паспортов для перехода (при API — список из бэкенда) */
const EXAMPLE_PASSPORT_IDS = ['PASS-9921', 'PASS-9922'];

export default function ClientPassportHubPage() {
  return (
    <div className="container max-w-2xl space-y-6 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.client.home} aria-label="Назад">
          <Button variant="ghost" size="icon" aria-label="Назад">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Digital Passport</h1>
<<<<<<< HEAD
          <p className="text-sm text-slate-500">
=======
          <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            История и аутентичность вещей. Выберите паспорт или введите ID.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Мои паспорта
          </CardTitle>
          <CardDescription>При подключении API здесь будет список ваших паспортов.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {EXAMPLE_PASSPORT_IDS.map((id) => (
              <li key={id}>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={passportById(id)}>{id}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
