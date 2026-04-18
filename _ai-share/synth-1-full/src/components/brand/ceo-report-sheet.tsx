'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Users,
  Globe,
  Cpu,
  ShieldCheck,
  Package,
  DollarSign,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Rocket,
  Factory,
  Database,
  Megaphone,
  Lock,
  Clock,
  Sparkles,
  Bot,
  BrainCircuit,
  TrendingUp as TrendUpIcon,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  PieChart,
  BarChart2,
  LineChart,
  Layers,
  Search,
  Shield,
  Activity,
  History,
  Building2,
  Briefcase,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
<<<<<<< HEAD
import { Card, CardContent } from '@/components/ui/card';
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
>>>>>>> recover/cabinet-wip-from-stash
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type RoleReport = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO' | 'CIO' | 'CHRO' | 'CSO' | 'CDO';

interface CeoReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleReport;
}

const REPORT_DATA: Record<RoleReport, any> = {
  CEO: {
    title: 'Chief Executive Officer (Генеральный директор)',
    roleName: 'CEO',
    summary:
      'Бренд демонстрирует стабильный рост на 14.2%. Основной фокус на глобальной экспансии и устойчивом развитии.',
    scope: 'shared',
    kpis: [
      {
        label: 'Revenue Growth',
        value: '+14.2%',
        trend: 'up',
        status: 'success',
        hint: 'Рост выручки YoY',
        desc: 'Процентное изменение выручки по сравнению с прошлым годом. Агрегирует данные платформы и интегрированных ERP-систем.',
        target: '+15.0%',
        currentProgress: 94,
      },
      {
        label: 'Net Profit Margin',
        value: '21.5%',
        trend: 'up',
        status: 'success',
        hint: 'Чистая маржа',
        desc: 'Отношение чистой прибыли к выручке. Учитывает операционные расходы на платформе и финансовые отчеты партнеров.',
        target: '22.5%',
        currentProgress: 95,
      },
      {
        label: 'Market Share',
        value: '8.4%',
        trend: 'up',
        status: 'success',
        hint: 'Доля рынка',
        desc: 'Доля бренда в целевом сегменте. Рассчитывается на основе рыночной аналитики и данных о продажах конкурентов.',
        target: '10.0%',
        currentProgress: 84,
      },
      {
        label: 'NPS Score',
        value: '74',
        trend: 'up',
        status: 'success',
        hint: 'Лояльность клиентов',
        desc: 'Net Promoter Score. Анализируется через отзывы покупателей на платформе и результаты внешних опросов.',
        target: '80',
        currentProgress: 92,
      },
      {
        label: 'Employee Engagement',
        value: '88%',
        trend: 'stable',
        status: 'neutral',
        hint: 'Вовлеченность команды',
        desc: 'Уровень удовлетворенности и продуктивности сотрудников по данным HR-модуля и системы CHRO.',
        target: '90%',
        currentProgress: 97,
      },
      {
        label: 'ESG Rating',
        value: 'A+',
        trend: 'up',
        status: 'success',
        hint: 'Устойчивое развитие',
        desc: 'Рейтинг экологической и социальной ответственности. Рассчитывается через ESG-дашборд и сертификаты производства.',
        target: 'AA',
        currentProgress: 85,
      },
    ],
    influencingFactors: [
      {
        label: 'Глобальная инфляция',
        impact: 'negative',
        value: '-1.2%',
        desc: 'Рост стоимости сырья и логистики',
      },
      {
        label: 'AI-автоматизация',
        impact: 'positive',
        value: '+3.5%',
        desc: 'Снижение операционных издержек на 15%',
      },
      {
        label: 'Новые рынки (MENA)',
        impact: 'positive',
        value: '+5.8%',
        desc: 'Высокий спрос в сегменте премиум',
      },
    ],
    sections: [
      {
        title: 'Стратегические Инициативы',
        icon: Target,
        items: [
          { label: 'Выход на рынок MENA (ОАЭ, Саудовская Аравия)', progress: 65, status: 'Active' },
          {
            label: 'Запуск SS26 коллекции (Digital-First)',
            progress: 92,
            status: 'Near Completion',
          },
          { label: 'Переход на 100% переработанные материалы', progress: 40, status: 'Planning' },
        ],
      },
      {
        title: 'Риски и Возможности',
        icon: AlertTriangle,
        items: [
          { label: 'Волатильность логистических цепочек', progress: 15, status: 'Monitoring' },
          { label: 'Рост спроса на кастомизацию', progress: 80, status: 'Opportunity' },
        ],
      },
    ],
    aiInsight:
      'Текущие показатели указывают на высокую эффективность модели D2C. Рекомендуется ускорить экспансию в ОАЭ, так как органический спрос там превышает прогнозы на 22%. Обратите внимание на рост затрат на привлечение в B2C сегменте.',
  },
  CFO: {
    title: 'Chief Financial Officer (Финансовый директор)',
    roleName: 'CFO',
    summary: 'Высокая ликвидность и оптимизация Burn Rate. Успешное хеджирование валютных рисков.',
    scope: 'shared',
    kpis: [
      {
        label: 'EBITDA Margin',
        value: '28.4%',
        trend: 'up',
        status: 'success',
        hint: 'Маржа по EBITDA',
        desc: 'Прибыль до вычета процентов, налогов и амортизации. Основной индикатор операционной прибыльности.',
        target: '30.0%',
        currentProgress: 95,
      },
      {
        label: 'Operating Cash Flow',
        value: '112M ₽',
        trend: 'up',
        status: 'success',
        hint: 'Операционный поток',
        desc: 'Денежные средства, полученные от основной деятельности. Включает транзакции на платформе и банковские выписки.',
        target: '130M ₽',
        currentProgress: 86,
      },
      {
        label: 'ROI (Marketing)',
        value: '4.2x',
        trend: 'up',
        status: 'success',
        hint: 'Окупаемость маркетинга',
        desc: 'Возврат на инвестиции в рекламу. Синхронизируется с данными CMO и рекламных кабинетов (Meta, Google).',
        target: '5.0x',
        currentProgress: 84,
      },
      {
        label: 'Burn Rate',
        value: '-15%',
        trend: 'down',
        status: 'success',
        hint: 'Скорость расходования',
        desc: 'Ежемесячный темп потребления денежных средств. Анализируется для контроля финансовой устойчивости.',
        target: '-20%',
        currentProgress: 75,
      },
      {
        label: 'Debt-to-Equity',
        value: '0.35',
        trend: 'stable',
        status: 'neutral',
        hint: 'Долг к капиталу',
        desc: 'Соотношение заемного и собственного капитала. Показатель финансового рычага и кредитоспособности.',
        target: '0.30',
        currentProgress: 116,
      },
      {
        label: 'Working Capital',
        value: '84M ₽',
        trend: 'up',
        status: 'success',
        hint: 'Оборотный капитал',
        desc: 'Разница между текущими активами и обязательствами. Учитывает остатки на складах и дебиторскую задолженность.',
        target: '90M ₽',
        currentProgress: 93,
      },
    ],
    influencingFactors: [
      {
        label: 'Курс валют',
        impact: 'neutral',
        value: '±2%',
        desc: 'Хеджирование рисков по контрактам',
      },
      {
        label: 'Ставки по кредитам',
        impact: 'negative',
        value: '-0.5%',
        desc: 'Рост стоимости обслуживания долга',
      },
      {
        label: 'Налоговые льготы (R&D)',
        impact: 'positive',
        value: '+1.8M ₽',
        desc: 'Возмещение по инвестициям в AI',
      },
    ],
    sections: [
      {
        title: 'Управление Капиталом',
        icon: DollarSign,
        items: [
          { label: 'Инвестиции в R&D (AI Tools)', progress: 45, status: 'In Progress' },
          { label: 'Оптимизация налоговой структуры', progress: 100, status: 'Done' },
          { label: 'Подготовка к раунду B', progress: 30, status: 'Active' },
        ],
      },
    ],
    aiInsight:
      'Финансовое здоровье бренда оценивается как «Отличное». Резервы ликвидности позволяют увеличить бюджет на производство SS26 на 15% без привлечения внешнего финансирования. Рекомендуется пересмотреть условия с фабриками в Турции из-за изменения курса.',
  },
  COO: {
    title: 'Chief Operating Officer (Операционный директор)',
    roleName: 'COO',
    summary: 'Оптимизация складских запасов на 18%. Fill Rate на уровне международных стандартов.',
    scope: 'b2b',
    kpis: [
      {
        label: 'Fill Rate',
        value: '94.2%',
        trend: 'up',
        status: 'success',
        hint: 'Точность отгрузок',
        desc: 'Процент выполненных заказов к заказанным. Агрегирует данные складов и B2B-заказов на платформе.',
        target: '98.0%',
        currentProgress: 96,
      },
      {
        label: 'Inventory Turnover',
        value: '4.8x',
        trend: 'up',
        status: 'success',
        hint: 'Оборачиваемость',
        desc: 'Количество циклов продажи запасов в год. Анализирует данные о продажах и остатках от партнеров-ритейлеров.',
        target: '5.5x',
        currentProgress: 87,
      },
      {
        label: 'Supply Chain Lead Time',
        value: '12 days',
        trend: 'down',
        status: 'success',
        hint: 'Время цикла поставки',
        desc: 'Среднее время от заказа сырья до поступления готового изделия. Мониторится через VMI и Production-трекинг.',
        target: '10 days',
        currentProgress: 83,
      },
      {
        label: 'COGS %',
        value: '32%',
        trend: 'down',
        status: 'success',
        hint: 'Себестоимость',
        desc: 'Cost of Goods Sold. Процент себестоимости от выручки. Включает затраты на производство и логистику.',
        target: '30%',
        currentProgress: 93,
      },
      {
        label: 'Warehouse Accuracy',
        value: '99.8%',
        trend: 'stable',
        status: 'success',
        hint: 'Точность склада',
        desc: 'Процент совпадения физических остатков и данных в системе PIM/WMS.',
        target: '100%',
        currentProgress: 99,
      },
      {
        label: 'Returns Rate',
        value: '4.2%',
        trend: 'down',
        status: 'success',
        hint: 'Процент возвратов',
        desc: 'Доля возвращенных товаров. Анализируется в разрезе причин (брак, размер, дизайн) через B2C-модуль.',
        target: '3.5%',
        currentProgress: 80,
      },
    ],
    influencingFactors: [
      {
        label: 'Пропускная способность порта',
        impact: 'negative',
        value: '-2.5%',
        desc: 'Задержки в разгрузке в Китае',
      },
      {
        label: 'VMI Автоматизация',
        impact: 'positive',
        value: '+4.2%',
        desc: 'Снижение Out-of-stock на 12%',
      },
      {
        label: 'Стоимость топлива',
        impact: 'negative',
        value: '-1.8%',
        desc: 'Рост логистических тарифов',
      },
    ],
    sections: [
      {
        title: 'Производственная цепочка',
        icon: Factory,
        items: [
          { label: 'Внедрение VMI Portal для поставщиков', progress: 85, status: 'On Track' },
          { label: 'Автоматизация контроля качества (IoT)', progress: 55, status: 'Testing' },
          { label: 'Диверсификация поставщиков сырья', progress: 70, status: 'Active' },
        ],
      },
    ],
    aiInsight:
      "Операционная эффективность выросла за счет AI-прогнозирования стока. Прогноз: дефицит по категории 'Outerwear' через 3 недели. Рекомендуется активировать резервный канал поставок. Потенциал снижения COGS на 3% через консолидацию заказов ткани.",
  },
  CTO: {
    title: 'Chief Technology Officer (Технический директор)',
    roleName: 'CTO',
    summary: 'Стабильность систем 99.99%. Успешная интеграция генеративных AI-моделей в PIM.',
    scope: 'shared',
    kpis: [
      {
        label: 'System Uptime',
        value: '99.99%',
        trend: 'stable',
        status: 'success',
        hint: 'Доступность систем',
        desc: 'Процент времени бесперебойной работы платформы и API-шлюзов для партнеров.',
        target: '99.999%',
        currentProgress: 99,
      },
      {
        label: 'Security Compliance',
        value: '100%',
        trend: 'stable',
        status: 'success',
        hint: 'Кибербезопасность',
        desc: 'Соответствие международным стандартам защиты данных (SOC2, ISO 27001). Проверяется через IT-аудит.',
        target: '100%',
        currentProgress: 100,
      },
      {
        label: 'Dev Velocity',
        value: '42 pts',
        trend: 'up',
        status: 'success',
        hint: 'Скорость разработки',
        desc: 'Средний темп выпуска новых фич и обновлений платформы по данным Jira/GitHub интеграции.',
        target: '50 pts',
        currentProgress: 84,
      },
      {
        label: 'Technical Debt',
        value: '-12%',
        trend: 'down',
        status: 'success',
        hint: 'Технический долг',
        desc: 'Процент кода, требующего рефакторинга. Снижение показателя повышает стабильность и масштабируемость.',
        target: '-20%',
        currentProgress: 60,
      },
      {
        label: 'AI Usage Index',
        value: '68%',
        trend: 'up',
        status: 'success',
        hint: 'Использование AI',
        desc: 'Процент бизнес-процессов, автоматизированных через AI (генерация контента, скоринг, аналитика).',
        target: '85%',
        currentProgress: 80,
      },
      {
        label: 'API Response Time',
        value: '140ms',
        trend: 'down',
        status: 'success',
        hint: 'Отклик API',
        desc: 'Среднее время ответа серверных систем. Критично для мобильного приложения и интеграций с ритейлерами.',
        target: '100ms',
        currentProgress: 71,
      },
    ],
    influencingFactors: [
      {
        label: 'Edge Computing миграция',
        impact: 'positive',
        value: '-15ms',
        desc: 'Снижение задержки на периферии',
      },
      {
        label: 'Облачные затраты',
        impact: 'negative',
        value: '+4.2%',
        desc: 'Рост нагрузки из-за AI-моделей',
      },
      {
        label: 'Стабильность интернет-шлюзов',
        impact: 'neutral',
        value: '±0.01%',
        desc: 'Резервирование каналов',
      },
    ],
    sections: [
      {
        title: 'Инфраструктура и Инновации',
        icon: Cpu,
        items: [
          { label: 'Миграция на Edge Computing', progress: 45, status: 'Active' },
          { label: 'Разработка AI-стилиста v2.0', progress: 80, status: 'Alpha' },
          { label: 'Интеграция с ERP (Real-time Sync)', progress: 100, status: 'Done' },
        ],
      },
    ],
    aiInsight:
      'Технологический стек опережает конкурентов на 12-18 месяцев. Фокус на безопасности данных оправдан. Рекомендуется внедрить автоматическое тегирование медиа-активов через новую Vision-модель для снижения нагрузки на контент-отдел.',
  },
  CMO: {
    title: 'Chief Marketing Officer (Директор по маркетингу)',
    roleName: 'CMO',
    summary: 'Рост Brand Awareness на 25%. Высокая эффективность инфлюенс-маркетинга.',
    scope: 'b2c',
    kpis: [
      {
        label: 'CAC (Blended)',
        value: '1,240 ₽',
        trend: 'down',
        status: 'success',
        hint: 'Стоимость привлечения',
        desc: 'Средняя стоимость привлечения одного платящего клиента. Складывается из всех рекламных каналов.',
        target: '1,100 ₽',
        currentProgress: 88,
      },
      {
        label: 'LTV / CAC Ratio',
        value: '4.5x',
        trend: 'up',
        status: 'success',
        hint: 'Эффективность юнит-экономики',
        desc: 'Соотношение пожизненной ценности клиента к стоимости его привлечения. Золотой стандарт — выше 3x.',
        target: '5.5x',
        currentProgress: 82,
      },
      {
        label: 'ROAS (Meta/Google)',
        value: '5.2x',
        trend: 'up',
        status: 'success',
        hint: 'Возврат на рекламу',
        desc: 'Выручка от рекламы, деленная на затраты. Синхронизируется с данными рекламных кабинетов и продаж на платформе.',
        target: '6.5x',
        currentProgress: 80,
      },
      {
        label: 'Conversion Rate',
        value: '3.2%',
        trend: 'up',
        status: 'success',
        hint: 'Конверсия в покупку',
        desc: 'Процент посетителей, совершивших покупку. Анализируется по воронке продаж от клика до оплаты.',
        target: '4.0%',
        currentProgress: 80,
      },
      {
        label: 'Social Sentiment',
        value: 'Pos (88%)',
        trend: 'up',
        status: 'success',
        hint: 'Тональность упоминаний',
        desc: 'Анализ настроений аудитории в соцсетях через AI-мониторинг комментариев и тегов.',
        target: '95%',
        currentProgress: 92,
      },
      {
        label: 'MAU (App/Web)',
        value: '124K',
        trend: 'up',
        status: 'success',
        hint: 'Активные пользователи',
        desc: 'Monthly Active Users. Количество уникальных пользователей, посетивших платформу за месяц.',
        target: '150K',
        currentProgress: 83,
      },
    ],
    influencingFactors: [
      {
        label: 'Инфлюенс-кампании',
        impact: 'positive',
        value: '+18%',
        desc: 'Рост вирального охвата в TikTok',
      },
      {
        label: 'Рыночная конкуренция',
        impact: 'negative',
        value: '-0.8%',
        desc: 'Рост CAC из-за активности конкурентов',
      },
      {
        label: 'AI Content Studio',
        impact: 'positive',
        value: '+25%',
        desc: 'Снижение затрат на производство креативов',
      },
    ],
    sections: [
      {
        title: 'Маркетинговые Кампании',
        icon: Megaphone,
        items: [
          { label: 'Коллаборация с Acme Studios', progress: 100, status: 'Live' },
          { label: 'Запуск реферальной программы', progress: 40, status: 'Testing' },
          { label: 'TikTok Viral Campaign (AI Content)', progress: 75, status: 'Viral' },
        ],
      },
    ],
    aiInsight:
      "Кампания в TikTok показала CTR на 40% выше среднего. Рекомендуется перераспределить 15% бюджета из Google Ads в инфлюенс-канал. Анализ конкурентов: бренд 'X' начал агрессивную кампанию в вашем основном сегменте, требуется защитный промо-оффер.",
  },
  CIO: {
    title: 'Chief Information Officer (IT-директор)',
    roleName: 'CIO',
    summary:
      'Запуск Data Lake позволил объединить данные из 14 источников. 100% защита от киберугроз.',
    scope: 'shared',
    kpis: [
      {
        label: 'Data Integrity',
        value: '99.4%',
        trend: 'up',
        status: 'success',
        hint: 'Целостность данных',
        desc: 'Точность и непротиворечивость данных между платформой, ERP и внешними базами партнеров.',
        target: '100%',
        currentProgress: 99,
      },
      {
        label: 'IT Budget Util.',
        value: '92%',
        trend: 'stable',
        status: 'success',
        hint: 'Исполнение бюджета',
        desc: 'Процент освоения IT-бюджета. Анализируется для контроля затрат на инфраструктуру и лицензии.',
        target: '95%',
        currentProgress: 97,
      },
      {
        label: 'Cybersecurity Score',
        value: '98/100',
        trend: 'up',
        status: 'success',
        hint: 'Уровень киберзащиты',
        desc: 'Интегральный показатель защищенности систем от внешних атак и утечек данных.',
        target: '100/100',
        currentProgress: 98,
      },
      {
        label: 'System Latency',
        value: '45ms',
        trend: 'down',
        status: 'success',
        hint: 'Задержка систем',
        desc: 'Внутреннее время обработки запросов в ядре системы. Влияет на общую производительность.',
        target: '30ms',
        currentProgress: 67,
      },
      {
        label: 'Cloud Spend Opt.',
        value: '-18%',
        trend: 'down',
        status: 'success',
        hint: 'Оптимизация облака',
        desc: 'Эффективность использования облачных мощностей (AWS/Azure/Yandex). Снижение затрат при росте нагрузки.',
        target: '-25%',
        currentProgress: 72,
      },
      {
        label: 'User Support Sat.',
        value: '4.8/5',
        trend: 'up',
        status: 'success',
        hint: 'Удовлетворенность IT',
        desc: 'Оценка качества IT-поддержки внутренними пользователями и партнерами.',
        target: '5.0/5',
        currentProgress: 96,
      },
    ],
    influencingFactors: [
      {
        label: 'Data Lake миграция',
        impact: 'positive',
        value: '+12%',
        desc: 'Ускорение обработки данных',
      },
      {
        label: 'DDoS атаки',
        impact: 'negative',
        value: '-0.2%',
        desc: 'Краткосрочные пики нагрузки на WAF',
      },
      {
        label: 'Интеграция с ERP партнеров',
        impact: 'positive',
        value: '+8%',
        desc: 'Синхронизация остатков в реальном времени',
      },
    ],
    sections: [
      {
        title: 'Управление Данными',
        icon: Database,
        items: [
          { label: 'Внедрение BI Dashboard для всех отделов', progress: 95, status: 'Finalizing' },
          { label: 'GDPR & Personal Data Compliance', progress: 100, status: 'Compliant' },
          { label: 'Архитектура Microservices (Phase 3)', progress: 60, status: 'Active' },
        ],
      },
    ],
    aiInsight:
      'Централизация данных завершена. Рекомендуется запуск ML-модели для предсказания оттока (Churn Prediction) в B2B сегменте. Это позволит снизить потери партнеров на 10%. Необходимо обновить протоколы доступа для удаленных сотрудников.',
  },
  CHRO: {
    title: 'Chief Human Resources Officer (HR-директор)',
    roleName: 'CHRO',
    summary:
      "Снижение текучести кадров до рекордных 8%. Лидерство в рейтинге 'Best Place to Work'.",
    scope: 'shared',
    kpis: [
      {
        label: 'Retention Rate',
        value: '92%',
        trend: 'up',
        status: 'success',
        hint: 'Удержание талантов',
        desc: 'Процент сотрудников, оставшихся в компании за год. Индикатор здоровой корпоративной культуры.',
        target: '95%',
        currentProgress: 97,
      },
      {
        label: 'eNPS Score',
        value: '72',
        trend: 'up',
        status: 'success',
        hint: 'Лояльность команды',
        desc: 'Employee Net Promoter Score. Готовность сотрудников рекомендовать компанию как место работы.',
        target: '80',
        currentProgress: 90,
      },
      {
        label: 'Time to Hire',
        value: '18 days',
        trend: 'down',
        status: 'success',
        hint: 'Скорость найма',
        desc: 'Среднее время закрытия вакансии. Агрегирует данные HRMS и внешних рекрутинговых каналов.',
        target: '14 days',
        currentProgress: 78,
      },
      {
        label: 'Training Hours / Emp',
        value: '24h',
        trend: 'up',
        status: 'success',
        hint: 'Обучение',
        desc: 'Среднее количество часов обучения на одного сотрудника. Включает AI-курсы и профессиональные тренинги.',
        target: '30h',
        currentProgress: 80,
      },
      {
        label: 'Diversity Index',
        value: '0.78',
        trend: 'up',
        status: 'success',
        hint: 'Разнообразие команды',
        desc: 'Показатель разнообразия команды по полу, возрасту и опыту. Важен для ESG-рейтинга.',
        target: '0.85',
        currentProgress: 92,
      },
      {
        label: 'Comp. Competitiveness',
        value: 'Top 10%',
        trend: 'stable',
        status: 'success',
        hint: 'Конкурентность зарплат',
        desc: 'Положение компании в рыночных зарплатных сетках. Мониторится через внешние аналитические системы.',
        target: 'Top 5%',
        currentProgress: 50,
      },
    ],
    influencingFactors: [
      {
        label: 'AI-рекрутинг',
        impact: 'positive',
        value: '-4 дня',
        desc: 'Автоматизация первичного скоринга резюме',
      },
      {
        label: 'Инфляция зарплат',
        impact: 'negative',
        value: '+12%',
        desc: 'Рост ожиданий в IT-секторе',
      },
      {
        label: 'Удаленный формат',
        impact: 'positive',
        value: '+15%',
        desc: 'Доступ к глобальному пулу талантов',
      },
    ],
    sections: [
      {
        title: 'Таланты и Культура',
        icon: Users,
        items: [
          { label: 'Программа AI-обучения команды', progress: 100, status: 'Completed' },
          { label: 'Найм для экспансии в ОАЭ', progress: 45, status: 'Active' },
          { label: 'Запуск системы внутреннего менторства', progress: 60, status: 'In Work' },
        ],
      },
    ],
    aiInsight:
      'Высокий eNPS связан с внедрением AI-инструментов, снизивших рутину. Рекомендуется фокус на найме специалистов по международному маркетингу. Анализ рынка: средние зарплаты в IT-секторе выросли на 12%, требуется пересмотр бонусов для удержания ключевых разработчиков.',
  },
  CSO: {
    title: 'Chief Strategy Officer (Директор по стратегии)',
    roleName: 'CSO',
    summary: 'Стратегический план 2026 выполнен на 45%. Рост капитализации бренда на 30%.',
    scope: 'shared',
    kpis: [
      {
        label: 'Market Penetration',
        value: '+12%',
        trend: 'up',
        status: 'success',
        hint: 'Проникновение на рынок',
        desc: 'Процент захвата целевых рынков (MENA, EU, CIS). Анализируется через объем продаж партнеров на платформе.',
        target: '+15%',
        currentProgress: 80,
      },
      {
        label: 'Portfolio Health',
        value: '8.4/10',
        trend: 'up',
        status: 'success',
        hint: 'Здоровье портфеля',
        desc: 'Интегральная оценка актуальности и прибыльности всех линеек бренда. Учитывает жизненный цикл SKU.',
        target: '9.0/10',
        currentProgress: 93,
      },
      {
        label: 'Competitive Intensity',
        value: 'Med',
        trend: 'stable',
        status: 'neutral',
        hint: 'Активность конкурентов',
        desc: 'Уровень конкуренции в основном сегменте. Мониторится через AI-сканирование рыночных цен и акций.',
        target: 'Low',
        currentProgress: 40,
      },
      {
        label: 'M&A Pipeline (Targets)',
        value: '4',
        trend: 'up',
        status: 'success',
        hint: 'Цели поглощения',
        desc: 'Количество компаний в воронке для потенциального слияния или покупки. Интегрировано с CRM стратегии.',
        target: '6',
        currentProgress: 67,
      },
      {
        label: 'Innovation Revenue',
        value: '22%',
        trend: 'up',
        status: 'success',
        hint: 'Доля новых продуктов',
        desc: 'Процент выручки, полученный от товаров, выпущенных менее 12 месяцев назад. Индикатор скорости инноваций.',
        target: '30%',
        currentProgress: 73,
      },
      {
        label: 'Strategic CapEx',
        value: '145M ₽',
        trend: 'up',
        status: 'success',
        hint: 'Стратегические инвестиции',
        desc: 'Capital Expenditure на долгосрочные проекты (новые фабрики, R&D хабы, цифровые экосистемы).',
        target: '200M ₽',
        currentProgress: 72,
      },
    ],
    influencingFactors: [
      {
        label: 'Геополитическая обстановка',
        impact: 'neutral',
        value: 'Stable',
        desc: 'Влияние на логистику и пошлины',
      },
      {
        label: 'Партнерство с Farfetch',
        impact: 'positive',
        value: '+15%',
        desc: 'Рост глобальной доступности',
      },
      {
        label: 'M&A Возможности',
        impact: 'positive',
        value: '2 Активных',
        desc: 'Стартапы в сфере AI-логистики',
      },
    ],
    sections: [
      {
        title: 'Стратегия Роста',
        icon: Rocket,
        items: [
          { label: 'Партнерство с Farfetch/Tmall', progress: 30, status: 'Negotiation' },
          { label: "Запуск суб-бренда 'Syntha Essentials'", progress: 50, status: 'Design' },
          {
            label: 'M&A: Поглощение логистического стартапа',
            progress: 15,
            status: 'Due Diligence',
          },
        ],
      },
    ],
    aiInsight:
      "Текущая стратегия 'Vertical Integration' приносит плоды. Рекомендуется рассмотреть выход в категорию 'Smart Accessories', так как это логичное дополнение к технологичной одежде. Потенциальный рост выручки — 18% за первый год.",
  },
  CDO: {
    title: 'Chief Digital Officer (Digital-директор)',
    roleName: 'CDO',
    summary: 'Доля цифровых продаж достигла 65%. 100% автоматизация воронки в B2B.',
    scope: 'shared',
    kpis: [
      {
        label: 'D2C Digital Share',
        value: '65%',
        trend: 'up',
        status: 'success',
        hint: 'Доля онлайн-продаж',
        desc: 'Процент выручки от прямых онлайн-продаж (App/Web). Агрегирует данные со всех цифровых витрин.',
        target: '75%',
        currentProgress: 87,
      },
      {
        label: 'Omnichannel Sync',
        value: '100%',
        trend: 'stable',
        status: 'success',
        hint: 'Синхронизация каналов',
        desc: 'Единая точность данных об остатках и ценах во всех физических и цифровых точках продаж.',
        target: '100%',
        currentProgress: 100,
      },
      {
        label: 'Mobile App MAU',
        value: '84K',
        trend: 'up',
        status: 'success',
        hint: 'Активные в приложении',
        desc: 'Monthly Active Users мобильного приложения. Основной канал взаимодействия с лояльной аудиторией.',
        target: '100K',
        currentProgress: 84,
      },
      {
        label: 'Personalization Lift',
        value: '+18%',
        trend: 'up',
        status: 'success',
        hint: 'Рост от персонализации',
        desc: 'Дополнительная выручка, полученная за счет персональных рекомендаций AI-стилиста.',
        target: '+25%',
        currentProgress: 72,
      },
      {
        label: 'Data Monetization',
        value: '12M ₽',
        trend: 'up',
        status: 'success',
        hint: 'Монетизация данных',
        desc: 'Выручка от продажи анонимизированных аналитических отчетов ритейлерам и поставщикам.',
        target: '20M ₽',
        currentProgress: 60,
      },
      {
        label: 'Digital CX Score',
        value: '4.9/5',
        trend: 'up',
        status: 'success',
        hint: 'Цифровой опыт',
        desc: 'Средняя оценка пользовательского опыта (Customer Experience) во всех цифровых точках касания.',
        target: '5.0/5',
        currentProgress: 98,
      },
    ],
    influencingFactors: [
      {
        label: '3D-примерочная v2',
        impact: 'positive',
        value: '-25% возвратов',
        desc: 'Улучшение точности подбора размера',
      },
      {
        label: 'Затраты на Meta/Google',
        impact: 'negative',
        value: '+12%',
        desc: 'Рост стоимости клика в сезон',
      },
      {
        label: 'App Store фичеринг',
        impact: 'positive',
        value: '+40K уст.',
        desc: 'Органический рост инсталлов',
      },
    ],
    sections: [
      {
        title: 'Цифровая Трансформация',
        icon: Globe,
        items: [
          { label: 'Внедрение 3D-примерочной', progress: 88, status: 'Beta' },
          { label: 'Hyper-personalization Engine', progress: 45, status: 'Developing' },
          { label: 'NFT Loyalty Program Integration', progress: 100, status: 'Live' },
        ],
      },
    ],
    aiInsight:
      "Бренд стал 'Digital Leader'. Рекомендуется усилить инвестиции в 3D-контент, так как он снижает возвраты на 25%. Мобильное приложение показывает лучший LTV — перенаправьте трафик с веба на установку приложения через эксклюзивные дропы.",
  },
};
export { REPORT_DATA };

