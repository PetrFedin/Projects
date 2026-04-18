'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import BrandCard from '@/components/brand-card';
=======
>>>>>>> recover/cabinet-wip-from-stash
import { brands } from '@/lib/placeholder-data';
import { products } from '@/lib/products';
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
<<<<<<< HEAD

export default function BrandsDirectoryPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-base font-bold">Справочник брендов</h1>
          <p className="text-muted-foreground">
            Управление всеми брендами, представленными на платформе.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить бренд
        </Button>
      </header>
=======
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function BrandsDirectoryPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="Справочник брендов"
        leadPlain="Управление всеми брендами, представленными на платформе."
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить бренд
          </Button>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Card>
        <CardHeader>
          <CardTitle>Все бренды</CardTitle>
          <CardDescription>На платформе зарегистрировано {brands.length} брендов.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Бренд</TableHead>
                <TableHead>Подписчики</TableHead>
                <TableHead>Товары</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => {
                const productCount = products.filter((p) => p.brand === brand.name).length;
                return (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md border p-1">
                          <Image
                            src={brand.logo.url}
                            alt={brand.logo.alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium">{brand.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{brand.followers.toLocaleString('ru-RU')}</TableCell>
                    <TableCell>{productCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-400 text-green-600">
                        Активен
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Редактировать</DropdownMenuItem>
                          <DropdownMenuItem>Деактивировать</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
