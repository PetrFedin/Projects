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
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '@/lib/utils';

interface ClientCommunitySpaceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const techStackData = [
  { level: 'Профили, лента, комментарии', self: '✅ React / FastAPI', api: '—' },
  { level: 'AR-примерка', self: '✅ WebXR / Snap / Zappar SDK', api: '—' },
  { level: 'AI-стилист', self: '✅ OpenAI / Replicate', api: '—' },
  { level: 'Digital Closet / Wishlist', self: '✅ PostgreSQL / S3', api: '—' },
  { level: 'Digital drops / платежи', self: '➕ Stripe / ЮKassa / CryptoBot', api: '✅ SDK' },
  {
    level: 'NFT / вторичный рынок',
    self: '➕ через партнёров (Web3 интеграция)',
    api: '✅ внешние',
  },
  { level: 'Образование / ивенты', self: '✅ web-модуль + Telegram', api: '—' },
];

export function ClientCommunitySpaceDialog({
  isOpen,
  onOpenChange,
}: ClientCommunitySpaceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Client & Community Space</DialogTitle>
          <DialogDescription>
            Пространство взаимодействия и вовлечения. Здесь digital-коллекции переходят из B2B-мира
            в клиентский: пользователи примеряют, обсуждают, делятся и влияют на развитие брендов.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Это «социальный слой» Syntha — комьюнити вокруг эстетики, продукта и опыта.
              </p>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users />
                    1. Профиль и лента пользователя
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Профиль бренда / клиента:</strong> фото, избранные образы, wishlist,
                      подписки.
                    </li>
                    <li>
                      <strong>Активность:</strong> лента с новыми коллекциями, дропами, AI-луками и
                      событиями.
                    </li>
                    <li>
                      <strong>Персонализация:</strong> AI-рекомендации на основе сохранённых
                      товаров, стиля и предыдущих взаимодействий.
                    </li>
                    <li>
                      <strong>Приватность:</strong> профили могут быть публичными, приватными или
                      бренд-аффилированными.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: пользователь видит не абстрактные ленты, а собственный модный
                    контекст, построенный на данных Syntha.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles />
                    2. AR-примерка и цифровое взаимодействие
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>WebAR / Mobile AR:</strong> примерка одежды и аксессуаров прямо в
                      браузере или через Telegram-бота.
                    </li>
                    <li>
                      <strong>Digital Closet:</strong> виртуальный гардероб с сохранёнными вещами,
                      образами и комбинациями.
                    </li>
                    <li>
                      <strong>AI-стилист:</strong> предлагает сочетания из коллекций брендов,
                      генерирует новые луки по moodboard-запросу.
                    </li>
                    <li>
                      <strong>Поделиться:</strong> публикация образов в сообществе или экспорт в
                      соцсети.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: digital-мода становится личным опытом, а не только визуальным
                    контентом.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Handshake />
                    3. Сообщество и взаимодействие с брендами
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Комментарии и фидбек:</strong> пользователи оставляют отзывы на
                      digital-модели и кампании, байеры видят реакции в реальном времени.
                    </li>
                    <li>
                      <strong>Коллаборации с амбассадорами:</strong> бренды могут запускать капсулы
                      совместно с активными участниками.
                    </li>
                    <li>
                      <strong>Ивенты:</strong> digital-показы, стримы, мастер-классы, AMA-сессии.
                    </li>
                    <li>
                      <strong>Система признаний:</strong> бейджи «ранний доступ», «амбассадор»,
                      «тренд-мейкер».
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: комьюнити превращается в тестовую лабораторию идей и социальный
                    капитал брендов.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ShoppingCart />
                    4. Marketplace контента и digital-дропов
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Digital drops:</strong> лимитированные виртуальные вещи (AR/NFT) с
                      токенизацией и привязкой к аккаунту.
                    </li>
                    <li>
                      <strong>Покупки и подписки:</strong> Stripe / ЮKassa / CryptoBot —
                      подключаемые платёжные модули.
                    </li>
                    <li>
                      <strong>Secondary market:</strong> возможность перепродажи или обмена
                      digital-вещей (Pro-этап).
                    </li>
                    <li>
                      <strong>Аналитика отклика:</strong> бренды видят, как коллекции
                      распространяются в комьюнити.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: новый формат монетизации — digital-вещи живут в руках аудитории.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp />
                    5. Образование и профессиональные группы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Курсы и вебинары:</strong> бренды, продюсеры и дизайнеры могут
                      публиковать обучающие программы.
                    </li>
                    <li>
                      <strong>AI-менторство:</strong> генерация индивидуальных заданий и обратной
                      связи по digital-работам.
                    </li>
                    <li>
                      <strong>Кейсы участников:</strong> лучшие работы попадают в витрину Syntha
                      Community.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: формируется экосистема знаний — не просто сеть, а пространство роста
                    и обмена опытом.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Code />
                    6. Инфраструктура и интеграции
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Frontend:</strong> Next.js / React + Tailwind + WebAR.
                    </li>
                    <li>
                      <strong>Backend:</strong> FastAPI / PostgreSQL / Redis / S3.
                    </li>
                    <li>
                      <strong>Auth:</strong> OAuth2 / SSO / 2FA / Telegram Login.
                    </li>
                    <li>
                      <strong>Realtime:</strong> WebSocket / Firebase Realtime / onSnapshot.
                    </li>
                    <li>
                      <strong>AI:</strong> OpenAI / Replicate для стилистики, Vision API для
                      гардероба.
                    </li>
                    <li>
                      <strong>Интеграции:</strong> Telegram-боты для уведомлений и mini-app-витрин.
                    </li>
                  </ul>
                  <p className="pt-2 font-semibold text-foreground">
                    Что реально: профили, лента, комментарии, AR-примерка, AI-стилист, дропы,
                    подписки, Telegram-интеграция.
                  </p>
                  <p className="pt-2 text-sm text-muted-foreground">
                    Где граница: полноценная соцсеть с миллионами пользователей — после стадии Pro;
                    стартуем с ядра “Digital Closet + AR + Community”.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ценность для индустрии</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      Обратная связь в реальном времени: бренды видят реакцию аудитории до выхода
                      коллекции.
                    </li>
                    <li>
                      Новая монетизация: digital-дропы, подписки, участие клиентов в капсулах.
                    </li>
                    <li>
                      Лояльность и вовлечённость: пользователи становятся со-создателями, а не
                      пассивными покупателями.
                    </li>
                    <li>
                      Устойчивость: цифровой контент снижает затраты на физические образцы и
                      логистику.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚙️ Реалистичный объём</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Уровень</TableHead>
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
                    Client & Community Space превращает Syntha из производственной платформы в живую
                    экосистему — место, где digital-мода дышит, обсуждается, тестируется и
                    развивается вместе с аудиторией.
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
