'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, MessageSquare, Send, Phone, Mail, Building, Handshake } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SupportCenterPage() {
  return (
    <CabinetPageContent maxWidth="5xl" className="py-12 pb-16 px-4 py-6 pb-24 sm:px-6">
      <header className="mb-8">
        <h1 className="flex items-center gap-3 font-headline text-sm font-bold md:text-sm">
          <MessageSquare className="h-10 w-10" />
          Центр поддержки
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* AI Assistant */}
        <div className="lg:col-span-2">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI-ассистент
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col items-center justify-center p-4 text-center text-muted-foreground">
              <p>Задайте свой вопрос, и наш AI-помощник ответит вам.</p>
              <p className="text-sm">Например: "Как отследить мой заказ?"</p>
            </CardContent>
            <CardFooter>
              <div className="relative w-full">
                <Input placeholder="Ваш вопрос..." className="h-12 pr-12" />
                <Button size="icon" className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Context */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Контекст</CardTitle>
              <CardDescription>
                Укажите ID, если ваш вопрос касается конкретного заказа или подписки. Это поможет AI
                дать более точный ответ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-id">ID Заказа</Label>
                <Input id="order-id" placeholder="Например, 12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscription-id">ID Подписки</Label>
                <Input id="subscription-id" placeholder="Например, sub_abcde" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="font-headline text-base font-bold">Связаться с нами</h2>
        <p className="mt-2 text-muted-foreground">
          Если вы не нашли ответ или хотите обсудить сотрудничество.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Phone className="h-8 w-8 text-accent" />
            <CardTitle>Служба поддержки</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>support@syntha.ai</p>
            <p>+7 (495) 000-00-00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Mail className="h-8 w-8 text-accent" />
            <CardTitle>Для прессы</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>press@syntha.ai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Handshake className="h-8 w-8 text-accent" />
            <CardTitle>Партнерство</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>partners@syntha.ai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Building className="h-8 w-8 text-accent" />
            <CardTitle>Офис</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Москва, ул. Тверская, 1</p>
          </CardContent>
        </Card>
      </div>
    </CabinetPageContent>
  );
}
