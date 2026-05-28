/**
 * Wave 22: PDF linesheet кампании B2B (jsPDF, RU).
 */
import { jsPDF } from 'jspdf';
import type { Workshop2B2bCampaign } from '@/lib/production/workshop2-b2b-campaign-hub';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';

export function buildWorkshop2B2bLinesheetPdfBytes(input: {
  campaign: Workshop2B2bCampaign;
  generatedAt?: string;
}): ArrayBuffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  let y = 14;
  const line = (text: string, size = 10) => {
    doc.setFontSize(size);
    doc.text(text.slice(0, 96), 14, y);
    y += size * 0.45 + 2;
  };
  const at = input.generatedAt ?? new Date().toISOString();
  line(`Linesheet · ${input.campaign.campaignName}`, 14);
  line(
    `${input.campaign.collectionId} · ${input.campaign.articleId} · tier ${input.campaign.tier}`,
    9
  );
  line(`Дата: ${at.slice(0, 10)} · рынок RU · ₽`, 9);
  const wholesale = input.campaign.linesheet.wholesalePrice;
  const moq = input.campaign.linesheet.moq;
  if (wholesale != null) line(`Опт: ${formatWorkshop2RubCurrency(wholesale)}`, 10);
  if (moq != null) line(`MOQ: ${moq} шт`, 10);
  const window = input.campaign.linesheet.preorderWindowRu?.labelRu;
  if (window) line(`Окно: ${window}`, 9);
  y += 2;
  line('Цвета × размеры:', 10);
  for (const cw of input.campaign.linesheet.colorways.slice(0, 8)) {
    line(`· ${cw.label} (${cw.code})`, 9);
  }
  for (const size of input.campaign.linesheet.sizes.slice(0, 12)) {
    line(`  размер ${size}`, 8);
  }
  line('Источник: W2 dossier + showroom PG (native B2B).', 8);
  return doc.output('arraybuffer') as ArrayBuffer;
}
