'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lookboard } from '@/lib/types';

interface LookboardCardProps {
  lookboard: Lookboard;
}

export default function LookboardCard({ lookboard }: LookboardCardProps) {
  const displayedLooks = lookboard.looks.slice(0, 4);
  const remainingCount = lookboard.looks.length > 4 ? lookboard.looks.length - 4 : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{lookboard.title}</CardTitle>
            <CardDescription>{lookboard.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-2">
          {displayedLooks.map((look, index) => (
            <div
              key={look.id}
              className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted"
            >
              <Image
                src={look.imageUrl}
                alt={look.description}
                fill
                className="object-cover"
                data-ai-hint={look.imageHint}
              />
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-base font-bold text-white">+{remainingCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          Посмотреть лукборд
        </Button>
      </CardFooter>
    </Card>
  );
}
