
'use client';

import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";

const brandFeaturesData = [
    // Управление товарами
    {
        feature: 'Управление товарами (SKU)',
        basic: 'до 50',
        pro: 'до 200',
        elite: 'до 500',
        enterprise: 'Безлимит',
        tooltip: {
            what: 'Максимальное количество товарных позиций (SKU), которые можно загрузить и продавать на платформе.',
            why: 'Позволяет гибко управлять ассортиментом в зависимости от масштаба вашего бизнеса — от небольших капсульных коллекций до полного каталога.'
        }
    },
    {
        feature: '3D-прототипирование и семплинг',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Инструмент для создания и согласования с байерами фотореалистичных цифровых 3D-прототипов вместо дорогостоящих физических образцов.',
            why: 'Экономит до 90% затрат на разработку и логистику образцов, ускоряет цикл согласования и снижает углеродный след.'
        }
    },
     {
        feature: 'AI-ассистент по материалам',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Базовый',
        enterprise: 'Расширенный',
        tooltip: {
            what: 'AI-система, которая подбирает подходящие материалы из базы поставщиков на основе 3D-модели и желаемых характеристик (например, "дышащая, водонепроницаемая, с эффектом шелка").',
            why: 'Ускоряет поиск инновационных и устойчивых материалов, расширяет базу поставщиков и помогает найти более выгодные альтернативы.'
        }
    },
     {
        feature: 'Симулятор себестоимости и сроков',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Базовый',
        enterprise: 'Полный',
        tooltip: {
            what: 'Интерактивный калькулятор, позволяющий в реальном времени видеть, как выбор разных поставщиков материалов или фабрик повлияет на итоговую себестоимость, маржинальность и сроки производства.',
            why: 'Помогает принимать обоснованные финансовые решения на самом раннем этапе, оптимизировать затраты и точно планировать производственный бюджет.'
        }
    },
    {
        feature: 'Интеграция с производством (PLM)',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Прямая интеграция с PLM-системами (Product Lifecycle Management) фабрик-партнеров.',
            why: 'Позволяет отслеживать все этапы производства (от раскроя до упаковки) прямо в кабинете Syntha, обеспечивая полную прозрачность и контроль над сроками.'
        }
    },
    {
        feature: 'Дашборд контроля качества (QC)',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Единый центр, куда фабрики-партнеры загружают отчеты о проверке качества партии, включая фотографии образцов и выявленных дефектов.',
            why: 'Обеспечивает удаленный контроль качества, снижает риск получения бракованной партии и позволяет оперативно решать проблемы на производстве.'
        }
    },
    {
        feature: 'AI-подбор фабрик',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Рекомендации',
        enterprise: 'Автоматический',
        tooltip: {
            what: 'Система, которая анализирует tech pack модели (сложность кроя, материалы, тип швов) и подбирает наиболее подходящие фабрики из партнерской сети.',
            why: 'Экономит время на поиск и верификацию подрядчиков, снижает риски производственного брака и помогает найти партнеров с нужной специализацией и ESG-рейтингом.'
        }
    },
     {
        feature: 'AI-ассистент по переговорам',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'AI-система, которая анализирует tech pack и рыночные цены на производство, а затем генерирует проект коммерческого предложения для фабрики.',
            why: 'Помогает вести переговоры на основе данных, аргументированно обсуждать стоимость и получать лучшие условия от подрядчиков.'
        }
    },
     {
        feature: 'Генеративный поиск поставщиков',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Вместо простого поиска, бренд описывает нужный материал (например, "водонепроницаемый, дышащий, с эффектом \'мокрого шелка\'"), и AI подбирает поставщиков, чья продукция соответствует этому описанию.',
            why: 'Позволяет находить уникальные и инновационные материалы, быстро проверять гипотезы и расширять базу надежных поставщиков.'
        }
    },
    {
        feature: 'AI Defect Detection',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Использование компьютерного зрения для автоматического обнаружения дефектов (неровный шов, пятна, затяжки) на фотографиях готовой продукции с производства.',
            why: 'Снижает процент брака до отгрузки, повышает качество финального продукта и экономит затраты на возвраты и споры с фабрикой.'
        }
    },
     {
        feature: '"Цифровой двойник" производства',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Возможность создать виртуальную 3D-копию своей производственной линии для моделирования и оптимизации процессов.',
            why: 'Позволяет тестировать новые производственные потоки, планировать загрузку оборудования и обучать персонал без остановки реального производства.'
        }
    },


    // B2B Функционал
    {
        feature: 'B2B Предзаказы и линии',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Функционал для создания цифровых шоурумов (linesheets) и приема оптовых предзаказов от магазинов и байеров.',
            why: 'Ускоряет и удешевляет B2B-продажи, позволяет собирать предзаказы со всего мира и точно прогнозировать объемы производства.'
        }
    },
    {
        feature: 'Smart Replenishment (Умное пополнение)',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Рекомендации',
        enterprise: 'Автозаказ',
        tooltip: {
            what: 'Система, которая анализирует скорость продаж у ритейлеров-партнеров и предлагает или автоматически формирует для них заказы на пополнение склада.',
            why: 'Увеличивает объем дозаказов, предотвращает "out-of-stock" у партнеров и повышает оборачиваемость ваших товаров в рознице.'
        }
    },
    {
        feature: 'Калькулятор логистических затрат',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Инструмент для расчета стоимости доставки и таможенных сборов при работе с разными фабриками и рынками сбыта.',
            why: 'Помогает точно рассчитать конечную себестоимость товара и выбрать наиболее выгодные логистические маршруты.'
        }
    },
     {
        feature: 'Финансирование B2B-заказов',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Опционально',
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Партнерская программа для получения финансирования (Invoice Financing) под подтвержденные оптовые заказы.',
            why: 'Улучшает денежный поток бренда, позволяя запускать производство новых коллекций, не дожидаясь полной оплаты от ритейлеров.'
        }
    },
    {
        feature: 'Автоматизация роялти',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Автоматический расчет и распределение доли от продаж при коллаборациях с другими дизайнерами или инфлюенсерами.',
            why: 'Упрощает финансовые расчеты в совместных проектах, делает их прозрачными и исключает ошибки ручного подсчета.'
        }
    },

    // Аналитика и AI
    {
        feature: 'Базовая аналитика продаж',
        basic: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Дашборд с основными метриками: выручка, количество заказов, средний чек, популярные товары.',
            why: 'Дает общее представление об эффективности продаж на платформе.'
        }
    },
    {
        feature: 'Аналитика 360°',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Глубокий анализ SKU (ABC/XYZ), матрица "клиент-бренд", индексы потребительской лояльности (NPS) и удовлетворенности (CSAT).',
            why: 'Помогает понять, какие товары приносят максимальную прибыль, кто ваша самая лояльная аудитория и над чем стоит поработать.'
        }
    },
     {
        feature: 'AI Trend Forecaster',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: 'Общий',
        elite: 'Детальный',
        enterprise: 'Real-time',
        tooltip: {
            what: 'AI-модель, которая анализирует данные платформы и внешние источники для прогнозирования трендов в категориях, цветах и силуэтах.',
            why: 'Помогает принимать решения о будущих коллекциях на основе данных, а не только интуиции, снижая риск производства невостребованных товаров.'
        }
    },
    {
        feature: 'AI Merchandising Advisor',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: 'Базовый',
        elite: 'Расширенный',
        enterprise: 'Полный доступ',
        tooltip: {
            what: 'AI-ассистент, дающий рекомендации по ценообразованию, управлению стоками и оптимальному представлению товаров в каталоге.',
            why: 'Помогает максимизировать маржинальность, избегать дефицита или избытка товара и улучшать визуальную привлекательность вашей витрины.'
        }
    },
    {
        feature: 'AI-модель эластичности цен',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Базовый',
        enterprise: 'Полный',
        tooltip: {
            what: 'AI-инструмент, прогнозирующий, как изменение цены на товар повлияет на спрос и итоговую выручку.',
            why: 'Позволяет находить оптимальную цену для максимизации прибыли, не отпугнув покупателей, и понимать, на сколько можно поднять цену во время высокого спроса.'
        }
    },
    {
        feature: 'Predictive Return Analysis',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'AI-модель, которая анализирует атрибуты нового товара (ткань, крой) и прогнозирует вероятный процент возвратов.',
            why: 'Помогает выявить проблемы с посадкой или качеством еще до начала массового производства, снижая издержки на возвраты.'
        }
    },
    {
        feature: 'Анализ совместных покупок',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Ежемесячно',
        enterprise: 'Real-time',
        tooltip: {
            what: 'Отчет о том, какие товары других брендов покупают вместе с вашими. Помогает понять контекст использования ваших вещей.',
            why: 'Дает идеи для коллабораций, кросс-промо и создания комплексных образов в лукбуках.'
        }
    },
    {
        feature: 'Анализ пути клиента',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Базовый',
        enterprise: 'Полный',
        tooltip: {
            what: 'Визуализация пути клиента от первого контакта с вашим брендом (например, просмотр в ленте) до покупки.',
            why: 'Помогает выявить и устранить "узкие места" в воронке продаж и понять, какие каналы привлечения работают наиболее эффективно.'
        }
    },
     {
        feature: 'Ассистент по международной адаптации',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'AI, который анализирует коллекцию и дает рекомендации по ее адаптации для выхода на новые рынки (изменение цветовой палитры, кроя, добавление определенных моделей).',
            why: 'Снижает риски и затраты при международной экспансии, адаптируя продукт под культурные и климатические особенности нового рынка.'
        }
    },
    {
        feature: 'Интегрируемые дашборды (White-label)',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Возможность встраивать аналитические дашборды Syntha (например, по продажам или трендам) напрямую во внутренние системы отчетности вашего бренда (BI, CRM).',
            why: 'Создает единое рабочее пространство для вашей команды, избавляя от необходимости переключаться между разными системами.'
        }
    },


    // Маркетинг и Медиа
     {
        feature: 'AI Creative Director',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Опционально',
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'AI-генерация полноценных концепций рекламных кампаний, включая мудборды, цветовые палитры и референсы для съемок.',
            why: 'Ускоряет и удешевляет креативный процесс, позволяя быстро тестировать различные визуальные гипотезы.'
        }
    },
    {
        feature: 'Динамическая оптимизация креативов (DCO)',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'AI в реальном времени тестирует сотни вариаций рекламного баннера (меняя фон, текст, ракурс товара) и автоматически выбирает лучший для каждого сегмента аудитории.',
            why: 'Значительно повышает CTR и конверсию рекламных кампаний за счет автоматической персонализации креативов.'
        }
    },
    {
        feature: 'AI-генератор видео-тизеров',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: 'до 5/мес',
        elite: 'до 20/мес',
        enterprise: 'Безлимит',
        tooltip: {
            what: 'Автоматическое создание коротких, динамичных видеороликов для анонсов в соцсетях на основе изображений вашей коллекции.',
            why: 'Позволяет быстро создавать видео-контент для TikTok, Reels и Shorts без затрат на видео-продакшн.'
        }
    },
     {
        feature: 'AI-генератор лукбуков',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: 'Полный доступ',
        tooltip: {
            what: 'Автоматическая верстка цифровых лукбуков с выбором шаблонов, добавлением брендинга и генерацией описаний.',
            why: 'Сокращает время на создание профессиональных B2B и B2C каталогов с недель до нескольких часов.'
        }
    },
    {
        feature: 'Shoppable Video',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Возможность загружать видео и добавлять интерактивные точки для покупки товаров прямо из ролика.',
            why: 'Повышает конверсию, позволяя клиентам мгновенно добавлять в корзину понравившиеся вещи из видео-контента.'
        }
    },
    {
        feature: 'Интерактивные опросы в Live',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Проведение голосований и опросов в реальном времени во время прямых трансляций.',
            why: 'Помогает получить мгновенную обратную связь от аудитории по поводу новых моделей, цветов или будущих коллекций.'
        }
    },
     {
        feature: 'Курирование и лицензирование UGC',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Инструменты для поиска лучшего пользовательского контента (UGC) с вашими товарами и отправки запроса на право его использования в своих маркетинговых материалах.',
            why: 'Позволяет легально использовать аутентичный контент от ваших клиентов, что повышает доверие и вовлеченность.'
        }
    },
    {
        feature: 'Спонсорство челленджей',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Возможность запускать спонсируемые челленджи для всего сообщества платформы (например, "Создай лучший образ с нашим новым тренчем").',
            why: 'Масштабный и нативный способ продвижения, который генерирует виральный охват и большое количество пользовательского контента.'
        }
    },
    {
        feature: 'Персонализированные витрины',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Создание динамических версий страницы бренда, которые автоматически адаптируются под разные сегменты аудитории (например, показывают разные товары для новых и лояльных клиентов).',
            why: 'Повышает релевантность предложения для каждого пользователя и, как следствие, конверсию в покупку.'
        }
    },
     {
        feature: 'Динамическая сегментация аудитории',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: 'Real-time',
        tooltip: {
            what: 'Инструмент для создания "живых" сегментов аудитории для таргетированных промо-акций (например, "клиенты, добавившие в избранное, но не купившие за последние 7 дней").',
            why: 'Позволяет проводить высокоточные, персонализированные маркетинговые кампании и возвращать клиентов в воронку продаж.'
        }
    },
    {
        feature: 'Виртуальные инфлюенсеры и модели',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Опционально',
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Возможность "нанять" одного из цифровых аватаров Syntha для создания эксклюзивного контента или целой рекламной кампании.',
            why: 'Дает полный контроль над креативом, избавляет от сложностей организации съемок и позволяет создавать уникальный, футуристичный контент.'
        }
    },
    {
        feature: 'NFT-кампании "под ключ"',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Опционально',
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Полный сервис по разработке, запуску и продвижению лимитированных коллекций цифровых активов (NFT), привязанных к вашему бренду.',
            why: 'Открывает новый источник дохода, повышает лояльность и привлекает технологически продвинутую аудиторию Web3.'
        }
    },


    // ESG и Интеграции
    {
        feature: 'Отслеживание ESG-метрик',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Дашборд для отслеживания показателей устойчивого развития: доля переработанных материалов, сокращение отходов за счет цифрового семплинга, углеродный след.',
            why: 'Предоставляет конкретные данные для ESG-отчетности, повышает доверие инвесторов и экологически осознанных потребителей.'
        }
    },
    {
        feature: 'Калькулятор углеродного следа',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Автоматический расчет углеродного следа для каждого товара на основе данных о материалах, производстве и логистике.',
            why: 'Делает ваш бренд более прозрачным и позволяет клиентам делать осознанный выбор.'
        }
    },
    {
        feature: 'Цифровой паспорт товара',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: 'Опционально',
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Создание уникального цифрового паспорта для каждого изделия на блокчейне, подтверждающего его подлинность, историю и состав.',
            why: 'Защищает от подделок, открывает возможности для вторичного рынка и повышает ценность каждой вещи.'
        }
    },
     {
        feature: 'Material Traceability Dashboard',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Дашборд для отслеживания всей цепочки поставок материалов с использованием блокчейн-технологий.',
            why: 'Обеспечивает полную прозрачность происхождения продукта, что является ключевым фактором для осознанных потребителей и ESG-инвесторов.'
        }
    },
    {
        feature: 'Интеграция с CRM',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        proText: '',
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'API для двусторонней синхронизации данных о клиентах и заказах с вашей CRM-системой (например, Zendesk, Salesforce).',
            why: 'Создает единый профиль клиента и позволяет вашей команде по продажам и поддержке иметь полную картину взаимодействия.'
        }
    },
     {
        feature: 'Интеграция с "умными" зеркалами',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'API для партнерских магазинов, позволяющее подключать "умные" примерочные, которые распознают ваши товары и показывают на экране рекомендации.',
            why: 'Расширяет цифровой опыт вашего бренда в физическое пространство, создавая бесшовный Phygital-сценарий для клиента.'
        }
    },
    {
        feature: 'Совместные программы лояльности',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Возможность совместно с платформой Syntha запускать маркетинговые акции с удвоенными бонусами или эксклюзивными наградами.',
            why: 'Повышает вовлеченность клиентов и позволяет проводить масштабные промо-кампании с минимальными затратами.'
        }
    },
    {
        feature: 'Персональный менеджер',
        basic: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        pro: <X className="h-5 w-5 text-muted-foreground mx-auto" />,
        elite: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" />,
        tooltip: {
            what: 'Выделенный специалист со стороны Syntha, который помогает с настройкой кабинета, запуском кампаний и анализом результатов.',
            why: 'Ускоряет освоение платформы и помогает максимально эффективно использовать все ее инструменты для роста вашего бизнеса.'
        }
    },
];

