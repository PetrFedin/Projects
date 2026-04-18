'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Factory,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Settings,
  Play,
  Pause,
  PlusCircle,
  Paperclip,
  MessageSquare,
  Calendar,
  ChevronDown,
  Link as LinkIcon,
  FileText,
  FolderArchive,
  ShieldCheck,
  Box,
  Leaf,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { products } from '@/lib/products';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Link from 'next/link';
import { MaterialsDialog } from './materials-dialog';
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineDescription,
  TimelineBody,
} from '../ui/timeline';
import { useAuth } from '@/providers/auth-provider';
import { ProductionArchiveHub } from './production-archive-hub';

const productionData = products.slice(0, 5).map((p, i) => ({
  ...p,
  productionStatus:
    i === 0 ? 'Пошив' : i === 1 ? 'Контроль качества' : i === 2 ? 'Раскрой' : 'Запланировано',
  units: 500,
  costPerUnit: p.productionCost,
  materialsStatus: i < 2 ? 'ok' : 'pending',
  deadline: `2024-08-${15 + i}`,
  startDate: `2024-07-${20 + i}`,
  factory: i % 2 === 0 ? 'Фабрика #1 (Москва)' : 'Ателье "Стежок" (СПб)',
  comments: [
    {
      user: 'Марина (Технолог)',
      text: 'Прошу проверить лекала для размера XL, есть расхождения с ТЗ.',
      date: '2024-07-25',
    },
    { user: 'Анна (Менеджер)', text: 'Партия ткани задерживается на 2 дня.', date: '2024-07-26' },
  ],
}));

const statusOrder = [
  'Запланировано',
  'Закупка материалов',
  'Разработка лекал',
  'Создание сэмпла',
  'Раскрой',
  'Пошив',
  'Контроль качества',
  'Упаковка',
  'Готово',
];

const statusConfig: Record<string, { color: string; progress: number }> = {
  Запланировано: { color: 'bg-gray-400', progress: 5 },
  'Закупка материалов': { color: 'bg-cyan-400', progress: 15 },
  'Разработка лекал': { color: 'bg-teal-400', progress: 25 },
  'Создание сэмпла': { color: 'bg-blue-400', progress: 35 },
  Раскрой: { color: 'bg-yellow-400', progress: 50 },
  Пошив: { color: 'bg-orange-400', progress: 75 },
  'Контроль качества': { color: 'bg-accent-primary/40', progress: 90 },
  Упаковка: { color: 'bg-accent-primary/40', progress: 95 },
  Готово: { color: 'bg-green-500', progress: 100 },
};

