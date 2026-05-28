'use client';

import Image from 'next/image';

const mockBestsellers = [
  {
    name: 'Cashmere Crewneck Sweater',
    brand: 'Everlane',
    sales: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1652904875075-4534c3439c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxrbml0JTIwc3dlYXRlcnxlbnwwfHx8fDE3NjA3NDIxOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'knit sweater',
  },
  {
    name: 'The Iconic Trench',
    brand: 'Burberry',
    sales: 98,
    imageUrl:
      'https://images.unsplash.com/photo-1573545289441-827c028f7a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx0cmVuY2glMjBjb2F0fGVufDB8fHx8MTc2MDczMTMyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'trench coat',
  },
  {
    name: 'Performance Work Pant',
    brand: 'Theory',
    sales: 85,
    imageUrl:
      'https://images.unsplash.com/photo-1607629002474-af96a30346c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxibGFjayUyMHRyb3VzZXJzfGVufDB8fHx8MTc2MDc2NjQxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'black trousers',
  },
  {
    name: 'Classic Denim Jacket',
    brand: "Levi's",
    sales: 72,
    imageUrl:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldHxlbnwwfHx8fDE3NjA3MzgzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'denim jacket',
  },
];

export function Bestsellers() {
  return (
    <div className="space-y-6">
      {mockBestsellers.map((product) => (
        <div key={product.name} className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.imageHint}
              sizes="64px"
            />
          </div>
          <div className="flex-1">
            <p className="truncate text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{product.sales}</p>
            <p className="text-right text-xs text-muted-foreground">продаж</p>
          </div>
        </div>
      ))}
    </div>
  );
}
