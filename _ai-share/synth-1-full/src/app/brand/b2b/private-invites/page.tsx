'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Shield, Plus, Trash2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/** Brandboom: Private Invites по домену — доступ по корпоративному email */
const MOCK_INVITES = [
  {
    id: 'i1',
    domain: 'store.ru',
    companyName: 'Сеть «Мода»',
    role: 'buyer' as const,
    active: true,
  },
  {
    id: 'i2',
    domain: 'fashion-group.com',
    companyName: 'Fashion Group',
    role: 'admin' as const,
    active: true,
  },
  {
    id: 'i3',
    domain: 'concept.ru',
    companyName: 'Concept Store',
    role: 'viewer' as const,
    active: false,
  },
];

export default function PrivateInvitesPage() {
  const [newDomain, setNewDomain] = useState('');
  const [newCompany, setNewCompany] = useState('');

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.brand.b2bEngagement}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Mail className="h-6 w-6" /> Private Invites
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Brandboom: доступ к B2B по корпоративному домену — только @store.ru и т.д.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Домены с доступом</CardTitle>
          <CardDescription>
            Пользователи с email на указанном домене смогут войти в B2B-портал без отдельной заявки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Домен (store.ru)"
              className="max-w-[200px]"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <Input
              placeholder="Название компании"
              className="max-w-[200px]"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
            />
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Добавить
            </Button>
          </div>
          <ul className="space-y-2">
            {MOCK_INVITES.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between rounded-lg border bg-slate-50/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="font-mono text-sm">@{i.domain}</span>
                  {i.companyName && <span className="text-slate-500">— {i.companyName}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={i.active ? 'default' : 'secondary'}>{i.role}</Badge>
                  <Badge variant={i.active ? 'default' : 'outline'}>
                    {i.active ? 'Активен' : 'Отключён'}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Как это работает</CardTitle>
          <CardDescription>
            Регистрация по домену: байер с email buyer@store.ru получает доступ, если домен store.ru
            добавлен в список.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.buyerApplications}>Заявки на партнёрство</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.b2bEngagement}>B2B Engagement</Link>
        </Button>
      </div>
    </div>
  );
}
