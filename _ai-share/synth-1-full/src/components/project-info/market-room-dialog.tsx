'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Lightbulb,
  ShoppingCart,
  FileText,
  Settings,
  Users,
  BarChart2,
  GitBranch,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface MarketRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const techStackData = [
  { level: '3D / AR просмотр коллекций', self: '✅ Three.js + ARKit/WebXR', api: '—' },
  {
    level: 'Каталог, ордер-листы, карточки SKU',
    self: '✅ FastAPI + PostgreSQL + React',
    api: '—',
  },
  {
    level: 'Аналитика просмотров / интереса',
    self: '✅ встроенная статистика (PostgreSQL + AI scoring)',
    api: '➕ BI-интеграция (Power BI, GDS)',
  },
  { level: 'Чаты / коммуникация', self: '✅ Telegram Bot API, email-интеграция', api: '—' },
  { level: 'Платежи и контракты', self: '➕ Stripe / ЮKassa / DocuSign', api: '✅ внешние SDK' },
  { level: 'AI-рекомендации брендов', self: '✅ простая ML-модель на embeddings', api: '—' },
  { level: 'ERP/CRM связь', self: '➕ CSV / API-коннектор', api: '✅ SAP / 1C / Odoo' },
];

export function MarketRoomDialog({ isOpen, onOpenChange }: MarketRoomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Market Room</DialogTitle>
          <DialogDescription>
            Пространство закупок и данных. Для байеров, дистрибьюторов, брендов и аналитиков.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Syntha Market Room — это цифровое ядро взаимодействия брендов и закупщиков, где
                коллекции, ордер-листы и аналитика соединены в единую рабочую среду. Это не копия
                традиционного шоурума, а интерактивный B2B-уровень, встроенный прямо в цифровой
                контур коллекции.
              </p>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ShoppingCart />
                    1. Digital Showroom
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Виртуальная витрина для профессиональных закупок. Байеры видят коллекции в 3D,
                    изучают посадку, текстуры и узнают технические характеристики — без образцов и
                    перелётов.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Интерактивные 3D- и AR-модели</strong> из Digital Fashion Laboratory.
                    </li>
                    <li>
                      <strong>Фильтры и подборки:</strong> коллекции можно сортировать по сезонам,
                      капсулам, категориям и цветовым темам.
                    </li>
                    <li>
                      <strong>Панель байера:</strong> добавление моделей в избранное, создание
                      подборок и собственных ордер-листов.
                    </li>
                    <li>
                      <strong>Видео и AI-рендеры:</strong> встроенные fashion-визуалы для лучшего
                      восприятия.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: бренд показывает коллекцию онлайн в формате, максимально близком к
                    реальной презентации, а байер работает с ней так же интуитивно, как в шоуруме.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText />
                    2. Ордер-листы и заказы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Syntha автоматизирует процесс оформления заказов, не превращая его в сложную
                    ERP-систему.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Создание ордер-листов прямо в интерфейсе:</strong> добавление моделей,
                      размеров, цветов и количества.
                    </li>
                    <li>
                      <strong>Гибкие статусы:</strong> «черновик», «в обработке», «подтверждено».
                    </li>
                    <li>
                      <strong>Экспорт данных:</strong> выгрузка ордер-листа в Excel/CSV или PDF для
                      импорта в 1С, ERP или CRM.
                    </li>
                    <li>
                      <strong>Уведомления и логи изменений:</strong> все корректировки фиксируются,
                      доступна история правок.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: байер может оформить заказ в 3 клика, а бренд — видеть его статус без
                    бесконечной переписки.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Settings />
                    3. Контент и спецификации
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>Каждый продукт в Market Room имеет собственную «цифровую карточку».</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Карточка SKU:</strong> фото, 3D-модель, материалы, цена, доступные
                      размеры, sustainability-показатели.
                    </li>
                    <li>
                      <strong>Импорт из лаборатории:</strong> данные подтягиваются напрямую из
                      Digital Fashion Laboratory.
                    </li>
                    <li>
                      <strong>Загрузка бренд-контента:</strong> PDF-каталоги, lookbooks, видео или
                      прайс-листы.
                    </li>
                    <li>
                      <strong>Синхронизация с CMS / PIM:</strong> через API или файлы обмена (CSV,
                      JSON).
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: единый источник правды по всей коллекции — от дизайна до коммерции.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users />
                    4. Buyer Portal и взаимодействие
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Функционал для построения профессиональных связей и упрощения закупочного цикла.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Профили байеров и брендов:</strong> информация о направлениях,
                      локациях, сегменте.
                    </li>
                    <li>
                      <strong>AI-рекомендации:</strong> на этапе MVP — простая фильтрация по
                      брендам, сезонам, категориям и ценовым диапазонам.
                    </li>
                    <li>
                      <strong>Коммуникация:</strong> встроенный чат или связь через Telegram /
                      email-интеграцию.
                    </li>
                    <li>
                      <strong>Персональные витрины:</strong> бренды могут создавать приватные
                      подборки с ограниченным доступом.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: закупки становятся точечными и прозрачными, а коммуникации — без
                    посредников и хаоса.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BarChart2 />
                    5. Аналитика и отчёты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Syntha не заменяет BI-систему, но даёт понятные, полезные цифры прямо в
                    интерфейсе.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Базовая аналитика:</strong> просмотры моделей, добавления в
                      ордер-листы, конверсии в заказы.
                    </li>
                    <li>
                      <strong>Heatmap интереса:</strong> AI визуализирует, какие вещи вызывают
                      наибольший интерес байеров.
                    </li>
                    <li>
                      <strong>Динамика продаж (на уровне API):</strong> данные можно выгружать в
                      Power BI / Google Data Studio.
                    </li>
                    <li>
                      <strong>Тренды по категориям:</strong> сбор данных о топовых SKU и цветах.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: маркетинг, коммерция и производство видят реальные сигналы рынка, а
                    не постфактум отчёты.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <GitBranch />
                    6. Интеграции и инфраструктура
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>Syntha строится на принципе «подключай и работай» — без сложного внедрения.</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>ERP / CRM интеграции:</strong> обмен заказами и контактами через CSV
                      или API.
                    </li>
                    <li>
                      <strong>Подключение платёжных шлюзов:</strong> Stripe, Yandex Pay, CryptoBot —
                      на этапе Pro.
                    </li>
                    <li>
                      <strong>Docflow:</strong> e-signature через DocuSign или локальные аналоги.
                    </li>
                    <li>
                      <strong>Безопасность:</strong> шифрование пользовательских данных, доступ по
                      токенам OAuth2.
                    </li>
                    <li>
                      <strong>Webhook-уведомления:</strong> обновления статусов заказов, новые
                      сообщения и активности.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: Market Room становится связующим узлом экосистемы бренда, не требуя
                    от него менять привычные процессы.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ценность для индустрии</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>
                      Сокращение цикла закупки: от презентации до подтверждения заказа — за 2–3 дня
                      вместо недель.
                    </li>
                    <li>
                      Прозрачность и контроль: все взаимодействия фиксируются, а данные доступны
                      обеим сторонам.
                    </li>
                    <li>
                      Объединение креатива и коммерции: дизайн, контент и продажи живут в одной
                      системе.
                    </li>
                    <li>
                      Масштабируемость: решение подходит как для независимых брендов, так и для
                      крупных холдингов с множеством линий.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    ⚙️ Реалистичный технологический объём (что можно сделать своими силами)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Уровень</TableHead>
                        <TableHead>Реализуем своими силами</TableHead>
                        <TableHead>Интегрируется через API / SDK</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {techStackData.map((row) => (
                        <TableRow key={row.level}>
                          <TableCell className="font-medium">{row.level}</TableCell>
                          <TableCell>{row.self}</TableCell>
                          <TableCell>{row.api}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>💡 Итог</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Syntha Market Room — это не “корпоративная платформа уровня Oracle”, а гибкий
                    модуль B2B-коммерции, который реально построить на современном web-стеке. Он
                    объединяет коллекцию, данные и покупателей в одном окне — без костылей и
                    барьеров входа.
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