const plansMeta = [
    { name: 'Brand Basic', variant: 'secondary'},
    { name: 'Brand PRO', variant: 'default', badge: 'Популярный'},
    { name: 'Brand ELITE', variant: 'secondary'},
    { name: 'Enterprise', variant: 'secondary'},
]

export function BrandFeaturesTable() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Сравнение тарифов</CardTitle>
                <CardDescription>Подробное описание функций, доступных в каждом из планов для брендов.</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div className="w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold min-w-[250px]">Функция</TableHead>
                                    {plansMeta.map(plan => (
                                        <TableHead key={plan.name} className={cn("text-center min-w-[150px]", plan.variant === 'default' && "bg-primary/5")}>
                                            <div className="flex flex-col items-center">
                                                {plan.name}
                                                {plan.badge && <Badge variant={'default'} className="mt-1">{plan.badge}</Badge>}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brandFeaturesData.map((row) => (
                                    <TableRow key={row.feature}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-1.5">
                                            {row.feature}
                                            {row.tooltip && (
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger>
                                                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs text-left p-3" side="top">
                                                        <p className="font-bold text-foreground">Что это?</p>
                                                        <p className="font-normal text-muted-foreground mb-2 whitespace-pre-wrap">{row.tooltip.what}</p>
                                                        <p className="font-bold text-foreground">Зачем это?</p>
                                                        <p className="font-normal text-muted-foreground whitespace-pre-wrap">{row.tooltip.why}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{row.basic}</TableCell>
                                        <TableCell className={cn("text-center font-semibold", plansMeta[1].variant === 'default' && "bg-primary/5")}>
                                            {row.pro || (row.proText && <span className="text-xs font-normal text-muted-foreground">{row.proText}</span>)}
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
