'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { colorPalette } from '@/lib/colors';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Palette, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
<<<<<<< HEAD
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

export default function ColorsPage() {
  return (
    <div className="space-y-4">
      <SectionInfoCard
        title="Справочник цветов"
        description="Палитра цветов для карточек товаров. Связь с Products (цвета SKU), Matrix (варианты) и PIM."
        icon={Palette}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              SKU Colors
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/products">Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/products/matrix">
                <Layers className="mr-1 h-3 w-3" /> Matrix
              </Link>
            </Button>
          </>
        }
      />
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-base font-bold">Справочник цветов</h1>
          <p className="text-muted-foreground">
            Управление палитрой цветов, используемой на платформе.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить цвет
        </Button>
      </header>
=======
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

export default function ColorsPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="Справочник цветов"
        leadPlain="Палитра для карточек товаров. Связь с Products (цвета SKU), Matrix (варианты) и PIM."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Palette className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <Badge variant="outline" className="text-[9px]">
              SKU Colors
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.products}>Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.productsMatrix}>
                <Layers className="mr-1 size-3" /> Matrix
              </Link>
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить цвет
            </Button>
          </div>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Card>
        <CardHeader>
          <CardTitle>Основная палитра</CardTitle>
          <CardDescription>Эти цвета доступны для выбора в карточке товара.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {colorPalette.map((color) => (
              <div key={color.hex} className="space-y-2">
                <div
                  className="h-20 w-full rounded-md border"
                  style={{ backgroundColor: color.hex }}
<<<<<<< HEAD
                ></div>
=======
                />
>>>>>>> recover/cabinet-wip-from-stash
                <Input value={color.name} readOnly />
                <Input value={color.hex} readOnly />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
