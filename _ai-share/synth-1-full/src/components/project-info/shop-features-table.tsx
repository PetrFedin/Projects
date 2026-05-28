'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

const shopFeaturesData = [
  // B2B Закупки
  {
    feature: 'Доступ к B2B-каталогам',
    basic: 'до 3 брендов',
    pro: 'до 10 брендов',
    elite: 'до 30 брендов',
    enterprise: 'Безлимит',
    tooltip: {
      what: 'Количество брендов, чьи оптовые каталоги (линии) доступны для просмотра и заказа.',
      why: 'Позволяет гибко формировать ассортимент магазина, выбирая из широкого пула верифицированных брендов платформы.',
    },
  },
  {
    feature: 'Формирование предзаказов',
    basic: <Check className="mx-auto h-5 w-5 text-green-500" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Возможность создавать и отправлять предзаказы на будущие коллекции брендов прямо с платформы.',
      why: 'Гарантирует получение самых актуальных и востребованных товаров к началу сезона, опережая конкурентов.',
    },
  },
  {
    feature: 'Оформление дозаказов',
    basic: <Check className="mx-auto h-5 w-5 text-green-500" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Возможность заказывать дополнительные партии товаров из текущих коллекций, доступных для пополнения.',
      why: 'Позволяет быстро реагировать на высокий спрос и пополнять складские запасы бестселлеров, не упуская прибыль.',
    },
  },
  {
    feature: "'Open to Buy' (OTB) Planner",
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: 'Расширенный',
    enterprise: 'Полный',
    tooltip: {
      what: 'Интеллектуальный планировщик закупочного бюджета, который на основе сезонности и прошлых продаж рекомендует, какую сумму и когда стоит выделить на закупку определенных категорий товаров.',
      why: 'Помогает избежать заморозки средств в неликвидных товарах и оптимизировать инвестиции в закупки для максимальной оборачиваемости и маржинальности.',
    },
  },
  {
    feature: 'AI-прогноз маржинальности',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: 'Базовый',
    elite: 'Расширенный',
    enterprise: 'Полный',
    tooltip: {
      what: 'Инструмент, прогнозирующий потенциальную маржинальность новых товаров с учетом их закупочной цены и рыночного спроса.',
      why: 'Позволяет принимать взвешенные решения о закупках, выбирая наиболее прибыльные позиции и избегая товаров с низкой потенциальной доходностью.',
    },
  },

  // Управление магазином
  {
    feature: 'Управление розничными заказами',
    basic: <Check className="mx-auto h-5 w-5 text-green-500" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Интерфейс для просмотра и управления розничными заказами, которые поступают через платформу Syntha из вашего стока.',
      why: 'Обеспечивает централизованный контроль над всеми онлайн-продажами и упрощает их обработку.',
    },
  },
  {
    feature: 'Запрос на листинг товаров',
    basic: <Check className="mx-auto h-5 w-5 text-green-500" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Возможность отправлять брендам запросы на право продажи их товара в вашем магазине.',
      why: 'Позволяет легально и прозрачно расширять свой ассортимент, добавляя товары от ведущих брендов платформы.',
    },
  },
  {
    feature: 'Система управления возвратами',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: 'Автоматизация',
    tooltip: {
      what: 'Интегрированный модуль для онлайн-оформления, отслеживания и обработки возвратов от клиентов.',
      why: 'Упрощает и ускоряет процесс возврата, повышая лояльность клиентов и снижая операционную нагрузку на персонал.',
    },
  },

  // Аналитика и AI
  {
    feature: 'AI Buyer Assistant',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'AI-ассистент, который анализирует ваши продажи и предлагает готовые подборки товаров для закупки.',
      why: 'Экономит время на анализ и помогает формировать сбалансированный и коммерчески успешный ассортимент.',
    },
  },
  {
    feature: 'Анализ "упущенных продаж"',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Отчет, показывающий, какие товары искали клиенты на вашей витрине, но не нашли из-за отсутствия в ассортименте.',
      why: 'Дает прямое понимание неудовлетворенного спроса и помогает принять решение о расширении каталога.',
    },
  },
  {
    feature: 'Анализ "потерянных" размеров',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Отчет о том, какие размеры пользуются наибольшим спросом, но постоянно отсутствуют на вашем складе.',
      why: 'Помогает оптимизировать закупку размерной сетки и избежать потери продаж из-за отсутствия ходовых размеров.',
    },
  },
  {
    feature: 'Анализ локального спроса',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: 'Real-time',
    tooltip: {
      what: 'Тепловая карта, показывающая интерес к разным категориям товаров в разных районах вашего города.',
      why: 'Позволяет проводить гиперлокальные маркетинговые кампании и адаптировать ассортимент физических точек под спрос конкретного района.',
    },
  },
  {
    feature: 'AI-анализ локальных событий',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Анализ предстоящих событий в городе (концерты, фестивали) и рекомендации по ассортименту, который будет востребован.',
      why: 'Помогает подготовиться к пикам спроса, связанным с городскими мероприятиями, и увеличить продажи.',
    },
  },
  {
    feature: 'Предиктивный анализ возвратов',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: 'Базовый',
    elite: 'Детальный',
    enterprise: 'Полный',
    tooltip: {
      what: 'AI-инструмент, прогнозирующий вероятность возврата товара еще на этапе закупки, анализируя его характеристики и историю возвратов похожих моделей.',
      why: 'Снижает издержки на обработку возвратов и помогает формировать ассортимент из товаров с высоким потенциалом удовлетворенности клиентов.',
    },
  },

  // Интеграции и Поддержка
  {
    feature: 'AI-консультант для персонала',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: 'Базовый',
    elite: 'Расширенный',
    enterprise: 'Полный',
    tooltip: {
      what: 'Мобильное приложение для продавцов, которое дает AI-рекомендации по подбору образов для клиентов в физическом магазине.',
      why: 'Повышает экспертизу персонала, увеличивает средний чек за счет комплексных продаж и улучшает клиентский сервис.',
    },
  },
  {
    feature: 'Интеграция с программой лояльности',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Возможность синхронизировать собственную программу лояльности ритейлера с платформой Syntha.',
      why: 'Создает бесшовный опыт для клиента, который может копить и тратить бонусы как в офлайн-магазине, так и на платформе.',
    },
  },
  {
    feature: 'Интеграция с CRM и ERP',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: 'CSV/Email',
    elite: 'Базовый API',
    enterprise: 'Полный API',
    tooltip: {
      what: 'Автоматическая синхронизация данных о заказах, клиентах и остатках с вашими внутренними системами (1С, МойСклад, SAP и др.).',
      why: 'Устраняет необходимость ручного переноса данных, сокращает количество ошибок и экономит время персонала.',
    },
  },
  {
    feature: 'Интеграция с "умными" зеркалами',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'API для партнерских магазинов, позволяющее подключать "умные" примерочные, которые распознают товары и показывают на экране рекомендации.',
      why: 'Расширяет цифровой опыт вашего бренда в физическое пространство, создавая бесшовный Phygital-сценарий для клиента.',
    },
  },
  {
    feature: 'Виртуальный консультант для сайта',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'White-label версия AI-стилиста Syntha для встраивания на ваш собственный сайт.',
      why: 'Повышает вовлеченность и конверсию на вашем сайте, предоставляя клиентам персональные рекомендации в режиме 24/7.',
    },
  },
  {
    feature: 'Интеграция с локальными курьерами',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Автоматизация вызова локального курьера для экспресс-доставки "день в день" из вашего физического магазина.',
      why: 'Повышает скорость доставки и конкурентоспособность вашего магазина в условиях городской логистики.',
    },
  },
  {
    feature: 'Единая корзина (Unified Cart)',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Возможность для клиента собрать в одну корзину товары со склада Syntha и вашего магазина.',
      why: 'Улучшает клиентский опыт, позволяя совершать комплексные покупки в одном месте, и увеличивает ваши продажи за счет трафика платформы.',
    },
  },
  {
    feature: 'Гео-таргетированные акции',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <Check className="mx-auto h-5 w-5 text-green-500" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Создание эксклюзивных промокодов и акций, которые видны только пользователям, находящимся в определенном городе или районе.',
      why: 'Позволяет проводить целевые маркетинговые кампании для привлечения клиентов в конкретные физические магазины.',
    },
  },
  {
    feature: 'Clienteling на основе геолокации',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <Check className="mx-auto h-5 w-5 text-green-500" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Уведомления для продавцов-консультантов, когда лояльный клиент находится рядом с магазином.',
      why: 'Позволяет оказывать проактивный и персонализированный сервис, повышая лояльность и вероятность покупки.',
    },
  },
  {
    feature: 'Геймификация для персонала',
    basic: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    pro: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    elite: <X className="mx-auto h-5 w-5 text-muted-foreground" />,
    enterprise: <Check className="mx-auto h-5 w-5 text-green-500" />,
    tooltip: {
      what: 'Модуль для создания внутренних челленджей для продавцов-консультантов с начислением бонусов.',
      why: 'Повышает мотивацию персонала и помогает сфокусировать команду на достижении ключевых KPI (например, продажа определенных товаров).',
    },
  },
];

