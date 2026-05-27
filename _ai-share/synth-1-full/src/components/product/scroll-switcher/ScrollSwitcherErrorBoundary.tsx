'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/runway/runway-i18n';
import { reportRunwayScrollSwitcherError } from '@/lib/runway/runway-error-telemetry';

interface ScrollSwitcherErrorBoundaryProps {
  children: React.ReactNode;
  /** Fallback при ошибке — обычно стандартная галерея PDP. */
  fallback: React.ReactNode;
  onError?: (error: Error) => void;
  /** productSlug для телеметрии (без PII). */
  productSlug?: string;
}

interface ScrollSwitcherErrorBoundaryState {
  hasError: boolean;
}

/**
 * Изолирует сбои runway switcher — PDP остаётся рабочим в standard-режиме.
 */
export class ScrollSwitcherErrorBoundary extends React.Component<
  ScrollSwitcherErrorBoundaryProps,
  ScrollSwitcherErrorBoundaryState
> {
  state: ScrollSwitcherErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ScrollSwitcherErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
    reportRunwayScrollSwitcherError(error.name || 'ScrollSwitcherError', this.props.productSlug);
    if (process.env.NODE_ENV === 'development') {
      console.error('[ScrollSwitcherErrorBoundary]', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{t('runway.errorBoundary')}</span>
          </div>
          {this.props.fallback}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => this.setState({ hasError: false })}
          >
            {t('runway.retryRunway')}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
