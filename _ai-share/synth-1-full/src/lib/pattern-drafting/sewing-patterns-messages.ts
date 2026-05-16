/**
 * Тексты раздела «лекала по меркам» (RU). При подключении i18n — заменить на словарь/фабрику.
 */
export const sewingPatternsMessages = {
  nonApparelBannerTitle: 'Крой не применяется',
  nonApparelBannerBody:
    'Учебный контур и лекала в этом сценарии рассчитаны на одежду. Для сумок, обуви и иных невещевых веток инструмент показывает только путь в каталоге; чертёж и пресеты кроя к ним не привязаны.',
  nonApparelPathOnlyHint: 'Путь категории — для согласования; пресеты кроя и деталей кроя здесь не показываются.',
  formDimmedNote: 'Мерки и опции чертежа — для ветки «Одежда».',
  formDescriptionApparel: 'См, дюймы через точку. Рост влияет на FWL. Категория (шаг 1) подставила ease; правьте вручную.',
  formDescriptionNonApparel: 'Мерки из профиля читаются в любом случае, но визуал кроя ниже — только для одежды. Переключите ур.1 на «Одежда», чтобы снова настроить чертёж.',
  copyCategorySnapshot: 'Скопировано',
  copyCategoryDescription: 'Снимок пути в буфере (для бренда/заказа).',
  commitIntentButton: 'Зафиксировать на сервере',
  commitIntentSuccess: 'Категория проверена',
  commitIntentError: 'Проверка не прошла',
  nonApparelSvgLine1: 'Крой одежды к этой категории не применяется.',
  nonApparelSvgLine2: 'Чертёж ниже — для ветки «Одежда».',
  nonApparelNote:
    'Просмотр учебного лекала доступен, когда в ур.1 выбрана «Одежда» (категория-handbook, аудитория «Каталог»).',
  nonApparelMetricsEmpty: 'Сметрика по деталям — только при выборе ветки «Одежда».',
  commitIntentSuccessWithSchema: (pathLabel: string, schemaVersion: number, generatedAt: string) =>
    `${pathLabel} — leafId согласован (category-handbook v${String(schemaVersion)}, снимок ${generatedAt.slice(0, 10)}).`,
  commitIntentSuccessSimple: (pathLabel: string) => `${pathLabel} — leafId проверен по снимку справочника.`,
  commitIntentErrorAborted: 'Запрос отменён (новая проверка или уход со страницы).',
  commitIntentErrorNetwork: 'Сеть недоступна. Повторите позже.',
  commitIntentErrorRateLimited: 'Слишком много запросов. Подождите до минуты и попробуйте снова.',
  commitIntentErrorCode: (code: string) => `Код: ${code}. Проверьте категорию или обновите страницу.`,
  profileMismatchHint:
    'Мерки в полях отличаются от сохранённого профиля (профиль мерок). Можно подтянуть значения из профиля.',
  applyFromProfileButton: 'Как в профиле',
  serverIntentMismatchHint:
    'Поля не совпадают с последним снимком на сервере (категория или мерки). Можно вернуть значения с сервера.',
  applyFromServerButton: 'Как на сервере',
  profileVsServerHint:
    'Сохранённый профиль мерок и последняя версия на сервере различаются. Выберите: подтянуть из профиля, с сервера или оставьте как в полях.',
  measureSourceTitle: 'Согласование мерок',
  measureSourceDescription:
    'Поля, профиль и сервер сейчас не совпадают. Выберите источник и нажмите «Применить».',
  measureSourceForm: 'Текущие поля',
  measureSourceProfile: 'Профиль',
  measureSourceServer: 'Сервер',
  measureSourceApply: 'Применить',
  commitOffline: 'Нет сети: сохранение на сервере будет доступно, когда появится соединение.',
  svgExportDisabledHint: 'Скачивание SVG в этой среде отключено.',
  introTitle: 'Ваши мерки: ориентир и сценарий «на заказ»',
  introClientLabel: 'Клиент',
  introAfterClient:
    ' задаёт параметры тела, видит оценочный контур и варианты (ease, деталь) — это база для согласования, не финальный крой. ',
  introBrandLabel: 'Бренд и производство',
  introAfterBrand:
    ' владеют лекалами: проверка, градация, техпак, раскрой, контроль качества — в кабинете бренда / MES, не здесь. Раздел: ',
  introWardrobeName: '«Гардероб и избранное»',
  introAfterWardrobe: '. Мерки из ',
  introLinkProfile: 'профиля',
  introAfterLink: '; SVG ниже — учебно-визуальный черновик.',
  funnelStep1: 'Категория',
  funnelStep2: 'Мерки',
  funnelStep3: 'Деталь и просмотр',
  commitIntentHint:
    'Категория + мерки — на сервере сверяются с category-handbook (анти-спуф).',
  previewFileDescription: (widthMm: number, heightMm: number, fileName: string) =>
    `Холст: ${widthMm.toFixed(0)}×${heightMm.toFixed(0)} u. Файл: ${fileName}`,
  metricsBlockTitle: 'Сметрика',
  metricsBlockDescription:
    'Черновик по выбранной детали: для сопоставления с брендом и таблицей.',
  /** Бейдж на превью: отделяет учебный SVG от production-кроя. */
  educationalDraftBadge: 'Учебный чертёж',
  /** Заголовок шага 3 с холстом. */
  stepPreviewTitle: 'Просмотр (мм)',
  /** Короткие кнопки смены языка UI. */
  uiLocaleShortRu: 'RU',
  uiLocaleShortEn: 'EN',
} as const;

export type SewingPatternsMessageKey = keyof typeof sewingPatternsMessages;

/** Расширение литералов RU до `string` — чтобы EN-словари соответствовали тому же контракту. */
export type SewingPatternsMessages = {
  [K in SewingPatternsMessageKey]: (typeof sewingPatternsMessages)[K] extends (
    ...args: infer A
  ) => infer R
    ? (...args: A) => R
    : string;
};
