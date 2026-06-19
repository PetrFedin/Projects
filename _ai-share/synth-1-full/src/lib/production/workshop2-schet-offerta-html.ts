/**
 * Печатный HTML счёт-оферты из payload (канон вместо fake PDF binary).
 */
import type { Workshop2SchetOffertaPayload } from '@/lib/production/workshop2-schet-offerta';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export function renderWorkshop2SchetOffertaHtml(payload: Workshop2SchetOffertaPayload): string {
  const lineRows = payload.lines
    .map(
      (line, idx) => `<tr>
        <td>${idx + 1}</td>
        <td>${escapeHtml(line.name)}</td>
        <td class="num">${line.qty}</td>
        <td>${escapeHtml(line.unit)}</td>
        <td class="num">${formatRub(line.priceRub)}</td>
        <td class="num">${formatRub(line.sumRub)}</td>
      </tr>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Счёт-оферта ${escapeHtml(payload.orderId)}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; color: #111; }
    h1 { font-size: 1.25rem; margin-bottom: 0.25rem; }
    .meta { font-size: 0.85rem; color: #444; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
    th { background: #f5f5f5; }
    td.num { text-align: right; white-space: nowrap; }
    .totals { margin-top: 1rem; max-width: 320px; margin-left: auto; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals .grand { font-weight: 700; font-size: 1.05rem; border-top: 2px solid #111; padding-top: 8px; }
    .legal { margin-top: 1.5rem; font-size: 0.75rem; color: #666; }
    @media print { body { margin: 12mm; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>Счёт-оферта № ${escapeHtml(payload.orderId)}</h1>
  <p class="meta">Дата: ${escapeHtml(new Date(payload.generatedAt).toLocaleString('ru-RU'))}</p>
  <p><strong>Продавец:</strong> ${escapeHtml(payload.seller.name)}, ИНН ${escapeHtml(payload.seller.inn)}<br/>
  ${escapeHtml(payload.seller.addressRu)}</p>
  <p><strong>Покупатель:</strong> ${escapeHtml(payload.buyer.name)}, ИНН ${escapeHtml(payload.buyer.inn)}</p>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Наименование</th><th>Кол-во</th><th>Ед.</th><th>Цена</th><th>Сумма</th>
      </tr>
    </thead>
    <tbody>${lineRows}</tbody>
  </table>
  <div class="totals">
    <div><span>Подитог</span><span>${formatRub(payload.subtotalRub)}</span></div>
    <div><span>НДС ${payload.vatRatePct}%</span><span>${formatRub(payload.vatRub)}</span></div>
    <div class="grand"><span>Итого</span><span>${escapeHtml(payload.totalFormattedRu)}</span></div>
  </div>
  <p class="legal">${escapeHtml(payload.legalNoteRu)}</p>
  <p class="no-print"><button onclick="window.print()">Печать / Save as PDF</button></p>
</body>
</html>`;
}
