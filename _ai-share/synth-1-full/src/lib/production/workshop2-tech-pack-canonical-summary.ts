import type { Workshop2Phase1TechPackAttachment } from '@/lib/production/workshop2-dossier-phase1.types';

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Абзац для HTML «Итоговое ТЗ»: явно помечает файл как предпросмотр досье, если нет
 * `object_store_verified`; при наличии — краткая сводка по проверенным вложениям.
 */
export function buildWorkshop2TechPackCanonicalPreviewBlockHtml(
  attachments: Workshop2Phase1TechPackAttachment[]
): string {
  const verified = attachments.filter((a) => a.canonicalSource === 'object_store_verified');
  if (verified.length === 0) {
    return `<p class="muted"><strong>Серверный tech pack (S3 / complete):</strong> вложений с подтверждённой целостностью в хранилище нет — этот документ — <strong>предпросмотр</strong> досье в браузере (localStorage / IDB), не замена юридически значимой копии объекта в облаке.</p>`;
  }
  const rows = verified
    .map((a) => {
      const bits = [
        `<strong>${escHtml(a.fileName)}</strong>`,
        a.remoteObjectKey?.trim() ? `ключ: ${escHtml(a.remoteObjectKey.trim())}` : null,
        a.objectStoreEtag?.trim() ? `ETag: ${escHtml(a.objectStoreEtag.trim())}` : null,
        a.serverIntegrityVerifiedAt?.trim()
          ? `проверено: ${escHtml(a.serverIntegrityVerifiedAt.trim())}`
          : null,
      ].filter(Boolean);
      return `<li>${bits.join(' · ')}</li>`;
    })
    .join('');
  return `<div class="canonical-pack"><p><strong>Серверный канон (object_store_verified):</strong> ${verified.length} из ${attachments.length} вложений с отметкой проверки бэкенда.</p><ul>${rows}</ul><p class="muted">Файл ниже — снимок досье на момент экспорта; для аудита сверяйте объекты и ETag в хранилище.</p></div>`;
}

/** Короткая строка для мастера экспорта / подсказок в UI (без HTML). */
export function workshop2TechPackCanonicalWizardHintRu(
  attachments: Workshop2Phase1TechPackAttachment[] | undefined
): string {
  const list = attachments ?? [];
  const n = list.filter((a) => a.canonicalSource === 'object_store_verified').length;
  if (n === 0) {
    return 'Серверный tech pack: подтверждённых вложений (S3 + complete) пока нет — скачанный HTML это предпросмотр досье в браузере, не замена проверенного объекта в хранилище.';
  }
  return `Серверный канон: ${n} влож. с проверкой бэкенда (object_store_verified) — в документе добавлен блок с ключами/ETag; для аудита сверяйте S3.`;
}
