/**
 * `Request.json()` / `NextRequest.json()` в strict TS имеют тип `Promise<unknown>`.
 * Явно задаём ожидаемую форму на границе HTTP — без этого сотни ошибок TS2345/TS2339 по репо.
 */
export async function readJsonBody<T>(req: Request): Promise<T> {
  return (await req.json()) as T;
}
