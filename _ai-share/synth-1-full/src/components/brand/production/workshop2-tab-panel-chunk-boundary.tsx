'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  children: ReactNode;
  tabLabelRu: string;
};

type State = {
  chunkError: boolean;
};

function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const name = error instanceof Error ? error.name : '';
  const msg = error instanceof Error ? error.message : String(error);
  const combined = `${name} ${msg}`.toLowerCase();
  return (
    combined.includes('chunkload') ||
    combined.includes('loading chunk') ||
    combined.includes('failed to fetch dynamically imported module') ||
    combined.includes('cannot find module') ||
    combined.includes('module_not_found')
  );
}

/**
 * Wave N #14 — guard на plan/release: HMR stale chunk → понятный retry вместо белого экрана.
 */
export class Workshop2TabPanelChunkBoundary extends Component<Props, State> {
  state: State = { chunkError: false };

  static getDerivedStateFromError(error: unknown): State | null {
    return isChunkLoadError(error) ? { chunkError: true } : null;
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (!isChunkLoadError(error)) throw error;
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        '[workshop2] tab chunk load error',
        this.props.tabLabelRu,
        error.message,
        info.componentStack
      );
    }
  }

  private handleRetry = (): void => {
    if (typeof window === 'undefined') return;
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.chunkError) return this.props.children;
    return (
      <div
        className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm"
        role="alert"
      >
        <p className="font-medium text-amber-900 dark:text-amber-100">
          Вкладка «{this.props.tabLabelRu}» не загрузилась (ChunkLoadError)
        </p>
        <p className="text-muted-foreground">
          В dev после HMR или stale `.next` иногда устаревает JS-chunk (ChunkLoadError /
          MODULE_NOT_FOUND). Обновите страницу (Cmd+Shift+R), выполните `rm -rf .next` или нажмите
          «Перезагрузить».
        </p>
        <Button type="button" size="sm" variant="outline" onClick={this.handleRetry}>
          Перезагрузить
        </Button>
      </div>
    );
  }
}

/** Prefetch тяжёлого чанка ТЗ (Phase1 dossier) до клика на вкладку. */
export function prefetchWorkshop2DossierPanel(): void {
  if (typeof window === 'undefined') return;
  void import('@/components/brand/production/Workshop2Phase1DossierPanel').catch(() => undefined);
}

/** Prefetch тяжёлых чанков plan/release/tz до клика (Wave N #14). */
export function prefetchWorkshop2ArticleTabChunks(tab: 'plan' | 'release' | 'tz'): void {
  if (tab === 'tz') {
    prefetchWorkshop2DossierPanel();
    return;
  }
  if (typeof window === 'undefined') return;
  const loaders: Record<'plan' | 'release', Array<() => Promise<unknown>>> = {
    plan: [
      () => import('@/components/brand/production/workshop2-article-workspace-plan-po-panel'),
      () => import('@/components/brand/production/workshop2-article-workspace-nesting-panel'),
    ],
    release: [
      () => import('@/components/brand/production/workshop2-article-workspace-release-panel'),
      () => import('@/components/brand/production/Workshop2LogisticsPanel'),
      () => import('@/components/brand/production/Workshop2FactoryERPIntegrationPanel'),
    ],
  };
  for (const load of loaders[tab]) {
    void load().catch(() => undefined);
  }
}
