'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ruler, User } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/** ASOS-style: гид по размерам и рекомендатор. Measurements в профиле — вынести в товар. */
const MOCK_SIZE_TABLE = [
  { size: 'XS', chest: '84-88', waist: '64-68', hips: '88-92', sleeve: '58', length: '62' },
  { size: 'S', chest: '88-92', waist: '68-72', hips: '92-96', sleeve: '60', length: '64' },
  { size: 'M', chest: '92-96', waist: '72-76', hips: '96-100', sleeve: '62', length: '66' },
  { size: 'L', chest: '96-100', waist: '76-80', hips: '100-104', sleeve: '64', length: '68' },
  { size: 'XL', chest: '100-104', waist: '80-84', hips: '104-108', sleeve: '66', length: '70' },
];

export function SizeGuide() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Ruler className="h-4 w-4" /> Таблица размеров (см)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-border-default border-b">
                <th className="py-2 pr-3 font-medium">Размер</th>
                <th className="py-2 pr-3 font-medium">Грудь</th>
                <th className="py-2 pr-3 font-medium">Талия</th>
                <th className="py-2 pr-3 font-medium">Бёдра</th>
                <th className="py-2 pr-3 font-medium">Рукав</th>
                <th className="py-2 font-medium">Длина</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SIZE_TABLE.map((row) => (
                <tr key={row.size} className="border-border-subtle border-b">
                  <td className="py-2 pr-3 font-medium">{row.size}</td>
                  <td className="text-text-secondary py-2 pr-3">{row.chest}</td>
                  <td className="text-text-secondary py-2 pr-3">{row.waist}</td>
                  <td className="text-text-secondary py-2 pr-3">{row.hips}</td>
                  <td className="text-text-secondary py-2 pr-3">{row.sleeve}</td>
                  <td className="text-text-secondary py-2">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/** Рекомендатор размера по меркам из профиля. */
export function SizeRecommender({
  recommendedSize,
  hasMeasurements,
}: {
  recommendedSize?: string;
  hasMeasurements?: boolean;
}) {
  return (
    <Card className="border-accent-primary/20 bg-accent-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <User className="text-accent-primary h-4 w-4" /> Подбор размера
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hasMeasurements && recommendedSize ? (
          <p className="text-sm">
            По вашим меркам из профиля рекомендуем размер <strong>{recommendedSize}</strong>.
          </p>
        ) : (
          <p className="text-text-secondary text-sm">
            Укажите мерки в профиле — мы подберём размер автоматически.
          </p>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.client.profile}>Мерки в профиле</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
