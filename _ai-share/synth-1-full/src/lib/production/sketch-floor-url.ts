/** Query-параметр для режима «цех»: просмотр и экспорт без правок меток. */
export const SKETCH_FLOOR_QUERY_PARAM = 'sketchFloor';

export function isSketchFloorInSearch(search: string): boolean {
  try {
    return new URLSearchParams(search).get(SKETCH_FLOOR_QUERY_PARAM) === '1';
  } catch {
    return false;
  }
}

/** Обновляет URL без перезагрузки (удобно делиться ссылкой с цехом). */
export function replaceSketchFloorInUrl(floor: boolean): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (floor) url.searchParams.set(SKETCH_FLOOR_QUERY_PARAM, '1');
  else url.searchParams.delete(SKETCH_FLOOR_QUERY_PARAM);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', next);
}