export function CeoReportSheet({ open, onOpenChange, role }: CeoReportSheetProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [planningPeriod, setPlanningPeriod] = useState<'season' | 'quarter' | 'year'>('quarter');
  const [isSettingTargets, setIsSettingTargets] = useState(false);
  const data = (REPORT_DATA as any)[role] || (REPORT_DATA as any).CEO;
  const [localTargets, setLocalTargets] = useState<Record<string, string>>({});

  // Memoized actuals based on period
  const periodSpecificKpis = React.useMemo(() => {
    const multiplier = planningPeriod === 'year' ? 1.4 : planningPeriod === 'season' ? 0.8 : 1.0;
    return data.kpis.map((kpi: any) => {
      // Very basic simulation of period-based values
      let actualValue = kpi.value;
      if (typeof kpi.value === 'string' && kpi.value.includes('%')) {
        const num = parseFloat(kpi.value);
        actualValue = `${(num * multiplier).toFixed(1)}%`;
      } else if (typeof kpi.value === 'string' && kpi.value.includes('M ₽')) {
        const num = parseFloat(kpi.value);
        actualValue = `${Math.round(num * multiplier)}M ₽`;
      }

      const actualProgress = Math.min(
        100,
        Math.round(kpi.currentProgress * (multiplier > 1 ? 0.9 : 1.1))
      );

      return {
        ...kpi,
        value: actualValue,
        currentProgress: actualProgress,
        target: localTargets[kpi.label] || kpi.target,
      };
    });
  }, [data.kpis, planningPeriod, localTargets]);

  const handleAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAI(true);
    }, 1500);
  };

  const toggleTargetSetting = () => {
    if (isSettingTargets) {
      // Save logic (simulation)
      setIsSettingTargets(false);
    } else {
      setIsSettingTargets(true);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) {
          setShowAI(false);
          setIsSettingTargets(false);
        }
      }}
    >
