'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, FileText, Image as ImageIcon, TrendingUp, Badge } from 'lucide-react';

export default function BlogManagement() {
  const posts = [
    {
      title: 'Наша новая осенняя коллекция',
      date: '2 дня назад',
      status: 'Опубликовано',
      views: 12500,
      engagement: 8.2,
    },
    {
      title: 'За кулисами: как создавался кашемировый свитер',
      date: '1 неделю назад',
      status: 'Черновик',
      views: 0,
      engagement: 0,
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Новая публикация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Заголовок статьи" className="h-12 text-sm" />
          <Textarea placeholder="Начните писать вашу историю здесь..." rows={10} />
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" />
              Добавить обложку
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Прикрепить лукбук
            </Button>
          </div>
        </CardContent>
        <CardFooter className="gap-3">
          <Button>Опубликовать</Button>
          <Button variant="secondary">Сохранить как черновик</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Опубликованные статьи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.date} -{' '}
                    <span
                      className={
                        post.status === 'Опубликовано' ? 'text-green-600' : 'text-orange-500'
                      }
                    >
                      {post.status}
                    </span>
                  </p>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span>Просмотры: {post.views.toLocaleString('ru-RU')}</span>
                    <span>Вовлеченность: {post.engagement}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-accent/50 bg-transparent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" /> Продвигать
                  </Button>
                  <Button variant="outline" size="sm">
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