export function DigitalProductionView({ collectionId }: { collectionId?: string | null }) {
  const { user } = useAuth();
  const [selectedSku, setSelectedSku] = useState<(typeof productionData)[0] | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isMaterialsDialogOpen, setIsMaterialsDialogOpen] = useState(false);
  const [viewMode, setViewRole] = useState<'details' | 'archive'>('details');

  const effectiveRole = user?.roles?.includes('admin')
    ? 'admin'
    : user?.roles?.includes('manufacturer')
      ? 'manufacturer'
      : 'brand';

  const filteredProduction = useMemo(() => {
    let list = productionData;

    // Mock filtering by collectionId
    if (collectionId === 'SS26') {
      list = productionData.slice(0, 3);
    } else if (collectionId === 'DROP-UZ') {
      list = productionData.slice(3, 4);
    } else if (collectionId === 'BASIC') {
      list = productionData.slice(4, 5);
    } else if (collectionId) {
      list = []; // New collection
    }

    if (effectiveRole === 'manufacturer') {
      return list.filter((item) => item.factory === 'Фабрика #1 (Москва)');
    }
    return list;
  }, [effectiveRole, collectionId]);

  return (
    <TooltipProvider>
      <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
        <CardHeader className="p-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Цифровое производство
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                {effectiveRole === 'manufacturer'
                  ? `Заказы для производства: ${user?.partnerName || 'Фабрика #1'}`
                  : collectionId
                    ? `Мониторинг коллекции: ${collectionId}`
                    : 'Отслеживание всех артикулов (SKU) в производственном цикле.'}
              </CardDescription>
            </div>
            <Button className="bg-accent-primary hover:bg-accent-primary h-10 rounded-xl text-[10px] font-black uppercase text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Новый заказ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-bg-surface2/80">
              <TableRow className="h-9 border-none">
                <TableHead className="text-text-muted h-9 px-8 text-[10px] font-black uppercase tracking-widest">
                  Артикул
                </TableHead>
                <TableHead className="text-text-muted h-9 text-[10px] font-black uppercase tracking-widest">
                  Статус
                </TableHead>
                <TableHead className="text-text-muted h-9 text-[10px] font-black uppercase tracking-widest">
                  Производство
                </TableHead>
                <TableHead className="text-text-muted h-9 text-[10px] font-black uppercase tracking-widest">
                  Кол-во
                </TableHead>
                <TableHead className="text-text-muted h-9 text-[10px] font-black uppercase tracking-widest">
                  Срок
                </TableHead>
                <TableHead className="text-text-muted h-9 px-8 text-right text-[10px] font-black uppercase tracking-widest">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProduction.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-bg-surface2/80 group h-14 transition-colors"
                >
                  <TableCell
                    onClick={() => {
                      setSelectedSku(item);
                      setViewRole('details');
                    }}
                    className="cursor-pointer px-8 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="border-border-subtle relative h-10 w-8 overflow-hidden rounded-lg border">
                        <Image
                          src={item.images[0].url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-text-primary mb-1 text-[11px] font-bold uppercase leading-none">
                          {item.name}
                        </p>
                        <p className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setSelectedSku(item);
                      setViewRole('details');
                    }}
                    className="cursor-pointer py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full',
                          statusConfig[item.productionStatus]?.color || 'bg-gray-400'
                        )}
                      ></div>
                      <span className="text-text-secondary text-[10px] font-bold uppercase">
                        {item.productionStatus}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary py-2 text-[10px] font-medium">
                    {item.factory}
                  </TableCell>
                  <TableCell className="text-text-primary py-2 text-[10px] font-black">
                    {item.units.toLocaleString('ru-RU')} ед.
                  </TableCell>
                  <TableCell className="text-text-secondary py-2 text-[10px] font-bold">
                    {new Date(item.deadline).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell className="px-8 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => {
                          setSelectedSku(item);
                          setViewRole('archive');
                        }}
                      >
                        <FolderArchive className="text-accent-primary h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-border-subtle rounded-xl"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSku(item);
                              setViewRole('details');
                            }}
                          >
                            Просмотреть детали
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSku(item);
                              setViewRole('archive');
                            }}
                          >
                            Архив производства
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/brand/products/${item.id}`}>Редактировать товар</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProduction.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                      <Factory className="text-text-muted h-10 w-10" />
                      <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                        Производственные заказы не найдены
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSku && (
        <Dialog open={!!selectedSku} onOpenChange={(open) => !open && setSelectedSku(null)}>
          <DialogContent className="flex h-[90vh] max-w-5xl flex-col overflow-hidden rounded-xl border-none p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Детали производства: {selectedSku.name}</DialogTitle>
              <DialogDescription>
                Просмотр этапов производства, чата и документации по артикулу.
              </DialogDescription>
            </DialogHeader>
            <div className="flex h-full">
              {/* Sidebar / Tabs */}
              <div className="border-border-subtle bg-bg-surface2/80 flex w-20 flex-col items-center gap-3 border-r py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-12 w-12 rounded-2xl transition-all',
                    viewMode === 'details'
                      ? 'text-accent-primary border-border-subtle border bg-white shadow-md'
                      : 'text-text-muted'
                  )}
                  onClick={() => setViewRole('details')}
                >
                  <Box className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-12 w-12 rounded-2xl transition-all',
                    viewMode === 'archive'
                      ? 'text-accent-primary border-border-subtle border bg-white shadow-md'
                      : 'text-text-muted'
                  )}
                  onClick={() => setViewRole('archive')}
                >
                  <FolderArchive className="h-5 w-5" />
                </Button>
              </div>

              {/* Main Content */}
              <div className="flex flex-1 flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {viewMode === 'details' ? (
                    <div className="space-y-4 duration-500 animate-in fade-in">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="border-none bg-emerald-50 text-[9px] font-black uppercase text-emerald-600">
                              Live Tracking
                            </Badge>
                            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                              {selectedSku.sku}
                            </span>
                          </div>
                          <h2 className="text-text-primary text-base font-black uppercase tracking-tighter">
                            {selectedSku.name}
                          </h2>
                        </div>
                        <Button
                          variant="outline"
                          className="border-border-default h-10 rounded-xl text-[10px] font-bold uppercase"
                        >
                          Скачать отчет
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="space-y-6 md:col-span-2">
                          <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
                            <CardHeader className="bg-bg-surface2/80 border-border-subtle border-b p-4">
                              <CardTitle className="text-sm font-black uppercase tracking-tight">
                                Этапы производства
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <Timeline>
                                {statusOrder.map((status, index) => {
                                  const currentIndex = statusOrder.indexOf(
                                    selectedSku.productionStatus
                                  );
                                  const isCompleted = index < currentIndex;
                                  const isActive = index === currentIndex;
                                  const config = statusConfig[status];
                                  return (
                                    <TimelineItem key={status}>
                                      <TimelineConnector />
                                      <TimelineHeader>
                                        <TimelineIcon
                                          className={cn(
                                            isCompleted
                                              ? 'border-emerald-500 bg-emerald-500'
                                              : isActive
                                                ? 'bg-accent-primary border-accent-primary'
                                                : 'border-border-default bg-white'
                                          )}
                                        >
                                          {isCompleted ? (
                                            <CheckCircle className="h-3 w-3 text-white" />
                                          ) : (
                                            <Factory
                                              className={cn(
                                                'h-3 w-3',
                                                isActive ? 'text-white' : 'text-text-muted'
                                              )}
                                            />
                                          )}
                                        </TimelineIcon>
                                        <TimelineTitle
                                          className={cn(
                                            'text-xs font-black uppercase tracking-tight',
                                            isActive ? 'text-accent-primary' : 'text-text-primary'
                                          )}
                                        >
                                          {status}
                                        </TimelineTitle>
                                      </TimelineHeader>
                                      <TimelineBody>
                                        <p
                                          className={cn(
                                            'mb-2 text-[10px] font-bold uppercase',
                                            isActive ? 'text-accent-primary' : 'text-text-muted'
                                          )}
                                        >
                                          {isCompleted
                                            ? 'Завершено'
                                            : isActive
                                              ? 'В процессе'
                                              : 'Ожидает'}
                                        </p>
                                        {isActive && (
                                          <Progress
                                            value={config.progress}
                                            className="bg-accent-primary/10 h-1"
                                          />
                                        )}
                                      </TimelineBody>
                                    </TimelineItem>
                                  );
                                })}
                              </Timeline>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="space-y-6">
                          <Card className="border-border-subtle rounded-xl shadow-sm">
                            <CardHeader className="bg-bg-surface2/80 border-border-subtle border-b p-4">
                              <CardTitle className="text-sm font-black uppercase tracking-tight">
                                Чат по SKU
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="custom-scrollbar mb-4 h-[300px] space-y-4 overflow-y-auto pr-2">
                                {selectedSku.comments.map((c, i) => (
                                  <div key={i} className="space-y-1">
                                    <div className="text-text-muted flex justify-between text-[9px] font-black uppercase tracking-widest">
                                      <span>{c.user}</span>
                                      <span>{c.date}</span>
                                    </div>
                                    <div className="bg-bg-surface2 text-text-secondary rounded-2xl p-3 text-[11px] font-medium leading-relaxed">
                                      {c.text}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Ваше сообщение..."
                                  className="border-border-default h-10 rounded-xl text-xs"
                                />
                                <Button
                                  size="icon"
                                  className="bg-accent-primary shadow-accent-primary/10 h-10 w-10 rounded-xl shadow-lg"
                                >
                                  <ArrowRight className="h-4 w-4 text-white" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>

                          <Card
                            className="border-border-subtle bg-accent-primary group relative cursor-pointer overflow-hidden rounded-xl text-white shadow-sm"
                            onClick={() => setViewRole('archive')}
                          >
                            <div className="absolute right-0 top-0 p-4 opacity-10">
                              <FolderArchive className="h-12 w-12" />
                            </div>
                            <CardContent className="p-4">
                              <Badge className="mb-2 border-none bg-white/20 text-[8px] font-black uppercase text-white">
                                Centralized Hub
                              </Badge>
                              <h4 className="mb-1 text-sm font-black uppercase tracking-tight">
                                Архив производства
                              </h4>
                              <p className="text-accent-primary/30 text-[10px] font-medium leading-relaxed">
                                Все ТЗ, лекала и сертификаты в одном месте.
                              </p>
                              <Button
                                variant="ghost"
                                className="hover:text-accent-primary/40 mt-4 h-auto p-0 text-[10px] font-black uppercase text-white hover:bg-transparent"
                              >
                                Открыть хранилище <ArrowRight className="ml-2 h-3 w-3" />
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="border-border-subtle group relative overflow-hidden rounded-xl bg-emerald-600 text-white shadow-sm">
                            <div className="absolute right-0 top-0 p-4 opacity-10">
                              <Leaf className="h-12 w-12" />
                            </div>
                            <CardContent className="p-4">
                              <Badge className="mb-2 border-none bg-white/20 text-[8px] font-black uppercase text-white">
                                ESG Scorecard
                              </Badge>
                              <h4 className="mb-1 text-sm font-black uppercase tracking-tight">
                                Эко-рейтинг SKU
                              </h4>
                              <div className="mb-4 flex items-baseline gap-2">
                                <span className="text-base font-black tabular-nums">A+</span>
                                <span className="text-[10px] font-bold uppercase text-emerald-200">
                                  Excellent
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-bold uppercase text-emerald-100">
                                  <span>Carbon Footprint</span>
                                  <span>0.4kg CO2</span>
                                </div>
                                <Progress value={15} className="h-1 bg-white/20" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ProductionArchiveHub
                      sku={{ ...selectedSku, brand: 'Syntha' }}
                      userRole={effectiveRole}
                    />
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <MaterialsDialog isOpen={isMaterialsDialogOpen} onOpenChange={setIsMaterialsDialogOpen} />
    </TooltipProvider>
  );
}

// Reuse ArrowRight from lucide-react if needed, or define it locally
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
