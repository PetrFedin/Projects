'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type HomeDropsUnlockedSectionProps = {
  viewRole: string;
  isDropsUnlocked: boolean;
};

const DROP_ITEMS = [
  {
    id: 'drop-1',
    name: 'Cyber-Organic Hoodie',
    brand: 'Nordic Wool',
    price: '18,900 ₽',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
    stock: '12/50',
  },
  {
    id: 'drop-2',
    name: 'Ghost Shell Parka',
    brand: 'Syntha Lab',
    price: '42,000 ₽',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
    stock: '3/20',
  },
  {
    id: 'drop-3',
    name: 'Zero-G Sneakers',
    brand: 'Syntha Lab',
    price: '24,500 ₽',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
    stock: 'Sold Out',
  },
] as const;

/** Drops B2C — framer-motion в отдельном chunk от HomePageClient shell. */
export function HomeDropsUnlockedSection({
  viewRole,
  isDropsUnlocked,
}: HomeDropsUnlockedSectionProps) {
  if ((viewRole !== 'client' && viewRole !== 'admin') || !isDropsUnlocked) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="section-spacing bg-text-primary relative overflow-hidden py-24"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_-20%,#4f46e5,transparent)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="mb-16 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent-primary/20 border-accent-primary/30 flex h-8 w-8 items-center justify-center rounded-xl border">
                  <Flame className="text-accent-primary h-4 w-4" />
                </div>
                <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  LOCKED_CONTENT_UNLOCKED
                </Badge>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white md:text-4xl">
                  DROPS<span className="text-accent-primary">.</span>
                </h2>
                <p className="text-text-muted max-w-lg text-sm font-medium">
                  Эксклюзивный доступ к лимитированным коллекциям для активных участников
                  сообщества. Только 48 часов до общего релиза.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-wider">
                  Следующий дроп через
                </p>
                <div className="flex gap-3">
                  {[
                    { val: '02', label: 'дни' },
                    { val: '14', label: 'час' },
                    { val: '35', label: 'мин' },
                  ].map((t) => (
                    <div key={t.label} className="flex flex-col items-center">
                      <span className="text-sm font-bold tabular-nums text-white">{t.val}</span>
                      <span className="text-text-secondary text-[10px] font-medium uppercase tracking-wide">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="ctaOutline" size="ctaLg" className="group">
                Смотреть все дропы{' '}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {DROP_ITEMS.map((drop) => (
              <Card
                key={drop.id}
                className="bg-text-primary/50 border-text-primary/30 group/drop hover:border-accent-primary/50 overflow-hidden rounded-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={drop.image}
                    alt={drop.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/drop:scale-110"
                  />
                  <div className="from-text-primary absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
                  <div className="absolute left-6 top-4">
                    <Badge className="rounded-full border-white/10 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-md">
                      {drop.stock === 'Sold Out' ? 'SOLD OUT' : `STOCK: ${drop.stock}`}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-wide">
                      {drop.brand}
                    </p>
                    <h3 className="text-sm font-bold uppercase leading-tight tracking-tight text-white">
                      {drop.name}
                    </h3>
                  </div>
                </div>
                <CardContent className="flex items-center justify-between p-4">
                  <span className="text-sm font-bold text-white">{drop.price}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:text-accent-primary h-auto p-0 text-xs font-bold uppercase tracking-wide text-white hover:bg-transparent"
                  >
                    Забронировать <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
