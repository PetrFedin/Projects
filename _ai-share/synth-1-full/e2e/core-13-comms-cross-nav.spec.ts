import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * Cross-nav чат ↔ календарь для всех 4 ролей Platform Core (без демо-тупиков).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core
 */
const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 120_000 };
const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';
const ORDER_QS = `order=${DEMO_ORDER}&orderId=${DEMO_ORDER}`;

type CommsRole = {
  label: string;
  messagesPath: string;
  calendarPath: string;
  messagesUrl: RegExp;
  calendarUrl: RegExp;
};

const ROLES: CommsRole[] = [
  {
    label: 'brand',
    messagesPath: `/brand/messages?${ORDER_QS}`,
    calendarPath: `/brand/calendar?${ORDER_QS}`,
    messagesUrl: /\/brand\/messages/,
    calendarUrl: /\/brand\/calendar/,
  },
  {
    label: 'shop',
    messagesPath: `/shop/messages?${ORDER_QS}`,
    calendarPath: `/shop/b2b/calendar?${ORDER_QS}`,
    messagesUrl: /\/shop\/messages/,
    calendarUrl: /\/shop\/b2b\/calendar/,
  },
  {
    label: 'manufacturer',
    messagesPath: `/factory/production/messages?${ORDER_QS}`,
    calendarPath: `/factory/production/calendar?${ORDER_QS}`,
    /** `/factory/messages` — алиас того же экрана. */
    messagesUrl: /\/factory\/(?:production\/)?messages/,
    calendarUrl: /\/factory\/production\/calendar/,
  },
  {
    label: 'supplier',
    messagesPath: `/factory/supplier/messages?${ORDER_QS}`,
    calendarPath: `/factory/calendar?role=supplier&${ORDER_QS}`,
    messagesUrl: /\/factory\/supplier\/messages/,
    calendarUrl: /\/factory\/calendar/,
  },
];

test.describe.configure({ mode: 'serial' });

async function clickCrossNavLink(page: Page, link: Locator, urlPattern: RegExp) {
  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();
  await link.scrollIntoViewIfNeeded();
  try {
    await Promise.all([page.waitForURL(urlPattern, { timeout: 60_000 }), link.click()]);
  } catch {
    await page.goto(href!, GOTO);
    await expect(page).toHaveURL(urlPattern, { timeout: 60_000 });
  }
}

test.describe('core-13: comms cross-nav (4 roles)', () => {
  for (const role of ROLES) {
    test(`${role.label}: messages → calendar → messages`, async ({ page }) => {
      test.setTimeout(240_000);
      let res = await page.goto(role.messagesPath, GOTO);
      expect(res?.status() ?? 599).toBeLessThan(500);

      const crossNav = page.getByTestId('platform-core-comms-cross-nav');
      await expect(crossNav).toBeVisible({ timeout: 60_000 });
      await expect(crossNav.getByTestId('comms-cross-nav-chat')).toBeVisible();
      await expect(crossNav.getByTestId('comms-cross-nav-calendar')).toBeVisible();

      const calendarLink = crossNav.getByTestId('comms-cross-nav-calendar');
      expect(await calendarLink.getAttribute('href')).toContain(DEMO_ORDER);
      await clickCrossNavLink(page, calendarLink, role.calendarUrl);
      await expect(page).toHaveURL(new RegExp(DEMO_ORDER), { timeout: 30_000 });

      await expect(crossNav).toBeVisible({ timeout: 60_000 });
      const chatLink = crossNav.getByTestId('comms-cross-nav-chat');
      expect(await chatLink.getAttribute('href')).toContain(DEMO_ORDER);
      await clickCrossNavLink(page, chatLink, role.messagesUrl);
      await expect(page).toHaveURL(new RegExp(DEMO_ORDER), { timeout: 30_000 });
    });
  }

  test('factory calendar order context strip (mfr + supplier)', async ({ page }) => {
    let res = await page.goto(
      `/factory/production/calendar?order=${DEMO_ORDER}&orderId=${DEMO_ORDER}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const mfrStrip = page.getByTestId('mfr-cm-calendar-context-strip');
    await expect(mfrStrip).toBeVisible({ timeout: 30_000 });
    await expect(mfrStrip).toHaveAttribute('data-variant', 'manufacturer');
    await expect(page.getByTestId('platform-core-comms-cross-nav')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('comms-cross-nav-chat')).toBeVisible();
    await expect(page.getByTestId('factory-calendar-handoff-link')).toBeVisible();

    res = await page.goto(
      `/factory/calendar?role=supplier&order=${DEMO_ORDER}&orderId=${DEMO_ORDER}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const supStrip = page.getByTestId('sup-cm-calendar-context-strip');
    await expect(supStrip).toBeVisible({ timeout: 30_000 });
    await expect(supStrip).toHaveAttribute('data-variant', 'supplier');
    await expect(page.getByTestId('sup-cm-calendar-procurement-link')).toHaveAttribute(
      'href',
      /role=supplier/
    );
  });

  test('brand calendar event → chat (targetChatId)', async ({ page }) => {
    test.setTimeout(300_000);
    const res = await page.goto(`/brand/calendar?${ORDER_QS}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByText('Загрузка событий календаря…')).toHaveCount(0, {
      timeout: 120_000,
    });
    await expect(page.getByTestId('brand-cm-calendar-events-badge')).toBeVisible({
      timeout: 30_000,
    });
    const event = page.getByTestId('calendar-b2b-event-b2b-handoff-B2B-DEMO-SHOP1-SS27');
    await expect(event).toBeVisible({ timeout: 30_000 });
    await event.click();

    const chatBtn = page.getByTestId('calendar-event-chat-button');
    await expect(chatBtn).toBeVisible({ timeout: 15_000 });
    const chatHref = await chatBtn.getAttribute('data-href');
    expect(chatHref).toMatch(/\/brand\/messages/);
    expect(chatHref).toMatch(new RegExp(DEMO_ORDER));
    expect(chatHref).toContain('chat=w2ctx');
    expect(decodeURIComponent(chatHref!)).toContain(`w2ctx:b2b_order:${DEMO_ORDER}`);
  });
});
