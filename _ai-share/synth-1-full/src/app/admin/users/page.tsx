'use client';

<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system/registry-page-shell';
>>>>>>> recover/cabinet-wip-from-stash
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MoreHorizontal, PlusCircle, Search } from 'lucide-react';
<<<<<<< HEAD
import Image from 'next/image';
=======
>>>>>>> recover/cabinet-wip-from-stash
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const mockUsers = [
  {
    id: '1',
    name: 'Анна Новикова',
    email: 'anna.novikova@example.com',
    role: 'client',
    status: 'Активен',
    lastActivity: '2 часа назад',
    avatar: 'https://picsum.photos/seed/user1/40/40',
  },
  {
    id: '2',
    name: 'Syntha HQ',
    email: 'admin@syntha.com',
    role: 'admin',
    status: 'Активен',
    lastActivity: '15 минут назад',
    avatar: 'https://picsum.photos/seed/syntha-logo/40/40',
  },
  {
    id: '3',
    name: 'Podium Store',
    email: 'contact@podium.store',
    role: 'shop',
    status: 'Активен',
    lastActivity: '1 день назад',
    avatar: 'https://picsum.photos/seed/podium-logo/40/40',
  },
  {
    id: '4',
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    role: 'client',
    status: 'Заблокирован',
    lastActivity: '3 недели назад',
    avatar: 'https://picsum.photos/seed/user2/40/40',
  },
  {
    id: '5',
    name: 'ModaTech Factory',
    email: 'orders@modatech.pro',
    role: 'manufacturer',
    status: 'Активен',
    lastActivity: '10 минут назад',
    avatar: 'https://picsum.photos/seed/factory1/40/40',
  },
  {
    id: '6',
    name: 'Hub-Central Dist',
    email: 'logistics@hub.com',
    role: 'distributor',
    status: 'Активен',
    lastActivity: '5 часов назад',
    avatar: 'https://picsum.photos/seed/dist1/40/40',
  },
];

