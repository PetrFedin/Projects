/**
 * Генерирует UAT-чеклист из SECTION_AUDIT.
 * npm run audit:section-uat-checklist
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSectionAuditE2ePaths } from '../src/lib/platform-core-section-audit-e2e-paths';
import { SECTION_AUDIT } from '../src/lib/platform-core-readiness-sections';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monoRoot = path.join(__dirname, '..', '..', '..');
const outDir = path.join(monoRoot, '.planning', 'audits');
const outFile = path.join(outDir, 'SECTION-AUDIT-UAT-CHECKLIST.md');

const paths = buildSectionAuditE2ePaths();
const generatedAt = new Date().toISOString().slice(0, 10);

const roleLabels: Record<string, string> = {
  brand: 'Бренд',
  shop: 'Магазин',
  manufacturer: 'Цех',
  supplier: 'Поставщик',
};

const lines: string[] = [
  '# SECTION_AUDIT — UAT чеклист (честный)',
  '',
  `> **Сгенерировано:** ${generatedAt} · **Путей:** ${paths.length}`,
  '> **Автоматика:** `core-08` — HTTP < 500 + chrome. **Не покрывает:** клик CTA, PG save, cross-role peer.',
  '> **Интерактив:** `npm run core:verify:interactive` — handoff UI + registry bulk accept.',
  '',
  '## Протокол ручного UAT (на раздел)',
  '',
  '1. Открыть href из hub «Аудит» или таблицы ниже.',
  '2. Один context-bar / H1; cross-role compact внизу.',
  '3. Primary CTA кликабелен; PG-действия с retry/ошибкой RU.',
  '4. Peer cross-role → живой экран с тем же collection/order/article.',
  '',
  '## Покрытие автоматикой',
  '',
  '| Слой | Команда | Что ловит |',
  '|------|---------|-----------|',
  '| HTTP smoke | `test:e2e:core` → core-08 | 500, нет chrome |',
  '| Golden path | core-02 | SS27 цепочка, ключевые CTA |',
  '| Comms matrix | core-13 + core-14 | cross-nav 4 роли, banner dedupe, templates |',
  '| Interactive | `core:verify:interactive` | handoff UI + registry bulk |',
  '| No bootstrap | `core:verify:no-bootstrap` | banner no-seed |',
  '',
  '## Чеклист разделов',
  '',
];

const byRole = new Map<string, typeof paths>();
for (const entry of paths) {
  const list = byRole.get(entry.roleId) ?? [];
  list.push(entry);
  byRole.set(entry.roleId, list);
}

for (const [roleId, entries] of byRole) {
  lines.push(`### ${roleLabels[roleId] ?? roleId}`);
  lines.push('');
  for (const e of entries) {
    const audit = SECTION_AUDIT[roleId]?.[e.pillarId]?.find((s) => s.id === e.sectionId);
    const manualFocus =
      audit?.bad?.length ? ` · **фокус:** ${audit.bad.join('; ')}` : '';
    lines.push(
      `- [ ] \`${e.sectionId}\` — ${e.label} (\`${e.pillarId}\`) → \`${e.href}\`${manualFocus}`
    );
  }
  lines.push('');
}

lines.push('## Критерий 9+ (не заявляем без)');
lines.push('');
lines.push('- [ ] Все пункты выше отмечены вручную за одну сессию UAT');
lines.push('- [ ] `core:verify` + `core:verify:interactive` + `core:verify:no-bootstrap` зелёные');
lines.push('- [ ] Zero mock на активных ячейках SS27 (нет demo-notice на golden path)');
lines.push('');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, lines.join('\n'));
console.log(`ok: ${outFile} (${paths.length} sections)`);
