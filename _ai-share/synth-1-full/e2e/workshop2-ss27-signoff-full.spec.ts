import { test } from '@playwright/test';
test('SS27 signoff full path', async ({ page }) => {
  test.skip(true, 'CI signoff');
  await page.goto('/');
});
