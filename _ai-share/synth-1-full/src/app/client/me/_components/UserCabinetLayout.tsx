'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { cn } from '@/lib/utils';

export type UserCabinetLayoutProps = {
  title: string;
  /** Подзаголовок под H1 (как `leadPlain` у `RegistryPageHeader`). */
  description?: string;
  actions?: ReactNode;
  /** Текст последней крошки (по умолчанию совпадает с прежним UI). */
  breadcrumbCurrentLabel?: string;
  /** Скрыть крошки (редко нужно; например встроенный вид). */
  hideBreadcrumb?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Оболочка страницы `/client/me`: та же сетка, что у операционных реестров (`RegistryPageShell`),
 * плюс крошки и шапка в одном месте — без дублирования разметки в `page.tsx`.
 */
export function UserCabinetLayout({
  title,
  description,
  actions,
  breadcrumbCurrentLabel = 'Профиль',
  hideBreadcrumb = false,
  className,
  children,
}: UserCabinetLayoutProps) {
  return (
    <RegistryPageShell className={cn('max-w-5xl space-y-4 py-4', className)}>
      <RegistryPageHeader
        title={title}
        leadPlain={description}
        actions={actions}
        eyebrow={
          hideBreadcrumb ? undefined : (
            <nav
              aria-label="Breadcrumb"
              className="text-text-muted flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
            >
              <Link href="/" className="hover:text-accent-primary transition-colors">
                Аккаунт
              </Link>
              <ChevronRight className="h-2.5 w-2.5 shrink-0 opacity-70" aria-hidden />
              <span className="text-accent-primary">{breadcrumbCurrentLabel}</span>
            </nav>
          )
        }
      />
      {children}
    </RegistryPageShell>
  );
}
