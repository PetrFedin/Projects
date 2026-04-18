'use client';

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
import Image from 'next/image';
import { ArrowUpRight, BarChart, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { priceComparisonData, type PriceComparisonEntry } from '@/lib/price-comparison';

interface PriceComparisonTableProps {
  productId: string;
}

const getAvailabilityInfo = (status: PriceComparisonEntry['availability']) => {
  switch (status) {
    case 'in_stock':
      return { text: 'В наличии', icon: CheckCircle2, color: 'text-green-500' };
    case 'pre_order':
      return { text: 'Предзаказ', icon: Clock, color: 'text-amber-500' };
    case 'out_of_stock':
      return { text: 'Нет в наличии', icon: AlertCircle, color: 'text-red-500' };
  }
};

export default function PriceComparisonTable({ productId }: PriceComparisonTableProps) {
  const data = priceComparisonData[productId as keyof typeof priceComparisonData];

  if (!data) {
    return null; // Or show a message that no comparison data is available
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-6 w-6" />
          Сравнение цен
        </CardTitle>
        <CardDescription>
          Цены на этот товар на других платформах. Данные обновлены {data.lastChecked}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Платформа</TableHead>
              <TableHead>Наличие</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="text-right">Перейти</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.offers.map((offer) => {
              const availability = getAvailabilityInfo(offer.availability);
              return (
                <TableRow key={offer.platform}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
                        <Image
                          src={offer.logoUrl}
                          alt={offer.platform}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{offer.platform}</p>
                        <p className="text-xs text-muted-foreground">{offer.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <availability.icon className={`h-4 w-4 ${availability.color}`} />
                      <span className={availability.color}>{availability.text}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold">{offer.price.toLocaleString('ru-RU')} ₽</p>
                      {offer.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {offer.originalPrice.toLocaleString('ru-RU')} ₽
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-accent hover:underline"
                    >
                      В магазин <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
