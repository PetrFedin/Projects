'use client';

/**
 * Блок «Связанные разделы» — перекрёстные ссылки на другие модули.
 * Используется на страницах заказов, задач, партнёров, Production и т.д.
 */
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import type { EntityLink } from '@/lib/data/entity-links';

interface RelatedModulesBlockProps {
  title?: string;
  links: EntityLink[];
  className?: string;
}

export function RelatedModulesBlock(_props: RelatedModulesBlockProps) {
  return null;
}
