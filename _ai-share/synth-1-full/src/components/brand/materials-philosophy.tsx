'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const materials = [
  {
    name: 'Кашемир класса А',
    description: 'Невероятно мягкий и теплый, полученный этичным способом.',
    imageUrl: 'https://images.unsplash.com/photo-1620953902341-3c6620311756?q=80&w=800',
  },
  {
    name: 'Технологичная мембрана',
    description: 'Защищает от ветра и влаги, сохраняя при этом воздухопроницаемость.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d919b5ca2332?q=80&w=800',
  },
  {
    name: 'Органический хлопок',
    description: 'Выращен без пестицидов, гипоаллергенен и приятен к телу.',
    imageUrl: 'https://images.unsplash.com/photo-1594938362947-8a192884a45a?q=80&w=800',
  },
];

export function MaterialsPhilosophy() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Философия материалов</CardTitle>
        <CardDescription>Качество и инновации в каждой нити.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {materials.map((material) => (
          <div key={material.name} className="group relative overflow-hidden rounded-lg">
            <div className="relative aspect-[4/3]">
              <Image
                src={material.imageUrl}
                alt={material.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 p-3 text-white">
                <h4 className="font-semibold">{material.name}</h4>
                <p className="text-xs opacity-80">{material.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
