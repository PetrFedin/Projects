
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb, Bot, Code, Database, Share2, ToyBrick, ShoppingCart, BarChart2, FileText, Settings, Users, GitBranch, Sparkles, Shield, DollarSign, TrendingUp, Handshake } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";

interface IntelligenceAnalyticsLayerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const techStackData = [
    { component: 'Событийная модель, витрины dbt', self: '✅', api: '—' },
    { component: 'Векторный поиск/похожие товары', self: '✅', api: '—' },
    { component: 'Базовые рекомендации/скоринг', self: '✅', api: '—' },
    { component: 'Nowcast интереса, heatmaps', self: '✅', api: '—' },
    { component: 'Персонализация на эмбеддингах', self: '✅ (Pro)', api: '—' },
    { component: 'Полноценные SKU-прогнозы с промо/ценой', self: '➖', api: '✅ (BI/партнёры)' },
    { component: 'Глубокий MDM, ERP-модели', self: '➖', api: '✅' },
    { component: 'Витрины enterprise-уровня', self: '➖', api: '✅ (Power BI/Looker Studio)' },
];


export function IntelligenceAnalyticsLayerDialog({ isOpen, onOpenChange }: IntelligenceAnalyticsLayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Intelligence &amp; Analytics Layer</DialogTitle>
          <DialogDescription>
            Преобразует события и контент Syntha (3D/AR, lookbooks, заказы, взаимодействия) в инсайты, рекомендации и алерты, помогающие принимать решения по коллекциям, закупкам и дистрибуции.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Database />1. Данные и пайплайны</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                         <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Сбор событий:</strong> просмотры карточек, вращения 3D, AR-примерки, add-to-order, изменения ордер-листа, комментарии, сохранения в подборки.</li>
                            <li><strong>Слоение данных:</strong> Raw (S3/Parquet) → Staging (dbt-модели) → Mart (витрины под отчёты/рекомендации).</li>
                            <li><strong>Хранилище и инструменты:</strong> PostgreSQL (OLTP), S3/Parquet + DuckDB/dbt (аналитика), Redis (кэши), очереди задач (RQ/Celery).</li>
                            <li><strong>Качество данных:</strong> схемы-валидаторы, дедупликация, SLA на задержку витрин (обычно T+15 мин для метрик интереса).</li>
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles />2. Эмбеддинги и поиск сходства</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Векторный индекс (pgvector/Qdrant):</strong> образы, материалы, луки, капсулы, moodboards.</li>
                            <li><strong>Поиск по стилю:</strong> «найти похожие силуэты/текстуры/цветовые сеты», «собери образ в стиле X».</li>
                            <li><strong>Кластеризация коллекций:</strong> группировки по эстетике/посадке/фактуре → подсказки к капсульности.</li>
                        </ul>
                        <p className="font-semibold text-foreground pt-2">Что реально: мультимодальные эмбеддинги + быстрый similarity search.<br/>Где граница: кастомные большие модели — опционально, по проекту.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Lightbulb />3. Рекомендации (MVP → Pro)</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <h4 className="font-semibold text-foreground">MVP:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>«Похожие товары/образы» (item–item similarity).</li>
                            <li>Подбор «компаньонов» к SKU (top-N комбинаторика по взаимодействиям и визуальному сходству).</li>
                            <li>Buyer-matching по фильтрам и простому скору (сегмент/средний чек/категории/регионы).</li>
                        </ul>
                         <h4 className="font-semibold text-foreground pt-2">Pro:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                             <li>Персонализация по эмбеддингам (user–vector).</li>
                            <li>Капсуло-рекомендатель: сборка мини-линий из совместимых SKU.</li>
                            <li>Size/fit-hint: вероятностные подсказки по размерной сетке на основе возвратов/поправок (если данные доступны).</li>
                        </ul>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BarChart2 />5. Аналитика и дашборды</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2">
                         <h4 className="font-semibold text-foreground">Design/Creative:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                           <li>Тепловая карта внимания к луку/детали (ракурсы, крупные планы).</li>
                            <li>Топ-фактуры/цветовые связки/силуэты по engagement-скорингу.</li>
                        </ul>
                         <h4 className="font-semibold text-foreground pt-2">Market Room / B2B:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Воронка «просмотр → отбор → ордер» по коллекции.</li>
                            <li>Скоринг модели: вероятность попадания в заказ (простая логрег/GBM на событиях).</li>
                            <li>Карта интереса по рынкам (EMEA/GCC/APAC).</li>
                        </ul>
                         <h4 className="font-semibold text-foreground pt-2">Client &amp; Community:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                             <li>AR-engagement rate, сохранения в Digital Closet, виральность дропа.</li>
                             <li>Когорты (первые 7/30 дней) по retention на коллекции/бренде.</li>
                        </ul>
                         <p className="pt-2"><strong>Инструменты:</strong> Metabase/Superset для быстрых дашбордов; коннекторы в Power BI/Looker Studio.</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Code />8. Технологический стек</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                         <ul className="list-disc pl-5 space-y-1">
                            <li><strong>ETL/оркестрация:</strong> Prefect/Airflow (по нагрузке).</li>
                            <li><strong>Хранилище:</strong> S3/Parquet + DuckDB/dbt + PostgreSQL.</li>
                            <li><strong>Векторы:</strong> pgvector/Qdrant.</li>
                            <li><strong>ML:</strong> Python (scikit-learn/lightGBM), простые пайплайны, повторяемость экспериментов (MLflow по возможности).</li>
                            <li><strong>BI:</strong> Metabase/Superset; коннекторы в Power BI/Looker Studio.</li>
                            <li><strong>Алерты:</strong> webhook/Telegram-бот.</li>
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>9. Что строим сами vs. подключаем</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Компонент</TableHead>
                                    <TableHead>Делаем сами</TableHead>
                                    <TableHead>Интегрируем</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {techStackData.map(row => (
                                <TableRow key={row.component}>
                                    <TableCell className="font-medium">{row.component}</TableCell>
                                    <TableCell>{row.self}</TableCell>
                                    <TableCell>{row.api}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                    <CardHeader><CardTitle>💡 Итог</CardTitle></CardHeader>
                    <CardContent>
                         <p className="text-sm">
                            Intelligence &amp; Analytics Layer делает Syntha «умной по умолчанию»: минимум магии, максимум прозрачных метрик, объяснимых скорингов и actionable-подсказок. Всё, что нужно креативу, закупкам и командам роста — в одном, управляемом цифрой, контуре.
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