const roleConfig = {
<<<<<<< HEAD
  admin: { label: 'Админ HQ', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
=======
  admin: {
    label: 'Админ HQ',
    color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
  },
>>>>>>> recover/cabinet-wip-from-stash
  brand: { label: 'Бренд', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  manufacturer: { label: 'Производство', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  supplier: { label: 'Поставщик', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  distributor: { label: 'Дистрибьютор', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  shop: { label: 'Магазин', color: 'bg-rose-50 text-rose-600 border-rose-100' },
<<<<<<< HEAD
  client: { label: 'Клиент', color: 'bg-slate-50 text-slate-600 border-slate-100' },
};

export default function UsersPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Активен':
        return 'outline';
      case 'Заблокирован':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span>Admin</span>
            <ChevronRight className="h-2 w-2" />
            <span className="text-slate-300">Identity Registry</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
              Network Participants
=======
  client: { label: 'Клиент', color: 'bg-bg-surface2 text-text-secondary border-border-subtle' },
};

export default function UsersPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-4 py-4 duration-700 animate-in fade-in">
      <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <span>Админ-центр</span>
            <ChevronRight className="h-2 w-2" />
            <span className="text-text-muted">Реестр учётных записей</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
              Участники платформы
>>>>>>> recover/cabinet-wip-from-stash
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm transition-all"
            >
<<<<<<< HEAD
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Nodes:
=======
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Узлы:
>>>>>>> recover/cabinet-wip-from-stash
              124,103
            </Badge>
          </div>
        </div>
<<<<<<< HEAD
        <Button className="h-8 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
          <PlusCircle className="h-3.5 w-3.5" /> Provision User
=======
        <Button className="bg-text-primary hover:bg-accent-primary border-text-primary h-8 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
          <PlusCircle className="h-3.5 w-3.5" /> Создать пользователя
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
      </div>

      <div className="space-y-4">
        {/* Toolbar */}
<<<<<<< HEAD
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <div className="flex shrink-0 items-center gap-1.5 px-1">
            <div className="group relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
              <Input
                placeholder="Filter by Identity..."
                className="h-7 w-32 rounded-lg border-slate-200 bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500 md:w-64"
=======
        <div className="bg-bg-surface2 border-border-default flex items-center justify-between rounded-xl border p-1 shadow-inner">
          <div className="flex shrink-0 items-center gap-1.5 px-1">
            <div className="group relative">
              <Search className="text-text-muted group-focus-within:text-accent-primary absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
              <Input
                placeholder="Поиск по профилю..."
                className="border-border-default focus:ring-accent-primary h-7 w-32 rounded-lg bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 md:w-64"
>>>>>>> recover/cabinet-wip-from-stash
              />
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="h-10 px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Identity / Metadata
                </TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  System Role
                </TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Pulse Index
                </TableHead>
                <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Status
                </TableHead>
                <TableHead className="h-10 w-24 px-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
        <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
          <Table>
            <TableHeader>
              <TableRow className="bg-bg-surface2/80 hover:bg-bg-surface2/80 border-border-subtle border-b">
                <TableHead className="text-text-muted h-10 px-4 text-[9px] font-bold uppercase tracking-[0.2em]">
                  Профиль / метаданные
                </TableHead>
                <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                  Системная роль
                </TableHead>
                <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                  Индекс активности
                </TableHead>
                <TableHead className="text-text-muted h-10 text-[9px] font-bold uppercase tracking-[0.2em]">
                  Status
                </TableHead>
                <TableHead className="text-text-muted h-10 w-24 px-4 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
<<<<<<< HEAD
            <TableBody className="divide-y divide-slate-50">
=======
            <TableBody className="divide-border-subtle divide-y">
>>>>>>> recover/cabinet-wip-from-stash
              {mockUsers.map((user) => {
                const role = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.client;
                return (
                  <TableRow
                    key={user.id}
<<<<<<< HEAD
                    className="group h-12 transition-all hover:bg-slate-50/50"
                  >
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
=======
                    className="hover:bg-bg-surface2/80 group h-12 transition-all"
                  >
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-border-subtle h-7 w-7 border shadow-sm transition-transform group-hover:scale-110">
>>>>>>> recover/cabinet-wip-from-stash
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-[10px] font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
<<<<<<< HEAD
                          <span className="mb-1 truncate text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
                            {user.name}
                          </span>
                          <span className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
                          <span className="text-text-primary mb-1 truncate text-[11px] font-bold uppercase leading-none tracking-tight">
                            {user.name}
                          </span>
                          <span className="text-text-muted truncate text-[9px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                          role.color
                        )}
                      >
                        {role.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
<<<<<<< HEAD
                      <span className="text-[10px] font-bold uppercase tabular-nums tracking-tight text-slate-400">
=======
                      <span className="text-text-muted text-[10px] font-bold uppercase tabular-nums tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {user.lastActivity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                          user.status === 'Активен'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : 'border-rose-100 bg-rose-50 text-rose-600'
                        )}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
<<<<<<< HEAD
                            className="h-7 w-7 rounded-lg text-slate-400 opacity-0 transition-all hover:bg-slate-100 group-hover:opacity-100"
=======
                            className="text-text-muted hover:bg-bg-surface2 h-7 w-7 rounded-lg opacity-0 transition-all group-hover:opacity-100"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-[140px] text-[10px] font-bold uppercase tracking-widest"
                        >
                          {user.role === 'client' && (
                            <DropdownMenuItem asChild>
                              <Link href="/customer-360" className="flex items-center gap-2">
<<<<<<< HEAD
                                Identity 360°
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2">Edit Entity</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">Shift Role</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                            Deactivate
=======
                                Профиль 360°
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2">Изменить профиль</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">Сменить роль</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                            Деактивировать
>>>>>>> recover/cabinet-wip-from-stash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
<<<<<<< HEAD
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
              Displaying {mockUsers.length} active nodes
            </span>
            <div className="flex gap-1">
              <button
                className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                disabled
              >
                PREV
              </button>
              <button className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50">
                NEXT
=======
          <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t px-4 py-2">
            <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-60">
              Показано активных узлов: {mockUsers.length}
            </span>
            <div className="flex gap-1">
              <button
                className="border-border-default text-text-muted hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all disabled:opacity-50"
                disabled
              >
                НАЗАД
              </button>
              <button className="border-border-default text-text-secondary hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all">
                ДАЛЕЕ
>>>>>>> recover/cabinet-wip-from-stash
              </button>
            </div>
          </div>
        </Card>
      </div>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
