'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { MoreHorizontal, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useUIState } from '@/providers/ui-state';

interface ProductListProps {
  products: Product[];
  onTogglePromotion: (product: Product) => void;
}

export default function ProductList({ products, onTogglePromotion }: ProductListProps) {
  const { getProductAvailability } = useUIState();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Изображение</span>
          </TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="hidden md:table-cell">Цена</TableHead>
          <TableHead className="hidden md:table-cell">Продано</TableHead>
          <TableHead>
            <span className="sr-only">Действия</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const availability = getProductAvailability(product);
          return (
            <TableRow key={product.id} data-promoted={product.isPromoted}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={product.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={product.images[0].url}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">
                <div>{product.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{product.sku}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={availability.status === 'in_stock' ? 'outline' : 'secondary'}
                  className={
                    availability.status === 'in_stock' ? 'border-green-600 text-green-600' : ''
                  }
                >
                  {availability.text}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.price.toLocaleString('ru-RU')} ₽
              </TableCell>
              <TableCell className="hidden md:table-cell">25</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Действия</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/brand/products/${product.id}`}>Редактировать</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTogglePromotion(product)}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {product.isPromoted ? 'Управлять продвижением' : 'Продвигать товар'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Удалить</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
