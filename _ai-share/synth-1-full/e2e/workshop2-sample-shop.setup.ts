/**
 * Прогрев Workshop2 sample-shop: только HTTP (SSR compile).
 * Browser hydration — в flow spec (setup не блокирует gate при flaky warm).
 */
import { test as setup } from '@playwright/test';
import { warmWorkshop2ArticleRoutesHttp } from './helpers/w2-warmup';

setup('warm sample-shop article routes (HTTP)', async ({ request }) => {
  setup.setTimeout(900_000);
  await warmWorkshop2ArticleRoutesHttp(request, [
    { w2pane: 'fit' },
    { w2pane: 'release', w2relsub: 'order' },
  ]);
});
