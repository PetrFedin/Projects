/**
 * Wave 55: HTML printable invoice stub RU — journal_only, без fake PDF binary.
 */
import { readWorkshop2B2bInvoiceStubJournal } from '@/lib/production/workshop2-b2b-invoice-stub';

export function buildWorkshop2B2bInvoiceHtmlStub(orderId: string): string {
  const id = orderId.trim();
  const journal = readWorkshop2B2bInvoiceStubJournal().find((e) => e.orderId === id);
  const totalRub = journal?.totalRub ?? 0;
  const brandId = journal?.brandId ?? 'demo-brand';
  const tenantId = journal?.tenantId ?? 'tenant-demo';
  const issuedAt = journal?.at ?? new Date().toISOString();
  const formattedTotal = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(totalRub);

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Счёт ${id} — Workshop2 B2B (stub)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; color: #111; }
    h1 { font-size: 1.25rem; margin-bottom: 0.25rem; }
    .muted { color: #666; font-size: 0.875rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    .banner { background: #fef3c7; border: 1px solid #f59e0b; padding: 0.75rem; margin-bottom: 1rem; border-radius: 4px; }
    @media print { .no-print { display: none; } body { margin: 0; } }
  </style>
</head>
<body>
  <div class="banner no-print">
    <strong>journal_only stub</strong> — не юридический счёт-фактура.
    <br />Печать в PDF: меню браузера → «Печать» / Ctrl+P / ⌘P → «Сохранить как PDF».
  </div>
  <h1>Счёт на оплату (stub)</h1>
  <p class="muted">Заказ ${id} · ${brandId} · tenant ${tenantId}</p>
  <p>Дата: ${issuedAt.slice(0, 10)}</p>
  <table>
    <thead><tr><th>Позиция</th><th>Сумма</th></tr></thead>
    <tbody>
      <tr><td>B2B wholesale order ${id}</td><td>${formattedTotal}</td></tr>
    </tbody>
    <tfoot><tr><th>Итого</th><th>${formattedTotal}</th></tr></tfoot>
  </table>
  <p class="muted" style="margin-top:2rem">Workshop2 Wave 56 — HTML → печать в PDF. Playwright PDF: WORKSHOP2_INVOICE_PDF_ENGINE=playwright</p>
</body>
</html>`;
}
