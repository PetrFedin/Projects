'use client';

<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Status = 'В реализации' | 'Запланировано';

const statusConfig: Record<Status, { icon: LucideIcon; color: string }> = {
  'В реализации': { icon: CheckCircle, color: 'text-green-600' },
  Запланировано: { icon: Clock, color: 'text-amber-600' },
};

interface ElementDetail {
  name: string;
  status: Status;
  description: string;
  comment?: string;
}
interface ComponentDetail {
  name: string;
  status: Status;
  description: string;
  comment?: string;
  elements?: ElementDetail[];
}

interface Feature {
  name: string;
  status: Status;
  description: string;
  comment?: string;
  components?: ComponentDetail[];
}

interface FlatRow {
  functionName: string;
  componentName?: string;
  elementName?: string;
  status: Status;
  description: string;
  comment?: string;
}

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  if (!config) {
    return <Badge variant="secondary">Неизвестно</Badge>;
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex w-fit items-center gap-1.5 text-xs font-normal',
        config.color,
        `border-current/30`
      )}
    >
      <config.icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

export default function ProjectStatusPage() {
  const [featureRegistry, setFeatureRegistry] = useState<Record<string, Feature[]> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/feature-registry.json');
        const data = await response.json();
        setFeatureRegistry(data);
      } catch (error) {
        console.error('Failed to fetch feature registry:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (!featureRegistry)
      return {
        featureCount: 0,
        componentCount: 0,
        elementCount: 0,
        inProgressCount: 0,
        plannedCount: 0,
      };
    let featureCount = 0;
    let componentCount = 0;
    let elementCount = 0;
    let inProgressCount = 0;
    let plannedCount = 0;

    Object.values(featureRegistry).forEach((features) => {
      features.forEach((feature) => {
        featureCount++;
        if (feature.status === 'В реализации') inProgressCount++;
        if (feature.status === 'Запланировано') plannedCount++;

        if (feature.components) {
          feature.components.forEach((component) => {
            componentCount++;
            if (component.status === 'В реализации') inProgressCount++;
            if (component.status === 'Запланировано') plannedCount++;

            if (component.elements) {
              component.elements.forEach((element) => {
                elementCount++;
                if (element.status === 'В реализации') inProgressCount++;
                if (element.status === 'Запланировано') plannedCount++;
              });
            }
          });
        }
      });
    });
    return { featureCount, componentCount, elementCount, inProgressCount, plannedCount };
  }, [featureRegistry]);

  const flattenedData = useMemo(() => {
    if (!featureRegistry) return [];
    const flatList: FlatRow[] = [];
    Object.entries(featureRegistry).forEach(([sectionTitle, features]) => {
      flatList.push({
        functionName: sectionTitle,
        status: 'В реализации', // Section titles don't have a real status
        description: '',
        comment: '',
      });
      features.forEach((feature) => {
        if (!feature.components) {
          flatList.push({
            functionName: feature.name,
            status: feature.status,
            description: feature.description,
            comment: feature.comment,
          });
        } else {
          feature.components.forEach((component, compIndex) => {
            if (!component.elements) {
              flatList.push({
                functionName: compIndex === 0 ? feature.name : '',
                componentName: component.name,
                status: component.status,
                description: component.description,
                comment: component.comment,
              });
            } else {
              component.elements.forEach((element, elemIndex) => {
                flatList.push({
                  functionName: compIndex === 0 && elemIndex === 0 ? feature.name : '',
                  componentName: elemIndex === 0 ? component.name : '',
                  elementName: element.name,
                  status: element.status,
                  description: element.description,
                  comment: element.comment,
                });
              });
            }
          });
        }
      });
    });
    return flatList;
  }, [featureRegistry]);

  if (isLoading) {
    return (
<<<<<<< HEAD
      <div className="container mx-auto space-y-6 px-4 py-12">
=======
      <RegistryPageShell className="max-w-6xl space-y-6 py-12">
>>>>>>> recover/cabinet-wip-from-stash
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-full max-w-lg" />
          </div>
          <Skeleton className="h-48 w-full md:w-80" />
        </header>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {[...Array(15)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD
      </div>
=======
      </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
    );
  }

  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-6 px-4 py-12">
=======
    <RegistryPageShell className="max-w-6xl space-y-6 py-12">
>>>>>>> recover/cabinet-wip-from-stash
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div className="flex-1">
          <h1 className="font-headline text-sm font-bold md:text-sm">Реестр проекта</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Обзор реализованного и запланированного функционала платформы Syntha.
          </p>
        </div>
        <Card className="w-full md:w-auto md:min-w-[320px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Статистика</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-semibold">Функции:</div>
            <div className="text-right">{stats.featureCount}</div>
            <div className="font-semibold">Компоненты:</div>
            <div className="text-right">{stats.componentCount}</div>
            <div className="font-semibold">Элементы:</div>
            <div className="text-right">{stats.elementCount}</div>
            <div className="font-semibold text-green-600">В реализации:</div>
            <div className="text-right font-semibold text-green-600">{stats.inProgressCount}</div>
            <div className="font-semibold text-amber-600">Запланировано:</div>
            <div className="text-right font-semibold text-amber-600">{stats.plannedCount}</div>
          </CardContent>
        </Card>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%]">Функция</TableHead>
                  <TableHead className="w-[18%]">Компонент</TableHead>
                  <TableHead className="w-[18%]">Элемент</TableHead>
                  <TableHead className="w-[10%]">Статус</TableHead>
                  <TableHead className="w-[20%]">Описание</TableHead>
                  <TableHead className="w-[16%]">Комментарий</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flattenedData.map((row, index) => {
                  const isSectionTitle =
                    !row.componentName && !row.elementName && !row.description && !row.comment;

                  const isFirstOfFunc =
                    index === 0 ||
                    (flattenedData[index - 1].functionName !== row.functionName &&
                      row.functionName !== '');
                  const isFirstOfComp =
                    index === 0 ||
                    (flattenedData[index - 1].componentName !== row.componentName &&
                      row.componentName !== '');

                  if (isSectionTitle) {
                    return (
                      <TableRow key={index} className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={6} className="text-base font-bold text-foreground">
                          {row.functionName}
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return (
                    <TableRow key={index}>
                      <TableCell className="align-top text-sm font-medium">
                        {isFirstOfFunc ? row.functionName : ''}
                      </TableCell>
                      <TableCell className="align-top text-sm">
                        {isFirstOfComp ? row.componentName : ''}
                      </TableCell>
                      <TableCell className="align-top text-sm">{row.elementName}</TableCell>
                      <TableCell className="align-top">
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="align-top text-xs text-muted-foreground">
                        {row.description}
                      </TableCell>
                      <TableCell className="align-top text-xs italic text-muted-foreground">
                        {row.comment}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </RegistryPageShell>
  );
}
