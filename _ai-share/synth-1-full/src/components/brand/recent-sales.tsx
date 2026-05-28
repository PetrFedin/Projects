'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockSales = [
  {
    name: 'Оливия Мартин',
    email: 'olivia.martin@email.com',
    amount: '+199 900 ₽',
    avatar: 'https://picsum.photos/seed/u1/40/40',
    fallback: 'OM',
  },
  {
    name: 'Джексон Ли',
    email: 'jackson.lee@email.com',
    amount: '+3 900 ₽',
    avatar: 'https://picsum.photos/seed/u2/40/40',
    fallback: 'JL',
  },
  {
    name: 'Изабелла Нгуен',
    email: 'isabella.nguyen@email.com',
    amount: '+29 900 ₽',
    avatar: 'https://picsum.photos/seed/u3/40/40',
    fallback: 'IN',
  },
  {
    name: 'Уильям Ким',
    email: 'will@email.com',
    amount: '+9 900 ₽',
    avatar: 'https://picsum.photos/seed/u4/40/40',
    fallback: 'WK',
  },
  {
    name: 'София Дэвис',
    email: 'sofia.davis@email.com',
    amount: '+3 900 ₽',
    avatar: 'https://picsum.photos/seed/u5/40/40',
    fallback: 'SD',
  },
];

export function RecentSales() {
  return (
    <div className="space-y-4">
      {mockSales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9" data-ai-hint="person face">
            <AvatarImage src={sale.avatar} alt="Avatar" />
            <AvatarFallback>{sale.fallback}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
}
