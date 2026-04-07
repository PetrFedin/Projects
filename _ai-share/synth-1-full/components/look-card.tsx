'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';

import type { Look } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LookCardProps {
  look: Look;
  showAuthor?: boolean;
  className?: string;
}

export default function LookCard({ look, showAuthor = true, className }: LookCardProps) {
  return (
    <Card className={cn("break-inside-avoid overflow-hidden group", className)}>
      {showAuthor && look.author && (
        <CardHeader className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9" data-ai-hint="person face">
              <AvatarImage src={look.author.avatarUrl} alt={look.author.name} />
              <AvatarFallback>{look.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-sm">
              <p className="font-semibold">{look.author.name}</p>
              <p className="text-muted-foreground">{look.author.handle}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="relative w-full">
            <Image
                src={look.imageUrl}
                alt={look.description}
                width={500}
                height={625}
                className="object-cover w-full h-auto"
                data-ai-hint={look.imageHint}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex-col items-start gap-3">
        <div className="flex items-center w-full">
            <Button variant="ghost" size="icon" className='-ml-2'>
                <Heart className="h-5 w-5" />
                <span className="sr-only">Нравится</span>
            </Button>
            <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Комментарии</span>
            </Button>
            <Button variant="ghost" size="icon">
                <Send className="h-5 w-5" />
                <span className="sr-only">Поделиться</span>
            </Button>
        </div>
        <p className="text-sm">
            {showAuthor && look.author && <Link href={`/u/${look.author.handle}`}><span className="font-semibold">{look.author.handle}</span></Link>} {look.description}
        </p>
        {showAuthor && (
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Посмотреть все комментарии ({look.commentsCount})
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
