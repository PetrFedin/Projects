#!/usr/bin/env node
/**
 * Wave 57: optional Playwright invoice PDF — HTML default unchanged.
 * Set WORKSHOP2_INVOICE_PDF_ENGINE=playwright to generate PDF via headless Chromium.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const engine = String(process.env.WORKSHOP2_INVOICE_PDF_ENGINE ?? 'html').trim().toLowerCase();
const orderId = String(process.argv[2] ?? 'B2B-SS27-001').trim();
const outDir = path.join(root, '.planning/invoice-pdf');
const outPdf = path.join(outDir, `workshop2-invoice-${orderId}.pdf`);

console.log('[workshop2-invoice-pdf-playwright] engine=', engine, 'orderId=', orderId);

if (engine !== 'playwright') {
  console.log(
    '[workshop2-invoice-pdf-playwright] HTML default — используйте GET /api/shop/b2b/orders/invoice-stub или invoiceHtmlUrl.'
  );
  console.log(
    '[workshop2-invoice-pdf-playwright] Для PDF: WORKSHOP2_INVOICE_PDF_ENGINE=playwright node scripts/workshop2-invoice-pdf-playwright.mjs [orderId]'
  );
  process.exit(0);
}

async function runPlaywright() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error(
      '[workshop2-invoice-pdf-playwright] playwright не установлен — оставьте WORKSHOP2_INVOICE_PDF_ENGINE=html (default).'
    );
    process.exit(2);
  }

  const base =
    String(process.env.WORKSHOP2_STAGING_PUBLIC_URL ?? process.env.WORKSHOP2_INVOICE_HTML_BASE_URL ?? '')
      .trim() || 'http://127.0.0.1:3123';
  const htmlUrl = `${base.replace(/\/$/, '')}/api/shop/b2b/orders/invoice-stub?orderId=${encodeURIComponent(orderId)}`;

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(htmlUrl, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.pdf({ path: outPdf, format: 'A4', printBackground: true });
  await browser.close();
  console.log('[workshop2-invoice-pdf-playwright] wrote', outPdf);
}

runPlaywright().catch((err) => {
  console.error('[workshop2-invoice-pdf-playwright] failed', err);
  process.exit(1);
});
