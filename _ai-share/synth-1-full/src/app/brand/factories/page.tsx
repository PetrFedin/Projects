'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { MoreHorizontal, PlusCircle, Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';
const factories = [
  {
    id: 'f1',
    name: 'Фабрика #1 (Москва)',
    specialization: 'Верхняя одежда, трикотаж',
    load: 75,
    qualityRating: 4.8,
    activeOrders: 3,
  },
  {
    id: 'f2',
    name: 'Ателье "Стежок" (СПб)',
    specialization: 'Платья, костюмы',
    load: 90,
    qualityRating: 4.9,
    activeOrders: 5,
  },
  {
    id: 'f3',
    name: 'Portugal Knits, LDA',
    specialization: 'Премиум трикотаж',
    load: 60,
    qualityRating: 4.7,
    activeOrders: 2,
  },
];

export default function FactoriesPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="Производства"
        leadPlain="Управление вашими производственными партнерами и фабриками."
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить производство
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список производств</CardTitle>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск по названию или специализации..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Специализация</TableHead>
                <TableHead>Активные заказы</TableHead>
                <TableHead>Загруженность</TableHead>
                <TableHead>Рейтинг качества</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factories.map((factory) => (
                <TableRow key={factory.id} className="group">
                  <TableCell className="font-medium">
                    <Link
                      href={`${ROUTES.brand.factories}/${factory.id}`}
                      className="hover:text-accent-primary flex items-center gap-2"
                    >
                      {factory.name}
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{factory.specialization}</Badge>
                  </TableCell>
                  <TableCell>{factory.activeOrders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={factory.load} className="w-24" />
                      <span>{factory.load}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{factory.qualityRating}/5.0</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/brand/factories/${factory.id}`}>Карточка фабрики</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </RegistryPageShell>
  );
}
