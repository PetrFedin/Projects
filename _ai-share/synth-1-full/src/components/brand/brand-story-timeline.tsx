'use client';

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineDescription,
  TimelineBody,
} from '@/components/ui/timeline';
import { Flame, Gem, Sparkles, Rocket } from 'lucide-react';

interface BrandStoryTimelineProps {
  foundedYear?: number;
}

export function BrandStoryTimeline({ foundedYear = 2023 }: BrandStoryTimelineProps) {
  const timelineEvents = [
    {
      icon: Gem,
      title: `Основание (${foundedYear})`,
      description: 'Запуск первой коллекции с фокусом на кашемир и технологичные ткани.',
    },
    {
      icon: Sparkles,
      title: `Первая коллаборация (${foundedYear + 1})`,
<<<<<<< HEAD
      description: 'Выпуск совместной капсулы с брендом A.P.C., которая стала хитом продаж.',
=======
      description: 'Выпуск совместной капсулы с Nordic Wool, которая стала хитом продаж.',
>>>>>>> recover/cabinet-wip-from-stash
    },
    {
      icon: Rocket,
      title: `Выход на международный рынок`,
      description: 'Начало продаж на платформе Farfetch и открытие шоурума в Париже.',
    },
    {
      icon: Flame,
      title: `Запуск линии "Techwear"`,
      description:
        'Инновационная коллекция с использованием мембранных тканей и футуристичного дизайна.',
    },
  ];

  return (
    <Timeline>
      {timelineEvents.map((event, index) => (
        <TimelineItem key={index}>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>
              <event.icon className="h-4 w-4" />
            </TimelineIcon>
            <TimelineTitle>{event.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineBody>
            <TimelineDescription>{event.description}</TimelineDescription>
          </TimelineBody>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
