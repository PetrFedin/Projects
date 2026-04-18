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
import { Lightbulb, Bot, Code, Database, Share2, ToyBrick } from 'lucide-react';

interface DigitalFashionLabDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function DigitalFashionLabDialog({ isOpen, onOpenChange }: DigitalFashionLabDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Digital Fashion Laboratory</DialogTitle>
          <DialogDescription>
            Пространство создания. Для брендов, дизайнеров, продюсеров коллекций и креаторов.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Syntha — это цифровой модный лабораториум, где рождается продукт будущего: от идеи и
                эскиза до интерактивной digital-версии коллекции. Здесь творческий процесс соединён
                с аналитикой, симуляцией и коммерцией в едином потоке данных.
              </p>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ToyBrick />
                    1. 3D-конструктор
                  </CardTitle>
                  <ShadcnCardDescription>
                    Цифровое пространство для создания и визуализации моделей одежды в реальном
                    времени.
                  </ShadcnCardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Syntha даёт дизайнерам возможность собирать коллекции напрямую в браузере —
                    быстро, интерактивно и с высокой визуальной достоверностью.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>3D-моделирование:</strong> создание и редактирование форм, силуэтов и
                      деталей модели.
                    </li>
                    <li>
                      <strong>Физика ткани:</strong> реалистичная симуляция поведения материала —
                      драпировка, растяжение, движение.
                    </li>
                    <li>
                      <strong>Мультиаватары:</strong> параметрические фигуры с настройкой роста,
                      пропорций и поз.
                    </li>
                    <li>
                      <strong>Библиотека материалов:</strong> визуальные пресеты тканей с
                      характеристиками блеска, плотности и текстуры.
                    </li>
                    <li>
                      <strong>Сцены и освещение:</strong> готовые студийные и outdoor-пресеты для
                      визуализации под кампании и лукбуки.
                    </li>
                    <li>
                      <strong>Экспорт:</strong> форматы GLB/GLTF для AR-примерок, e-commerce и
                      3D-витрин.
                    </li>
                    <li>
                      <strong>Интеграции:</strong> отправка моделей в Blender, Daz, Figma.
                    </li>
                    <li>
                      <strong>AI-помощник:</strong> анализирует пропорции, рекомендует улучшения по
                      посадке и стилистике.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: дизайнер получает фотореалистичный цифровой прототип, готовый к
                    digital-показу, AI-рендеру и AR-витрине.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Bot />
                    2. AI-рендеры образов, кампаний и лукбуков
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    AI-модуль визуализирует коллекции в формате готовых fashion-съёмок, кампаний и
                    digital-луков.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Стилевое ДНК бренда:</strong> нейросеть обучена на архивах бренда и
                      умеет создавать визуалы в фирменной эстетике.
                    </li>
                    <li>
                      <strong>Геомаркетинг:</strong> адаптация визуалов под локальные рынки (EMEA,
                      GCC, APAC и др.).
                    </li>
                    <li>
                      <strong>AI-сценография:</strong> автоматическая постановка света, композиции и
                      эмоции кадра.
                    </li>
                    <li>
                      <strong>Быстрота:</strong> от концепта до готовой кампании — за часы, без
                      съёмок и логистики.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: бренд получает полноценные креативные материалы — визуалы, баннеры,
                    лукбуки — без студий и продакшна.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Share2 />
                    3. Digital-lookbooks и AR-модели
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Syntha автоматически создаёт динамические 3D-lookbooks и AR-модели для
                    онлайн-витрин, шоурумов и метаверсов.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>3D-lookbooks:</strong> интерактивные каталоги, где одежда вращается и
                      раскрывает детали пошива.
                    </li>
                    <li>
                      <strong>AR-модели:</strong> возможность примерки в дополненной реальности
                      прямо из браузера или смартфона.
                    </li>
                    <li>
                      <strong>Интеграция:</strong> подключение к e-commerce-платформам,
                      маркетплейсам и виртуальным шоурумам.
                    </li>
                    <li>
                      <strong>NFT и Metaverse-ready:</strong> поддержка экспорта ассетов для
                      метаверс-коллекций и digital drops.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: байеры и клиенты видят коллекцию «живой» — с текстурой, движением и
                    светом, как на реальном показе.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    4. Совместное создание капсул и коллабораций
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>Syntha превращает коллаборации в управляемый цифровой процесс.</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Co-create-панель:</strong> дизайнеры и бренды работают над одной
                      капсулой синхронно, в облачной среде.
                    </li>
                    <li>
                      <strong>AI-контроль стиля:</strong> система отслеживает визуальную целостность
                      и предлагает гармоничные решения.
                    </li>
                    <li>
                      <strong>История версий:</strong> все изменения, 3D-модели и комментарии
                      сохраняются и синхронизируются в реальном времени.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: кросс-брендовые коллекции создаются быстрее, визуально согласованнее
                    и без ограничений по локации.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Database />
                    5. Библиотека текстур, паттернов и материалов
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    База цифровых материалов с визуальными и физическими характеристиками,
                    оптимизированная для 3D-визуализации.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>Физически корректные шейдеры:</strong> имитация ткани (шелк, хлопок,
                      кожа, технические мембраны).
                    </li>
                    <li>
                      <strong>AI-классификация:</strong> сортировка по типам волокон, визуальным
                      свойствам, брендам и устойчивости.
                    </li>
                    <li>
                      <strong>Приватные библиотеки:</strong> бренды могут хранить собственные
                      материалы и текстуры с ограниченным доступом.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: дизайнеры работают с «живыми» материалами, не теряя ощущение фактуры
                    даже в цифровом пространстве.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Code />
                    6. Интеграции и инструменты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>Syntha — центральный узел, объединяющий креативный стек индустрии.</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      <strong>CLO3D / Blender / Daz / Figma:</strong> поддержка импорта и экспорта
                      ассетов.
                    </li>
                    <li>
                      <strong>Midjourney / Genkit:</strong> генерация moodboards и AI-концептов
                      прямо в интерфейсе Syntha.
                    </li>
                    <li>
                      <strong>API-интеграции:</strong> подключение к системам брендов, хранилищам
                      ассетов и маркетплейсам.
                    </li>
                  </ul>
                  <p className="flex items-start gap-2 pt-2 font-semibold text-foreground">
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
                    Результат: привычные инструменты остаются, но работают синхронно, как единая
                    экосистема дизайна.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>Ценность для индустрии</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>
                      Ускорение time-to-market: от идеи до digital-презентации — за 2–3 недели.
                    </li>
                    <li>
                      Тестирование до производства: сбор фидбека от байеров и аудитории до запуска
                      линии.
                    </li>
                    <li>
                      Метаверс-версии коллекций: каждая вещь существует в физическом и цифровом
                      измерении одновременно (AR-примерки, NFT, digital drops).
                    </li>
                    <li>
                      Устойчивость и прозрачность: меньше образцов, меньше отходов, больше данных
                      для точного планирования.
                    </li>
                  </ul>
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
