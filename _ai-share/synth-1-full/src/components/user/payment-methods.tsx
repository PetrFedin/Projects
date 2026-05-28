'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const savedCards = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/26', logo: '/visa-logo.svg' },
  { id: '2', brand: 'Mastercard', last4: '5555', expiry: '11/25', logo: '/mastercard-logo.svg' },
];

export function PaymentMethods() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Способы оплаты</CardTitle>
        <CardDescription>Управляйте вашими сохраненными банковскими картами.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedCards.map((card) => (
          <div key={card.id} className="flex items-center rounded-lg border p-4">
            <Image src={card.logo} alt={card.brand} width={40} height={25} />
            <div className="ml-4 flex-grow">
              <p className="font-semibold">
                {card.brand} •••• {card.last4}
              </p>
              <p className="text-sm text-muted-foreground">Истекает {card.expiry}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить новую карту
        </Button>
      </CardFooter>
    </Card>
  );
}
