/** Единая проверка для cron-роутов метрик (архив, алерты). */
export function verifyW2MetricsCronRequest(request: Request): boolean {
  const want =
    process.env.W2_METRICS_CRON_SECRET?.trim() || process.env.CRON_SECRET?.trim() || '';
  if (!want) return false;
  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${want}`) return true;
  const q = new URL(request.url).searchParams.get('key');
  return q === want;
}