<<<<<<< HEAD
      <SheetContent className="w-full overflow-hidden border-none bg-slate-50 p-0 font-sans sm:max-w-[650px]">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="relative overflow-hidden bg-slate-900 p-4 text-white">
            <div className="absolute -right-10 -top-3 opacity-10">
              <BrainCircuit className="h-48 w-48 text-indigo-400" />
=======
      <SheetContent className="bg-bg-surface2 w-full overflow-hidden border-none p-0 font-sans sm:max-w-[650px]">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="bg-text-primary relative overflow-hidden p-4 text-white">
            <div className="absolute -right-10 -top-3 opacity-10">
              <BrainCircuit className="text-accent-primary h-48 w-48" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <div className="rounded-xl bg-indigo-600 p-2">
=======
                  <div className="bg-accent-primary rounded-xl p-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="h-5 border-white/20 px-2 text-[8px] font-black uppercase tracking-widest text-white/60"
                  >
                    INTERNAL_REPORT // {data.roleName}
                  </Badge>
                </div>
                <Badge className="h-5 animate-pulse border-none bg-rose-500 px-2 text-[8px] font-black uppercase text-white">
                  Confidential
                </Badge>
              </div>
              <SheetTitle className="text-sm font-black uppercase tracking-tight text-white">
                {data.title}
              </SheetTitle>
