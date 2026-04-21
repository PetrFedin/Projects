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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription as ShadcnCardDescription,
} from '../ui/card';
import {
  Lightbulb,
  Bot,
  Code,
  Database,
  Share2,
  ToyBrick,
  ShoppingCart,
  BarChart2,
  FileText,
  Settings,
  Users,
  GitBranch,
  Sparkles,
  Shield,
  DollarSign,
  TrendingUp,
  Handshake,
  Info,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '@/lib/utils';

interface CoreInfraTrustLayerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const techStackData = [
  { level: 'PostgreSQL + S3 + RBAC + API', self: '✅', api: '—' },
  { level: 'Версионирование ассетов, provenance, водяные знаки', self: '✅', api: '—' },
  { level: 'Аутентификация (OAuth2, Telegram, SSO)', self: '✅', api: '—' },
  { level: 'Webhooks, CSV/JSON импорт/экспорт', self: '✅', api: '—' },
  { level: 'Мониторинг, бэкапы, CDN', self: '✅', api: '—' },
  { level: 'Платежи (ЮKassa, СБП, банк; Stripe при экспорте), ЭП (Контур, СБИС, Госключ)', self: '➕', api: '✅' },
  { level: 'Георазвёртывание, DR<4ч, ISO/SOC2', self: '➖', api: '✅' },
  { level: 'Полные ERP/CRM-интеграции', self: '➖', api: '✅' },
];

export function CoreInfraTrustLayerDialog({
  isOpen,
  onOpenChange,
}: CoreInfraTrustLayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Core Infrastructure & Trust Layer</DialogTitle>
          <DialogDescription>
            Технологический фундамент Syntha — отвечает за хранение, безопасность, управление
            правами, API, масштабирование и доверие к данным. Это не «чёрный ящик», а прозрачная
            архитектура, где каждый ассет — проверяемый, версионированный и защищённый объект.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Database />
                    1. Data Foundation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Хранилище:</strong> PostgreSQL для транзакционных данных,
                      S3-совместимое объектное хранилище для 3D, видео, текстур, рендеров.
                    </li>
                    <li>
                      <strong>Схема:</strong> базовые сущности (Brand, Collection, Look, SKU, Asset,
                      Order, Buyer, Contract, Event).
                    </li>
                    <li>
                      <strong>Версионирование ассетов:</strong> каждый файл хранится как
                      неизменяемая версия с историей изменений и метаданными.
                    </li>
                    <li>
                      <strong>Метаданные:</strong> sidecar JSON для параметров ткани, света, сцены,
                      модели и контекста.
                    </li>
                    <li>
                      <strong>Event Layer:</strong> поток событий (view, comment, add-to-order,
                      render-start, render-complete) для аналитики и AI-обучения.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: вся экосистема опирается на единый источник правды — Data Layer с
                    прозрачным происхождением и версионированием данных.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Shield />
                    2. Identity & Access (IAM Layer)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Аутентификация:</strong> OAuth2, Telegram Login, SSO
                      (Google/Microsoft), 2FA/OTP.
                    </li>
                    <li>
                      <strong>Авторизация:</strong> ролевая и атрибутивная модель (RBAC/ABAC) —
                      учитывает тип пользователя (бренд, байер, клиент), коллекцию, проект и уровень
                      доступа.
                    </li>
                    <li>
                      <strong>Мульти-tenant:</strong> строгая изоляция данных брендов и клиентов
                      (Row-Level Security + отдельные бакеты S3).
                    </li>
                    <li>
                      <strong>Шеринг и права:</strong> тонкое управление доступом к коллекциям,
                      3D-моделям и кампаниям, включая временные ссылки с подписью.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: каждый пользователь видит ровно то, что ему доступно, а обмен
                    происходит безопасно и адресно.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Info />
                    3. Trust & Provenance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Provenance-теги:</strong> запись происхождения каждого ассета — кто
                      создал, изменил, экспортировал.
                    </li>
                    <li>
                      <strong>Водяные знаки:</strong> видимые/невидимые, включая стеганографию, для
                      защиты визуальных материалов.
                    </li>
                    <li>
                      <strong>Лицензии:</strong> автоматический контроль прав (территория, срок,
                      формат использования).
                    </li>
                    <li>
                      <strong>Контент-флаги:</strong> «коммерческий», «приватный», «только байерам»,
                      «метаверс» — фильтры видимости и дистрибуции.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: бренды могут безопасно делиться коллекциями, сохраняя контроль над
                    авторством, правами и репутацией.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Shield />
                    4. Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Шифрование:</strong> данные защищены в движении (TLS 1.3) и на
                      хранении (AES-256 at rest).
                    </li>
                    <li>
                      <strong>Управление секретами:</strong> централизованный Vault, ротация токенов
                      и минимизация привилегий (PoLP).
                    </li>
                    <li>
                      <strong>Аудит:</strong> логирование всех входов, изменений и экспортов;
                      отчётность по активности арендаторов.
                    </li>
                    <li>
                      <strong>Удаление и переносимость:</strong> экспорт всех данных по запросу,
                      «право на забвение» (GDPR).
                    </li>
                    <li>
                      <strong>Соответствие:</strong> принципы GDPR-by-design, региональное хранение
                      данных (EU-first), готовность к ISO/SOC2.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: Syntha соответствует современным нормам приватности и корпоративной
                    безопасности с первого релиза.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <GitBranch />
                    5. API & Integrations Layer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>API:</strong> REST и GraphQL, реализованные на FastAPI с токенами
                      OAuth2 и ролями.
                    </li>
                    <li>
                      <strong>Вебхуки:</strong> события «новая коллекция», «обновление ордера»,
                      «новый комментарий», «новый AI-рендер».
                    </li>
                    <li>
                      <strong>Импорт/экспорт:</strong> CSV, JSON, XLSX; пакетная загрузка ассетов и
                      метаданных.
                    </li>
                    <li>
                      <strong>Интеграции:</strong> ERP/CRM (через коннекторы и CSV-адаптеры);
                      Shopify, Notion, Airtable; ЮKassa / СБП / банк + Stripe при экспорте; CryptoBot;
                      Контур / СБИС / Госключ — электронная подпись и ЭДО (63-ФЗ).
                    </li>
                    <li>
                      <strong>SDK:</strong> лёгкий клиент (Python/JS) для партнёров и кастомных
                      автоматизаций.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: Syntha легко встраивается в существующие бизнес-процессы и может
                    масштабироваться без сложных внедрений.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Settings />
                    6. Observability & Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Мониторинг:</strong> Prometheus + Grafana (нагрузка, очередь, ошибки,
                      latency).
                    </li>
                    <li>
                      <strong>Логирование:</strong> централизованные structured logs +
                      распределённые трейсинги (OpenTelemetry).
                    </li>
                    <li>
                      <strong>Фичефлаги:</strong> управление релизами, A/B-тесты, canary-деплой.
                    </li>
                    <li>
                      <strong>Резервирование:</strong> ежедневные бэкапы БД и ассетов, проверки
                      восстановления.
                    </li>
                    <li>
                      <strong>CDN и кэширование:</strong> быстрая доставка 3D, изображений и
                      рендеров, геораспределённые узлы.
                    </li>
                    <li>
                      <strong>Производительность:</strong> p95 загрузки ассетов ≤ 500 мс, TTFB
                      страниц ≤ 300 мс, FPS в 3D-просмотре ≥ 45.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: стабильная, предсказуемая производительность и прозрачное состояние
                    системы в реальном времени.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp />
                    7. Deployment & Scalability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Контейнеризация:</strong> Docker + Kubernetes (managed cloud).
                    </li>
                    <li>
                      <strong>Масштабирование:</strong> горизонтальное для фронта, AI-пайплайнов и
                      очередей рендеров.
                    </li>
                    <li>
                      <strong>Георегионы:</strong> основной — EU (Франкфурт/Амстердам), при
                      необходимости — дублирующие узлы в MENA/APAC.
                    </li>
                    <li>
                      <strong>DR-план:</strong> резервная база и S3-бакеты; RPO ≤ 24 ч, RTO ≤ 8 ч.
                    </li>
                    <li>
                      <strong>SLO:</strong> доступность 99,5% на стадии роста, 99,9% при выходе в
                      продакшн.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <DollarSign />
                    8. Cost Control & Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Оптимизация хранения:</strong> дедупликация ассетов, автоматический
                      переход hot → cold storage.
                    </li>
                    <li>
                      <strong>Очереди AI-рендеров:</strong> приоритеты, лимиты, off-peak расписания.
                    </li>
                    <li>
                      <strong>Бюджет-алерты:</strong> мониторинг использования ресурсов (storage,
                      compute, egress).
                    </li>
                    <li>
                      <strong>Материализованные представления:</strong> для дешёвой аналитики без
                      нагрузки на основную БД.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: инфраструктура масштабируется без взрыва расходов, сохраняя
                    прозрачность затрат.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Реалистичная карта развития</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Этап</TableHead>
                        <TableHead>Реализуем своими силами</TableHead>
                        <TableHead>Подключаем</TableHead>
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
                    Core Infrastructure & Trust Layer делает Syntha надёжной, управляемой и
                    безопасной. Данные остаются проверяемыми, доступ — контролируемым, а интеграции
                    — открытыми. Это фундамент, на котором спокойно строятся все остальные слои: от
                    AI и Market Room до Community и Analytics.
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
