/** Hub panels on one page — independent toggles (not separate routes). */

export type PlatformCoreHubViewId = 'business' | 'audit' | 'planner';

export type PlatformCoreHubViews = Record<PlatformCoreHubViewId, boolean>;

export const HUB_VIEW_IDS: PlatformCoreHubViewId[] = ['business', 'audit', 'planner'];

const STORAGE_KEY = 'platform-core-hub-views';
const LEGACY_STORAGE_KEY = 'platform-core-hub-view';

/** @deprecated use PlatformCoreHubViewId */
export type PlatformCoreHubView = PlatformCoreHubViewId;

export function defaultHubViews(): PlatformCoreHubViews {
  return { business: true, audit: false, planner: false };
}

export function toggleHubView(
  views: PlatformCoreHubViews,
  id: PlatformCoreHubViewId
): PlatformCoreHubViews {
  const next = { ...views, [id]: !views[id] };
  if (!HUB_VIEW_IDS.some((key) => next[key])) {
    return { ...next, [id]: true };
  }
  return next;
}

export function activeHubViewIds(views: PlatformCoreHubViews): PlatformCoreHubViewId[] {
  return HUB_VIEW_IDS.filter((id) => views[id]);
}

export function parseHubViewsFromUrl(searchParams: URLSearchParams): PlatformCoreHubViews | null {
  const viewsParam = searchParams.get('views');
  if (viewsParam) {
    const set = new Set(
      viewsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    return {
      business: set.has('business'),
      audit: set.has('audit'),
      planner: set.has('planner'),
    };
  }

  const single = searchParams.get('view') ?? searchParams.get('hub');
  if (single === 'business' || single === 'audit' || single === 'planner') {
    return {
      business: single === 'business',
      audit: single === 'audit',
      planner: single === 'planner',
    };
  }

  return null;
}

export function hubViewsToSearchParams(views: PlatformCoreHubViews): URLSearchParams {
  const active = activeHubViewIds(views);
  const params = new URLSearchParams();
  if (active.length === 0 || (active.length === 1 && active[0] === 'business')) {
    return params;
  }
  params.set('views', active.join(','));
  return params;
}

export function getDefaultPlatformCoreHubView(): PlatformCoreHubViewId {
  return 'business';
}

export function readPlatformCoreHubViews(): PlatformCoreHubViews {
  if (typeof window === 'undefined') return defaultHubViews();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlatformCoreHubViews>;
      return {
        business: parsed.business ?? true,
        audit: Boolean(parsed.audit),
        planner: Boolean(parsed.planner),
      };
    }
    const legacy = sessionStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === 'audit') return { business: false, audit: true, planner: false };
    if (legacy === 'planner') return { business: false, audit: false, planner: true };
    if (legacy === 'business') return defaultHubViews();
  } catch {
    /* ignore */
  }
  return defaultHubViews();
}

export function writePlatformCoreHubViews(views: PlatformCoreHubViews): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  } catch {
    /* ignore quota / private mode */
  }
}

/** @deprecated use readPlatformCoreHubViews */
export function readPlatformCoreHubView(): PlatformCoreHubViewId {
  const views = readPlatformCoreHubViews();
  if (views.planner && !views.business && !views.audit) return 'planner';
  if (views.audit && !views.business && !views.planner) return 'audit';
  return 'business';
}

/** @deprecated use writePlatformCoreHubViews */
export function writePlatformCoreHubView(view: PlatformCoreHubViewId): void {
  writePlatformCoreHubViews({
    business: view === 'business',
    audit: view === 'audit',
    planner: view === 'planner',
  });
}