<<<<<<< HEAD
              <SheetDescription className="mt-2 max-w-md text-xs font-medium leading-relaxed text-slate-400">
=======
              <SheetDescription className="text-text-muted mt-2 max-w-md text-xs font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                {data.summary}
              </SheetDescription>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-12">
              {/* Planning & Targets Period Selector */}
<<<<<<< HEAD
              <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
=======
              <div className="border-border-subtle space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-accent-primary h-4 w-4" />
                    <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Планирование и KPI
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
<<<<<<< HEAD
                      className="h-6 w-6 rounded-lg transition-colors hover:bg-slate-100"
                    >
                      <History className="h-3 w-3 text-slate-400" />
=======
                      className="hover:bg-bg-surface2 h-6 w-6 rounded-lg transition-colors"
                    >
                      <History className="text-text-muted h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
<<<<<<< HEAD
                      className="h-6 w-6 rounded-lg transition-colors hover:bg-slate-100"
                    >
                      <Settings className="h-3 w-3 text-slate-400" />
=======
                      className="hover:bg-bg-surface2 h-6 w-6 rounded-lg transition-colors"
                    >
                      <Settings className="text-text-muted h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
<<<<<<< HEAD
                  <div className="flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1">
=======
                  <div className="bg-bg-surface2 border-border-subtle flex items-center gap-1 rounded-xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
                    {(['season', 'quarter', 'year'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPlanningPeriod(p);
                          setIsSettingTargets(false);
                        }}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all',
                          planningPeriod === p
<<<<<<< HEAD
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
=======
                            ? 'text-text-primary ring-border-default bg-white shadow-sm ring-1'
                            : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        {p === 'season' ? 'Сезон' : p === 'quarter' ? 'Квартал' : 'Год'}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={toggleTargetSetting}
                    variant={isSettingTargets ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'h-8 rounded-xl px-3 text-[8px] font-black uppercase tracking-widest transition-all',
                      isSettingTargets
                        ? 'border-none bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'
<<<<<<< HEAD
                        : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'
=======
                        : 'border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {isSettingTargets ? 'Сохранить цели' : 'Установить цели'}
                  </Button>
                </div>
<<<<<<< HEAD
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                <div className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Установка и отслеживание целевых показателей на{' '}
                  {planningPeriod === 'season'
                    ? 'текущий сезон'
                    : planningPeriod === 'quarter'
                      ? 'III Квартал'
                      : '2026 год'}
                </div>
              </div>

              {/* AI Analysis Trigger */}
              {!showAI ? (
                <Button
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
<<<<<<< HEAD
                  className="group relative h-10 w-full overflow-hidden rounded-2xl bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700"
                >
                  <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
=======
                  className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 group relative h-10 w-full overflow-hidden rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl"
                >
                  <div className="from-accent-primary to-accent-primary animate-shimmer absolute inset-0 bg-gradient-to-r via-purple-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
>>>>>>> recover/cabinet-wip-from-stash
                  <span className="relative flex items-center justify-center gap-3">
                    {isAnalyzing ? (
                      <Bot className="h-5 w-5 animate-bounce" />
                    ) : (
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    )}
                    {isAnalyzing
                      ? 'Искусственный Интеллект анализирует данные...'
                      : 'Запросить ИИ-анализ и рекомендации'}
                  </span>
                </Button>
              ) : (
<<<<<<< HEAD
                <Card className="overflow-hidden rounded-xl border-indigo-200 bg-indigo-50/30 duration-500 animate-in slide-in-from-top-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-indigo-600" />
                      <CardTitle className="text-[10px] font-black uppercase tracking-widest text-indigo-900">
=======
                <Card className="border-accent-primary/30 bg-accent-primary/10 overflow-hidden rounded-xl duration-500 animate-in slide-in-from-top-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="text-accent-primary h-4 w-4" />
                      <CardTitle className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        AI Insight & Recommendations
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
<<<<<<< HEAD
                    <p className="text-xs font-medium italic leading-relaxed text-slate-700">
=======
                    <p className="text-text-primary text-xs font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      «{data.aiInsight}»
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="border-indigo-100 bg-white text-[7px] font-black uppercase text-indigo-600"
=======
                        className="border-accent-primary/20 text-accent-primary bg-white text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        Actionable
                      </Badge>
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="border-indigo-100 bg-white text-[7px] font-black uppercase text-indigo-600"
=======
                        className="border-accent-primary/20 text-accent-primary bg-white text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        High Priority
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* KPIs Grid - 3 columns, small cards */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
<<<<<<< HEAD
                  <PieChart className="h-4 w-4 text-slate-400" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
=======
                  <PieChart className="text-text-muted h-4 w-4" />
                  <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Key Performance Indicators
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <TooltipProvider>
                    {periodSpecificKpis.map((kpi: any, i: number) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'group cursor-help space-y-3 rounded-2xl border bg-white p-4 transition-all',
                              isSettingTargets
<<<<<<< HEAD
                                ? 'border-indigo-300 shadow-lg ring-2 ring-indigo-50'
                                : 'border-slate-100 shadow-sm hover:border-indigo-100'
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">
=======
                                ? 'border-accent-primary/30 ring-accent-primary/10 shadow-lg ring-2'
                                : 'border-border-subtle hover:border-accent-primary/20 shadow-sm'
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-text-muted group-hover:text-accent-primary text-[7px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                {kpi.label}
                              </p>
                              <div
                                className={cn(
                                  'flex items-center gap-0.5 text-[8px] font-black',
                                  kpi.trend === 'up'
                                    ? 'text-emerald-500'
                                    : kpi.trend === 'down'
                                      ? 'text-rose-500'
<<<<<<< HEAD
                                      : 'text-slate-400'
=======
                                      : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                                )}
                              >
                                {kpi.trend === 'up' ? (
                                  <TrendingUp className="h-2.5 w-2.5" />
                                ) : kpi.trend === 'down' ? (
                                  <TrendingDown className="h-2.5 w-2.5" />
                                ) : (
                                  <Activity className="h-2.5 w-2.5" />
                                )}
                              </div>
                            </div>

                            <div className="flex items-end justify-between">
                              <div className="w-full space-y-0.5">
<<<<<<< HEAD
                                <span className="text-sm font-black tabular-nums leading-none text-slate-900">
=======
                                <span className="text-text-primary text-sm font-black tabular-nums leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                                  {kpi.value}
                                </span>
                                {isSettingTargets ? (
                                  <div className="mt-2 space-y-1">
<<<<<<< HEAD
                                    <label className="block text-[6px] font-black uppercase tracking-widest text-indigo-400">
=======
                                    <label className="text-accent-primary block text-[6px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                      Новая цель:
                                    </label>
                                    <Input
                                      value={localTargets[kpi.label] || kpi.target}
                                      onChange={(e) =>
                                        setLocalTargets({
                                          ...localTargets,
                                          [kpi.label]: e.target.value,
                                        })
                                      }
<<<<<<< HEAD
                                      className="h-6 border-indigo-100 bg-indigo-50/30 text-[9px] font-black tabular-nums"
=======
                                      className="border-accent-primary/20 bg-accent-primary/10 h-6 text-[9px] font-black tabular-nums"
>>>>>>> recover/cabinet-wip-from-stash
                                      placeholder="Введите цель..."
                                    />
                                  </div>
                                ) : (
                                  kpi.target && (
<<<<<<< HEAD
                                    <div className="text-[7px] font-black uppercase text-slate-400">
=======
                                    <div className="text-text-muted text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      Цель: {kpi.target}
                                    </div>
                                  )
                                )}
                              </div>
                              {!isSettingTargets && kpi.currentProgress && (
<<<<<<< HEAD
                                <div className="text-[9px] font-black tabular-nums text-indigo-600">
=======
                                <div className="text-accent-primary text-[9px] font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                                  {kpi.currentProgress}%
                                </div>
                              )}
                            </div>

                            {!isSettingTargets && kpi.currentProgress && (
<<<<<<< HEAD
                              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-50">
=======
                              <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                                <div
                                  className={cn(
                                    'h-full transition-all duration-1000',
                                    kpi.currentProgress > 90
                                      ? 'bg-emerald-500'
                                      : kpi.currentProgress > 70
<<<<<<< HEAD
                                        ? 'bg-indigo-500'
=======
                                        ? 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                                        : 'bg-amber-500'
                                  )}
                                  style={{ width: `${kpi.currentProgress}%` }}
                                />
                              </div>
                            )}

                            {kpi.hint && (
<<<<<<< HEAD
                              <p className="text-[6px] font-bold uppercase text-slate-300">
=======
                              <p className="text-text-muted text-[6px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                {kpi.hint}
                              </p>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
<<<<<<< HEAD
                          className="max-w-[200px] rounded-xl border-none bg-slate-900 p-3 text-[9px] font-medium text-white shadow-xl"
                        >
                          <p className="mb-1 font-black uppercase tracking-widest text-indigo-400">
=======
                          className="bg-text-primary max-w-[200px] rounded-xl border-none p-3 text-[9px] font-medium text-white shadow-xl"
                        >
                          <p className="text-accent-primary mb-1 font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            {kpi.label}
                          </p>
                          <p className="leading-relaxed opacity-90">
                            {kpi.desc || 'Детальный анализ метрики на основе данных платформы.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>

              {/* Influencing Factors Section */}
              {data.influencingFactors && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
<<<<<<< HEAD
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
=======
                    <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Факторы влияния на результат
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {data.influencingFactors.map((factor: any, i: number) => (
                      <div
                        key={i}
<<<<<<< HEAD
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-amber-100"
=======
                        className="border-border-subtle group flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm transition-colors hover:border-amber-100"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner',
                              factor.impact === 'positive'
                                ? 'bg-emerald-50 text-emerald-500'
                                : factor.impact === 'negative'
                                  ? 'bg-rose-50 text-rose-500'
<<<<<<< HEAD
                                  : 'bg-slate-50 text-slate-400'
=======
                                  : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {factor.impact === 'positive' ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : factor.impact === 'negative' ? (
                              <TrendingDown className="h-5 w-5" />
                            ) : (
                              <Activity className="h-5 w-5" />
                            )}
                          </div>
                          <div>
<<<<<<< HEAD
                            <p className="mb-0.5 text-[10px] font-black uppercase leading-tight text-slate-900">
                              {factor.label}
                            </p>
                            <p className="text-[8px] font-medium uppercase tracking-widest text-slate-400">
=======
                            <p className="text-text-primary mb-0.5 text-[10px] font-black uppercase leading-tight">
                              {factor.label}
                            </p>
                            <p className="text-text-muted text-[8px] font-medium uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                              {factor.desc}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'text-sm font-black tabular-nums',
                            factor.impact === 'positive'
                              ? 'text-emerald-500'
                              : factor.impact === 'negative'
                                ? 'text-rose-500'
<<<<<<< HEAD
                                : 'text-slate-400'
=======
                                : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {factor.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-6">
                {data.sections.map((section: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                      <section.icon className="h-4 w-4 text-indigo-600" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
=======
                      <section.icon className="text-accent-primary h-4 w-4" />
                      <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        {section.title}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {section.items.map((item: any, i: number) => (
                        <Card
                          key={i}
<<<<<<< HEAD
                          className="group overflow-hidden rounded-2xl border-slate-100 shadow-sm transition-all hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700">
=======
                          className="border-border-subtle group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md"
                        >
                          <CardContent className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-text-primary text-[10px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                {item.label}
                              </span>
                              <Badge
                                variant="secondary"
<<<<<<< HEAD
                                className="bg-slate-50 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600"
=======
                                className="bg-bg-surface2 group-hover:bg-accent-primary/10 group-hover:text-accent-primary px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <div className="space-y-1.5">
<<<<<<< HEAD
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                                <span>Progress / Maturity</span>
                                <span>{item.progress}%</span>
                              </div>
                              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
=======
                              <div className="text-text-muted flex justify-between text-[8px] font-black uppercase tracking-widest">
                                <span>Progress / Maturity</span>
                                <span>{item.progress}%</span>
                              </div>
                              <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                                <div
                                  className={cn(
                                    'h-full transition-all duration-1000 group-hover:brightness-110',
                                    item.progress > 80
                                      ? 'bg-emerald-500'
                                      : item.progress > 40
<<<<<<< HEAD
                                        ? 'bg-indigo-500'
=======
                                        ? 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                                        : 'bg-amber-500'
                                  )}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
<<<<<<< HEAD
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <button className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-200 transition-all hover:bg-black active:scale-95">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Экспорт Полного Отчета
                </button>
                <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
=======
              <div className="border-border-subtle grid grid-cols-2 gap-3 border-t pt-4">
                <button className="bg-text-primary flex h-12 items-center justify-center gap-2 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-md transition-all hover:bg-black active:scale-95">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Экспорт Полного Отчета
                </button>
                <button className="border-border-default text-text-primary hover:bg-bg-surface2 flex h-12 items-center justify-center gap-2 rounded-2xl border bg-white text-[9px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95">
>>>>>>> recover/cabinet-wip-from-stash
                  <Users className="h-3.5 w-3.5" /> Доступ Команде
                </button>
              </div>

              <div className="pt-4">
<<<<<<< HEAD
                <Button className="h-12 w-full rounded-[1.25rem] bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700">
=======
                <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 h-12 w-full rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                  Скачать аналитическую записку для {data.roleName}{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
