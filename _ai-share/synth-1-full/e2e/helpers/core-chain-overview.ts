import { expect, type APIRequestContext, type Locator, type Page, type Response } from '@playwright/test';

/** chain-overview на cold PG может занимать >60s на hub. */
export const CHAIN_OVERVIEW_TIMEOUT_MS = 120_000;

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

export function waitForChainOverview(
  page: Page,
  options?: { collectionId?: string }
): Promise<Response> {
  const collectionId = options?.collectionId;
  return page.waitForResponse(
    (r) => {
      if (!r.url().includes('/platform-core/chain-overview')) return false;
      if (!r.ok()) return false;
      if (collectionId) return r.url().includes(`collectionId=${collectionId}`);
      return true;
    },
    { timeout: CHAIN_OVERVIEW_TIMEOUT_MS }
  );
}

/** Hub goto с retry при transient 500 и ожиданием chain-overview. */
export async function gotoPlatformHub(
  page: Page,
  path = '/platform',
  options?: { collectionId?: string; query?: Record<string, string> }
): Promise<Response | null> {
  const params = new URLSearchParams(options?.query);
  if (options?.collectionId) params.set('collection', options.collectionId);
  const qs = params.toString();
  const url = qs ? `${path}?${qs}` : path;

  const chainOverview = waitForChainOverview(page, {
    collectionId: options?.collectionId,
  });

  let res: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    res = await page.goto(url, GOTO);
    if ((res?.status() ?? 599) < 500) break;
    await page.waitForTimeout(750);
  }
  await chainOverview;
  return res;
}

/** Hub по умолчанию в режиме «Продукт» — матрица только в «Оценка». */
export async function openPlatformHubAuditView(page: Page): Promise<void> {
  const matrix = page.getByTestId('platform-core-readiness-matrix');
  if (await matrix.isVisible().catch(() => false)) return;
  const auditBtn = page.getByTestId('platform-core-hub-view-audit');
  await expect(auditBtn).toBeVisible({ timeout: 60_000 });
  await auditBtn.click();
  await expect(matrix).toBeVisible({ timeout: 60_000 });
}

/** Hub + chain-overview + режим оценки (матрица готовности). */
export async function gotoPlatformHubAudit(
  page: Page,
  path = '/platform',
  options?: { collectionId?: string; query?: Record<string, string> }
): Promise<Response | null> {
  const res = await gotoPlatformHub(page, path, options);
  await openPlatformHubAuditView(page);
  return res;
}

/** Быстрый goto /platform* без ожидания chain-overview (повторные визиты в одном тесте). */
export async function gotoPlatformPageAudit(
  page: Page,
  path = '/platform'
): Promise<Response | null> {
  const res = await page.goto(path, GOTO);
  await openPlatformHubAuditView(page);
  return res;
}

/** Workspace / W2: без chain-overview, commit + длинный timeout на cold compile. */
export async function gotoPlatformCoreWorkspace(
  page: Page,
  url: string
): Promise<Response | null> {
  return page.goto(url, { waitUntil: 'commit', timeout: 180_000 });
}

/** Кабинет роли: chain-overview + retry на transient 500. */
export async function gotoRoleCoreCabinet(
  page: Page,
  url: string
): Promise<Response | null> {
  let collectionId: string | undefined;
  let pathname = url;
  try {
    const parsed = new URL(url, 'http://127.0.0.1:3001');
    collectionId = parsed.searchParams.get('collection')?.trim() || undefined;
    pathname = parsed.pathname;
  } catch {
    collectionId = undefined;
  }
  const needsChainOverview = /\/core$/.test(pathname.replace(/\/$/, ''));
  const chainOverview = needsChainOverview
    ? waitForChainOverview(page, { collectionId })
    : null;
  let res: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await page.goto(url, GOTO);
    if ((res?.status() ?? 599) < 500) break;
    await page.waitForTimeout(750);
  }
  if (chainOverview) {
    // chain-overview может не refetch при смене pillar на том же кабинете — не блокируем 120s.
    await Promise.race([chainOverview, page.waitForTimeout(20_000)]).catch(() => undefined);
  }
  return res;
}

const TAILWIND_LG_PX = 1024;
const TAILWIND_MD_PX = 768;

/** Видимый контейнер навигации столпов кабинета (horizontal < md, aside ≥ md). */
export function cabinetPillarNavLocator(
  page: Page,
  scope: Page | Locator = page
): Locator {
  const width = page.viewportSize()?.width ?? TAILWIND_LG_PX;
  if (width < TAILWIND_MD_PX) {
    return scope.getByTestId('role-core-pillar-nav-horizontal');
  }
  return scope.getByTestId('role-core-pillar-nav');
}

export function cabinetPillarButton(
  page: Page,
  pillarId: string,
  scope: Page | Locator = page
): Locator {
  return cabinetPillarNavLocator(page, scope).getByTestId(`role-pillar-${pillarId}`);
}

export async function clickCabinetPillar(
  page: Page,
  pillarId: string,
  scope: Page | Locator = page
): Promise<void> {
  await cabinetPillarButton(page, pillarId, scope).click();
}

/** В core mode strip столпов убран — навигация через context bar «← Кабинет». */
export async function expectWorkspacePillarStrip(
  page: Page,
  scope: Page | ReturnType<Page['getByTestId']> = page
): Promise<void> {
  await expect(scope.getByTestId('platform-core-role-pillar-strip')).toHaveCount(0);
}

