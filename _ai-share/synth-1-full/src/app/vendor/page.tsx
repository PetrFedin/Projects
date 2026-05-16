import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Package } from 'lucide-react';
import { VendorDocumentUpload } from '@/components/vendor/VendorDocumentUpload';

export default function VendorDashboardPage() {
  const mockTasks = [
    { id: 'T-101', title: 'Оценить Tech Pack: Худи Оверсайз', status: 'pending', articleId: 'ART-001' },
    { id: 'T-102', title: 'Обновить сертификат ISO 9001', status: 'overdue', articleId: null },
    { id: 'T-103', title: 'Подтвердить сроки по заказу #4092', status: 'completed', articleId: null },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Добро пожаловать, Фабрика №1</h2>
        <p className="text-text-secondary mt-1">Обзор ваших задач и активных запросов от брендов.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Новые запросы (RFQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Активные заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Рейтинг (Eco-Score)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">85/100</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Задачи к выполнению</h3>
          <div className="space-y-3">
            {mockTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-text-muted">{task.id}</span>
                      {task.status === 'pending' && <Badge variant="secondary" className="text-[10px]">Ожидает</Badge>}
                      {task.status === 'overdue' && <Badge variant="destructive" className="text-[10px]">Просрочено</Badge>}
                      {task.status === 'completed' && <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px]">Выполнено</Badge>}
                    </div>
                    <p className="text-sm font-medium text-text-primary">{task.title}</p>
                  </div>
                  {task.articleId && (
                    <Link href={`/vendor/tech-pack/${task.articleId}`}>
                      <span className="flex items-center text-xs text-accent-primary hover:underline font-medium">
                        Открыть ТЗ <ArrowRight className="w-3 h-3 ml-1" />
                      </span>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Документы</h3>
          <VendorDocumentUpload />
        </div>
      </div>
    </div>
  );
}
