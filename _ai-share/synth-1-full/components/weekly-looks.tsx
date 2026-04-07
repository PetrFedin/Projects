
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { looks } from '@/lib/looks';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function WeeklyLooks() {
  const topLooks = looks.slice(0, 4);
  const winner = topLooks[2]; // Let's make the 3rd one the winner for layout purposes
  const runnerUps = topLooks.filter(look => look.id !== winner.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr h-[600px]">
        {/* Winner */}
        <Link href="#" className="group relative lg:col-span-2 lg:row-span-2 rounded-lg overflow-hidden block">
            <Card className="h-full">
                <CardContent className="p-0 h-full">
                    <Image 
                        src={winner.imageUrl}
                        alt={winner.description}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                        <Badge variant="default" className="mb-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
                           <Crown className="mr-2 h-4 w-4"/> Образ недели
                        </Badge>
                         <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white" data-ai-hint="person face">
                                <AvatarImage src={winner.author.avatarUrl} alt={winner.author.name} />
                                <AvatarFallback>{winner.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{winner.author.name}</p>
                                <p className="text-sm text-white/80">{winner.author.handle}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
        
        {/* Runner-ups */}
        {runnerUps.map((look, index) => (
             <Link key={look.id} href="#" className={cn(
                "group relative rounded-lg overflow-hidden block",
                index > 1 && "hidden md:block lg:hidden" // Show only on specific breakpoints for aesthetics
             )}>
                <Card className="h-full">
                    <CardContent className="p-0 h-full">
                        <Image 
                            src={look.imageUrl}
                            alt={look.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border-2 border-white" data-ai-hint="person face">
                                    <AvatarImage src={look.author.avatarUrl} alt={look.author.name} />
                                    <AvatarFallback>{look.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{look.author.name}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </Link>
        ))}
    </div>
  );
}