/** Кабинет: horizontal pills < md, aside ≥ md. */
export async function expectCabinetPillarNav(
  page: Page,
  scope: Page | Locator = page
): Promise<void> {
  const url = page.url();
  const hasPillarInUrl = /[?&]pillar=/.test(url);
  const horizontal = scope.getByTestId('role-core-pillar-nav-horizontal');
  const aside = scope.getByTestId('role-core-pillar-nav');
  await expect(aside).toBeHidden();
  if (hasPillarInUrl) {
    await expect(horizontal).toHaveCount(0);
  } else {
    await expect(horizontal).toBeVisible();
  }
}

/** iPhone: context-bar + (picker или CTA+insight) — в первом экране. */
export async function expectCabinetAboveFold(page: Page): Promise<void> {
  const hasPillarInUrl = /[?&]pillar=/.test(page.url());
  const aboveFold = await page.evaluate((hasPillar) => {
    const ids = ['platform-core-context-bar'];
    if (hasPillar) ids.push('role-pillar-primary-cta');
    else ids.push('role-core-pillar-nav-horizontal');
    const vh = window.innerHeight;
    for (const id of ids) {
      const el = document.querySelector(`[data-testid="${id}"]`);
      if (!el) return { ok: false, reason: `missing ${id}` };
      const { bottom } = el.getBoundingClientRect();
      if (bottom > vh + 4) return { ok: false, reason: `${id} bottom ${bottom} > ${vh}` };
    }
    if (hasPillar) {
      const insight = document.querySelector('[data-testid^="role-pillar-insight-"]');
      if (!insight) return { ok: false, reason: 'missing role-pillar-insight-*' };
      const insightTop = insight.getBoundingClientRect().top;
      if (insightTop > vh + 4) {
        return { ok: false, reason: `insight top ${insightTop} > ${vh}` };
      }
    }
    return { ok: true };
  }, hasPillarInUrl);
  expect(aboveFold.ok, aboveFold.reason).toBe(true);
}

/** md+: aside и panel в одной строке. */
export async function expectCabinetAsidePanelLayout(page: Page): Promise<void> {
  const url = page.url();
  const hasPillarInUrl = /[?&]pillar=/.test(url);
  if (!hasPillarInUrl) {
    await expect(page.getByTestId('role-core-pillar-nav-horizontal')).toBeVisible();
    await expect(page.getByTestId('role-core-pillar-panel')).toHaveCount(0);
    return;
  }
  await expect(page.getByTestId('role-core-pillar-nav-horizontal')).toHaveCount(0);
  await expect(page.getByTestId('role-core-pillar-panel')).toBeVisible();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Клик cabinet CTA и ожидание pathname (+ hash/order из href — live demoOrderId). */
export async function clickCabinetPrimaryCta(
  page: Page,
  options?: { timeout?: number }
): Promise<void> {
  const timeout = options?.timeout ?? 60_000;
  const cta = page.getByTestId('role-pillar-primary-cta');
  await expect(cta).toBeVisible({ timeout: 30_000 });
  const href = await cta.getAttribute('href');
  expect(href, 'role-pillar-primary-cta href').toBeTruthy();
  const url = new URL(href!, 'http://localhost:3001');
  await cta.click();
  await expect(page).toHaveURL(new RegExp(escapeRegExp(url.pathname)), { timeout });
  if (url.hash.length > 1) {
    await expect(page).toHaveURL(new RegExp(`#${escapeRegExp(url.hash.slice(1))}`), {
      timeout: 10_000,
    });
  }
  const orderFromPath = url.pathname.match(/\/b2b-orders\/([^/?#]+)/)?.[1];
  const order = orderFromPath ?? url.searchParams.get('order') ?? url.searchParams.get('orderId');
  if (order) {
    await expect(page).toHaveURL(new RegExp(escapeRegExp(order)), { timeout: 10_000 });
  }
}

/** Активный wholesale из chain-overview (w2_registry → PG checkout или demo pin). */
export async function fetchPlatformCoreActiveOrderId(
  request: APIRequestContext,
  collectionId = 'SS27'
): Promise<string> {
  const res = await request.get(
    `http://127.0.0.1:3001/api/workshop2/platform-core/chain-overview?collectionId=${encodeURIComponent(collectionId)}`
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { overview?: { demoOrderId?: string } };
  const id = json.overview?.demoOrderId?.trim() ?? '';
  expect(id.length).toBeGreaterThan(0);
  return id;
}

/** Клик по оценке — раскрыть inline-разделы (desktop) или sheet (mobile). */
export async function clickReadinessScoreExpand(
  page: Page,
  roleId: string,
  pillarId: string
): Promise<void> {
  await page.getByTestId(`readiness-score-${roleId}-${pillarId}`).click();
}

/** Раскрыть ячейку матрицы и перейти в рабочий столп. */
export async function openReadinessWorkspaceFromScore(
  page: Page,
  roleId: string,
  pillarId: string
): Promise<void> {
  await clickReadinessScoreExpand(page, roleId, pillarId);
  const workspace = page.getByTestId(`readiness-workspace-${roleId}-${pillarId}`);
  await expect(workspace).toBeVisible({ timeout: 15_000 });
  await workspace.click();
}