const plansMeta = [
  { name: 'Shop BASIC', variant: 'secondary' },
  { name: 'Shop+', variant: 'default', badge: 'Популярный' },
  { name: 'Shop PRO', variant: 'secondary' },
  { name: 'Enterprise', variant: 'secondary' },
];

export function ShopFeaturesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сравнение тарифов</CardTitle>
        <CardDescription>
          Подробное описание функций, доступных в каждом из планов для ритейлеров.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px] font-semibold">Функция</TableHead>
                  {plansMeta.map((plan) => (
                    <TableHead
                      key={plan.name}
                      className={cn(
                        'min-w-[150px] text-center',
                        plan.variant === 'default' && 'bg-primary/5'
                      )}
                    >
                      <div className="flex flex-col items-center">
                        {plan.name}
                        {plan.badge && (
                          <Badge variant={'default'} className="mt-1">
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopFeaturesData.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        {row.feature}
                        {row.tooltip && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs p-3 text-left" side="top">
                              <p className="font-bold text-foreground">Что это?</p>
                              <p className="mb-2 whitespace-pre-wrap font-normal text-muted-foreground">
                                {row.tooltip.what}
                              </p>
                              <p className="font-bold text-foreground">Зачем это?</p>
                              <p className="whitespace-pre-wrap font-normal text-muted-foreground">
                                {row.tooltip.why}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{row.basic}</TableCell>
                    <TableCell
                      className={cn(
                        'text-center font-semibold',
                        plansMeta[1].variant === 'default' && 'bg-primary/5'
                      )}
                    >
                      {row.pro}
                    </TableCell>
                    <TableCell className="text-center">{row.elite}</TableCell>
                    <TableCell className="text-center">{row.enterprise}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
