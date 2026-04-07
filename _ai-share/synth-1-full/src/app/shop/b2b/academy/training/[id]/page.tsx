'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { Store, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { getCollectionTrainingById } from '@/lib/academy/brand-academy-data';
import { COLLECTION_TRAINING_TYPE_LABELS } from '@/lib/academy/brand-academy-data';

export default function ShopTrainingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const training = getCollectionTrainingById(id);

  if (!training) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <p className="text-slate-500 mt-4">Обучение не найдено</p>
        <Button variant="outline" asChild className="mt-4"><Link href={ROUTES.shop.b2bAcademy}>В академию</Link></Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.shop.b2bAcademy}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">{training.title}</h1>
          <p className="text-sm text-slate-500">{training.collectionName} · {training.season}</p>
        </div>
      </div>

      <Card className="rounded-xl border border-slate-100">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{COLLECTION_TRAINING_TYPE_LABELS[training.type] ?? training.type}</Badge>
            <Badge variant="secondary" className="text-[10px]"><Clock className="h-2.5 w-2.5 mr-1 inline" /> {training.duration}</Badge>
            <Badge variant="secondary" className="text-[10px]"><BookOpen className="h-2.5 w-2.5 mr-1 inline" /> {training.modules} модулей</Badge>
          </div>
          <p className="text-slate-700 leading-relaxed">{training.description}</p>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href={ROUTES.shop.b2bAcademy}>← К списку тренингов</Link>
      </Button>
    </div>
  );
}
