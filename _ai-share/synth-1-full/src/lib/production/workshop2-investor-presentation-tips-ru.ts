/**
 * Wave 58/59: короткие формулировки «что говорить» для investor walkthrough (2–3 предложения на шаг).
 * Синхронизировано с .planning/INVESTOR-DEMO-SCRIPT-RU.md.
 */
export const WORKSHOP2_INVESTOR_PRESENTATION_TIPS_RU: string[] = [
  'Это не marketing slide — live JSON с auto-gates с диска и probes. Красный gate мы не скрываем: investorDemoReady=false означает «не готовы показывать», а не «починим после встречи».',
  'Demo vs live — три строки честности: ЭДО journal-only без токена, 3D badge «Демо-превью», human signoff relaxed в demoMode. Мы подписываем режим, а не притворяемся prod.',
  'Hub SS27 — investor flow на demo-ss27-01…04. UAT % считается автоматически; human signoff — отдельный ops journal, не подмена demo disclaimer.',
  'demo-ss27-01 — полное досье phase1: TZ fill %, pipeline этапы, зеркала ЭДО и marking. Два SKU на брифе, один на материалах — вертикаль product data, не статичный mockup.',
  'Линейка SS27 — четыре артикула для investor path; fill % различается честно. Показываем, что система масштабируется на коллекцию, а не один hero-SKU.',
  'Publish gate в B2B showroom не обходится — как linesheet publish в JOOR. Если gate блокирует — озвучиваем причину; это feature compliance, не баг демо.',
  'ЭДО в demoMode — запись в журнал, не отправка в Контур. Скажите вслух: «Сейчас demoMode — journalId есть, live HTTP attempt только с WORKSHOP2_KONTUR_DIADOC_TOKEN».',
  'Integration probes — каждая волна restore-disk + score на диске, не Notion-чеклист. wave58InvestorShowReady ≥12 — артефакты investor show, не ручная галочка.',
  'B2B Showroom SS27 — NuOrder-плотность matrix order через native API. B2bWorkshopChrome на всех /shop/b2b/* — единый wholesale UX без iframe JOOR.',
  'Matrix qty → cart — batch save с MOQ подсказками RU. Покупатель видит wholesale правила до checkout, не post-factum в ERP.',
  'Checkout — wholesale PO path, не disabled stub: payment terms, delivery date, multi-brand split. Это pilot-ready форма, не placeholder.',
  'Submit order → domain event b2b_order → contextual chat. Горизонталь W2↔B2B: заказ виден в chip «B2B заказы» на артикуле в hub.',
  'Invoice stub / CSV export — PDF pipeline ops через Playwright; сейчас HTML stub с честной подписью «демо-печать». Не выдаём за live billing.',
  'Rep portal — JOOR attribution + SS27 campaign SS27::demo-ss27-01. Commission preview и share link — field sales story, не back-office only.',
  'Offline → online: IndexedDB b2b-offline-db v1, banner «N действий», toast при sync. Field rep без сети — очередь на устройстве, replay на cart API.',
  '3D panel — badge «Демо-превью 3D» vs «Live SDK» по env. Не притворяемся Matterport live без WORKSHOP2_MATTERPORT_SDK_KEY.',
  'investorDemoReady = auto gates И (human signoff ИЛИ WORKSHOP2_INVESTOR_DEMO_MODE). parityCoveragePct и deadEndsRemaining — честные метрики, не vanity.',
  'One-command runner: npm run workshop2:investor-prep → last-run JSON + 6 скринов. После встречи ops присылает артефакты; Q&A — parity 31 native, unit 1539+, roadmap Wave 59.',
];

export const WORKSHOP2_INVESTOR_QA_DOC_PATH = '.planning/INVESTOR-QA-RU.md';
