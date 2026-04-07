/**
 * Типовые силуэты по ур. 1 справочника категорий — подложка для аннотаций в Цехе 2.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

export type CategorySketchKind =
  | 'apparel_outerwear'
  | 'apparel_dress'
  | 'apparel_skirt'
  | 'apparel_shirt'
  | 'apparel_top'
  | 'apparel_pants'
  | 'apparel_shorts'
  | 'apparel_jumpsuit'
  | 'apparel_vest'
  | 'shoes'
  | 'bags'
  | 'headwear'
  | 'fur'
  | 'accessories'
  | 'generic';

/** Детали силуэта по L3 (поверх базового kind). */
export type CategorySketchAccent = 'hood' | 'long_dress' | null;

export function sketchAccentForLeaf(leaf: HandbookCategoryLeaf): CategorySketchAccent {
  const l3 = leaf.l3Name.trim().toLowerCase();
  if (/(капюш|hood|анорак|худи|парка с капюш|wind)/.test(l3)) return 'hood';
  const kind = sketchKindForLeaf(leaf);
  if (kind === 'apparel_dress' && /(макси|в пол|длинн|миди)/.test(l3)) return 'long_dress';
  return null;
}

function isClothingL1(l1Raw: string): boolean {
  const l1 = l1Raw.trim().toLowerCase();
  return (
    l1 === 'одежда' ||
    l1.includes('одежд') ||
    l1 === 'clothing' ||
    l1 === 'apparel' ||
    l1 === 'одежда и текстиль'
  );
}

export function sketchKindForLeaf(leaf: HandbookCategoryLeaf): CategorySketchKind {
  const l1Raw = leaf.l1Name.trim();
  const l2 = leaf.l2Name.trim().toLowerCase();
  const l3 = leaf.l3Name.trim().toLowerCase();
  if (isClothingL1(l1Raw)) {
    if (l2.includes('комбинез') || /(комбинез|оверол|ромпер|джампер|jumpsuit|overall)/.test(l3)) {
      return 'apparel_jumpsuit';
    }
    // Жилеты часто сидят под L2 «Верхняя одежда» — проверять до общего outerwear.
    if (l2.includes('жилет') || /(жилет|безрукавк|vest|gilet|bodywarmer)/.test(l3)) {
      return 'apparel_vest';
    }
    if (l2.includes('платья') || /(плать|сарафан)/.test(l3)) return 'apparel_dress';
    if (l2.includes('юбк') || l3.includes('юб')) return 'apparel_skirt';
    if (l2.includes('рубаш') || l2.includes('блуз') || /(рубаш|блуз)/.test(l3)) return 'apparel_shirt';
    if (/(шорт|бермуд|бридж|капр)/.test(l3) || (l2.includes('шорт') && !l2.includes('рубаш'))) {
      return 'apparel_shorts';
    }
    if (l2.includes('брюк') || l2.includes('джинс') || /(брюк|джинс|чинос|легинс|джоггер)/.test(l3)) {
      return 'apparel_pants';
    }
    if (
      l2.includes('верхняя одежда') ||
      l2.includes('верхняя') && l2.includes('одежд') ||
      /(пальт|тренч|парки|пуховик|куртк|бомбер|ветровк|плащ|дождевик|пончо|лайнер|подст|худи|толстовк|анорак|виндстопер|дафлкот|шинел|оверкот|парка|windbreaker|coat|jacket)/.test(
        l3
      )
    ) {
      return 'apparel_outerwear';
    }
    if (l2.includes('топ') || l2.includes('футбол') || /(топ|футбол|майк|поло|кроп|кардиган|джемпер|пуловер|водолазк|свитер|лонгслив)/.test(l3)) {
      return 'apparel_top';
    }
    return 'apparel_top';
  }
  const l1 = l1Raw.toLowerCase();
  if (l1.includes('обув') || l1 === 'shoes' || l1 === 'footwear') return 'shoes';
  if (l1.includes('сумк') || l1 === 'bags' || l1.includes('bag')) return 'bags';
  if (l1.includes('головн') || l1.includes('headwear') || l1.includes('hat')) return 'headwear';
  if (l1.includes('мехов') || l1.includes('fur')) return 'fur';
  if (l1.includes('аксессуар') || l1 === 'accessories') return 'accessories';
  return 'generic';
}

/** Вариант силуэта верхней одежды по L3 (пальто ≠ бомбер). */
export type CategorySketchOuterwearStyle = 'coat_long' | 'jacket_mid' | 'jacket_short' | 'puffy';

export function outerwearStyleForLeaf(leaf: HandbookCategoryLeaf): CategorySketchOuterwearStyle {
  const l3 = leaf.l3Name.trim().toLowerCase();
  if (/(пальт|тренч|плащ|дафлкот|шинел|оверкот|overcoat|trench|cloak)/.test(l3)) return 'coat_long';
  if (/(пуховик|пух|down|стёг|стег|квилт|quilt|пухов)/.test(l3)) return 'puffy';
  if (/(бомбер|укороч|кроп|куртк.*корот|short\s*jacket|blouson)/.test(l3)) return 'jacket_short';
  return 'jacket_mid';
}

/** Пропорции шаблона: аудитория паспорта + унисекс. */
export type CategorySketchFitVariant =
  | 'womenswear'
  | 'menswear'
  | 'girls'
  | 'boys'
  | 'baby'
  | 'neutral';

export function sketchFitVariantForContext(args: {
  audienceId?: string;
  audienceName?: string;
  isUnisex?: boolean;
}): CategorySketchFitVariant {
  if (args.isUnisex) return 'neutral';
  const id = (args.audienceId ?? '').toLowerCase();
  const name = (args.audienceName ?? '').toLowerCase();
  if (id === 'men' || name.includes('мужч')) return 'menswear';
  if (id === 'women' || name.includes('женщин')) return 'womenswear';
  if (id === 'boys' || name.includes('мальчик')) return 'boys';
  if (id === 'girls' || name.includes('девочк')) return 'girls';
  if (id === 'newborn' || name.includes('новорожд')) return 'baby';
  return 'neutral';
}

function silhouetteGroupTransform(kind: CategorySketchKind, variant: CategorySketchFitVariant): string | undefined {
  const cx = 160;
  const cy = 125;
  const apparel =
    kind === 'apparel_outerwear' ||
    kind === 'apparel_dress' ||
    kind === 'apparel_skirt' ||
    kind === 'apparel_shirt' ||
    kind === 'apparel_top' ||
    kind === 'apparel_pants' ||
    kind === 'apparel_shorts' ||
    kind === 'apparel_jumpsuit' ||
    kind === 'apparel_vest' ||
    kind === 'fur';

  if (apparel) {
    switch (variant) {
      case 'menswear':
        return `translate(${cx} ${cy}) scale(1.06 1.02) translate(${-cx} ${-cy})`;
      case 'womenswear':
        return `translate(${cx} ${cy}) scale(0.98 1.05) translate(${-cx} ${-cy})`;
      case 'girls':
      case 'boys':
        return `translate(${cx} ${cy}) scale(0.88 0.9) translate(${-cx} ${-cy})`;
      case 'baby':
        return `translate(${cx} ${cy}) scale(0.74 0.8) translate(${-cx} ${-cy})`;
      default:
        return undefined;
    }
  }

  if (variant === 'girls' || variant === 'boys') {
    return `translate(${cx} ${cy}) scale(0.9) translate(${-cx} ${-cy})`;
  }
  if (variant === 'baby') {
    return `translate(${cx} ${cy}) scale(0.78) translate(${-cx} ${-cy})`;
  }
  return undefined;
}

const STROKE = '#94a3b8';
const FILL = '#f1f5f9';

/** SVG 320×240, viewBox фиксированный для позиционирования меток в %. */
export function CategorySketchTemplateSvg({
  leaf,
  className,
  fitVariant,
  sketchContext,
}: {
  leaf: HandbookCategoryLeaf;
  className?: string;
  /** Явный вариант; иначе из sketchContext или audienceId листа. */
  fitVariant?: CategorySketchFitVariant;
  /** Аудитория из паспорта артикула (может отличаться от leaf при смене сегмента). */
  sketchContext?: { audienceId?: string; audienceName?: string; isUnisex?: boolean };
}) {
  const kind = sketchKindForLeaf(leaf);
  const accent = sketchAccentForLeaf(leaf);
  const outerwearStyle = outerwearStyleForLeaf(leaf);
  const variant =
    fitVariant ??
    sketchFitVariantForContext({
      audienceId: sketchContext?.audienceId ?? leaf.audienceId,
      audienceName: sketchContext?.audienceName,
      isUnisex: sketchContext?.isUnisex,
    });
  const xf = silhouetteGroupTransform(kind, variant);

  const dressBody =
    accent === 'long_dress' ? (
      <g transform="translate(160 112) scale(1 1.1) translate(-160 -112)">
        <ApparelDressPaths />
      </g>
    ) : (
      <ApparelDressPaths />
    );

  const inner = (
    <>
      {kind === 'apparel_outerwear' ? (
        <>
          <ApparelOuterwearPaths style={outerwearStyle} />
          {accent === 'hood' ? <OuterwearHoodAccent /> : null}
        </>
      ) : null}
      {kind === 'apparel_dress' ? dressBody : null}
      {kind === 'apparel_skirt' ? <ApparelSkirtPaths /> : null}
      {kind === 'apparel_shirt' ? <ApparelShirtPaths /> : null}
      {kind === 'apparel_top' ? <ApparelTopPaths /> : null}
      {kind === 'apparel_pants' ? <ApparelPantsPaths /> : null}
      {kind === 'apparel_shorts' ? <ApparelShortsPaths /> : null}
      {kind === 'apparel_jumpsuit' ? <ApparelJumpsuitPaths /> : null}
      {kind === 'apparel_vest' ? <ApparelVestPaths /> : null}
      {kind === 'shoes' ? <ShoesPaths /> : null}
      {kind === 'bags' ? <BagsPaths /> : null}
      {kind === 'headwear' ? <HeadwearPaths /> : null}
      {kind === 'fur' ? <FurPaths /> : null}
      {kind === 'accessories' ? <AccessoriesPaths /> : null}
      {kind === 'generic' ? <GenericPaths /> : null}
    </>
  );

  return (
    <svg
      viewBox="0 0 320 240"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="320" height="240" fill={FILL} rx="8" />
      {xf ? <g transform={xf}>{inner}</g> : inner}
      <CategorySketchPathCaption leaf={leaf} />
    </svg>
  );
}

const gProps = {
  fill: 'none' as const,
  stroke: STROKE,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function ApparelOuterwearPaths({ style }: { style: CategorySketchOuterwearStyle }) {
  if (style === 'coat_long') {
    return (
      <g {...gProps}>
        <path d="M114 46 L206 46 L226 84 L234 200 L86 200 L94 84 Z" />
        <path d="M114 46 L142 82 L160 60 L178 82 L206 46" />
        <path d="M160 60 L160 200" />
        <path d="M140 82 L152 124 M180 82 L168 124" />
        <path d="M96 86 L74 148 L60 198 M224 86 L246 148 L260 198" />
        <path d="M124 142 L148 152 M196 142 L172 152" />
        <path d="M96 178 Q160 196 224 178" />
        <path d="M100 108 Q110 158 104 200 M220 108 Q210 158 216 200" />
      </g>
    );
  }
  if (style === 'jacket_short') {
    return (
      <g {...gProps}>
        <path d="M120 54 L200 54 L210 80 L218 168 L102 168 L112 80 Z" />
        <path d="M120 54 L144 82 L160 66 L176 82 L200 54" />
        <path d="M160 66 L162 168" />
        <path d="M140 82 L152 112 M180 82 L168 112" />
        <path d="M112 84 L92 128 L80 172 M208 84 L228 128 L240 172" />
        <path d="M126 124 L144 134 M194 124 L176 134" />
        <path d="M118 152 Q160 164 202 152" />
        <path d="M114 100 Q120 134 118 168 M206 100 Q200 134 202 168" />
      </g>
    );
  }
  if (style === 'puffy') {
    return (
      <g {...gProps}>
        <path d="M106 50 L214 50 L224 82 L234 202 L86 202 L96 82 Z" />
        <path d="M106 50 L138 80 L160 58 L182 80 L214 50" />
        <path d="M160 58 L160 202" />
        <path d="M136 78 L150 118 M184 78 L170 118" />
        <path d="M96 84 L76 138 L66 192 M224 84 L244 138 L254 192" />
        <path
          d="M112 96 Q160 104 208 96 M110 124 Q160 132 210 124 M108 152 Q160 160 212 152 M106 178 Q160 186 214 178"
          strokeDasharray="3 4"
          opacity={0.88}
        />
        <path d="M118 168 Q160 182 202 168" />
        <path d="M104 102 Q112 152 108 202 M216 102 Q208 152 212 202" />
      </g>
    );
  }
  return (
    <g {...gProps}>
      <path d="M118 52 L202 52 L216 82 L228 204 L92 204 L104 82 Z" />
      <path d="M118 52 L142 80 L160 64 L178 80 L202 52" />
      <path d="M160 64 L160 204" />
      <path d="M142 80 L154 116 M178 80 L166 116" />
      <path d="M104 84 L84 136 L72 186 M216 84 L236 136 L248 186" />
      <path d="M126 136 L144 146 M194 136 L176 146" />
      <path d="M120 168 Q160 180 200 168" />
      <path d="M108 104 Q116 154 120 204 M212 104 Q204 154 200 204" />
    </g>
  );
}

function CategorySketchPathCaption({ leaf }: { leaf: HandbookCategoryLeaf }) {
  const l1 = leaf.l1Name.trim();
  const l2 = leaf.l2Name.trim();
  const l3 = leaf.l3Name.trim();
  const line1 = l2 && l2 !== '—' ? `${l1} › ${l2}` : l1;
  const line2 = l3 && l3 !== '—' ? l3 : leaf.pathLabel;
  const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);
  return (
    <g aria-hidden>
      <rect x="0" y="208" width="320" height="32" fill="rgb(241 245 249 / 0.92)" />
      <line x1="12" y1="208" x2="308" y2="208" stroke="#cbd5e1" strokeWidth="1" />
      <text
        x="160"
        y="220"
        textAnchor="middle"
        fill="#64748b"
        style={{ fontSize: '8px', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {clip(line1, 48)}
      </text>
      <text
        x="160"
        y="232"
        textAnchor="middle"
        fill="#0f766e"
        style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {clip(line2, 44)}
      </text>
    </g>
  );
}

function ApparelDressPaths() {
  return (
    <g {...gProps}>
      <path d="M136 48 L184 48 L198 82 L224 196 L96 196 L122 82 Z" />
      <path d="M136 48 Q160 36 184 48" />
      <path d="M128 88 Q160 106 192 88" />
      <path d="M118 122 Q160 140 202 122" />
    </g>
  );
}

function ApparelSkirtPaths() {
  return (
    <g {...gProps}>
      <path d="M126 58 L194 58 L214 188 L106 188 Z" />
      <path d="M126 58 L120 38 L200 38 L194 58" />
      <path d="M138 90 L128 188 M182 90 L192 188" />
    </g>
  );
}

function ApparelShirtPaths() {
  return (
    <g {...gProps}>
      <path d="M116 52 L204 52 L214 82 L206 196 L114 196 L106 82 Z" />
      <path d="M116 52 L140 82 L160 62 L180 82 L204 52" />
      <path d="M160 62 L160 196" />
      <path d="M106 92 L84 126 M214 92 L236 126" />
    </g>
  );
}

function ApparelTopPaths() {
  return (
    <g {...gProps}>
      <path d="M120 56 L200 56 L210 84 L198 188 L122 188 L110 84 Z" />
      <path d="M120 56 Q160 28 200 56" />
      <path d="M112 90 L90 128 M208 90 L230 128" />
    </g>
  );
}

function ApparelPantsPaths() {
  return (
    <g {...gProps}>
      <path d="M122 44 L198 44 L206 92 L186 196 L160 144 L134 196 L114 92 Z" />
      <path d="M122 44 L120 30 L200 30 L198 44" />
      <path d="M160 92 L160 144" />
    </g>
  );
}

/** Шорты / бермуды — отдельный силуэт от полных брюк. */
function ApparelShortsPaths() {
  return (
    <g {...gProps}>
      <path d="M122 44 L198 44 L204 78 L172 128 L160 118 L148 128 L116 78 Z" />
      <path d="M122 44 L120 30 L200 30 L198 44" />
      <path d="M160 78 L160 118" />
      <path d="M128 92 L132 118 M192 92 L188 118" strokeDasharray="3 4" opacity={0.85} />
    </g>
  );
}

function ApparelJumpsuitPaths() {
  return (
    <g {...gProps}>
      <path d="M124 48 L196 48 L208 78 L202 192 L118 192 L112 78 Z" />
      <path d="M124 48 L148 74 L160 58 L172 74 L196 48" />
      <path d="M160 58 L162 118" />
      <path d="M118 118 L114 192 M202 118 L206 192" />
      <path d="M132 132 L128 178 M188 132 L192 178" strokeDasharray="3 4" opacity={0.85} />
    </g>
  );
}

function ApparelVestPaths() {
  return (
    <g {...gProps}>
      <path d="M118 58 L202 58 L210 86 L204 168 L116 168 L110 86 Z" />
      <path d="M118 58 L138 86 L160 68 L182 86 L202 58" />
      <path d="M160 68 L160 168" />
      <path d="M132 96 L188 96 M132 128 L184 128" strokeDasharray="4 4" opacity={0.8} />
      <path d="M110 88 L96 120 M210 88 L224 120" />
    </g>
  );
}

function OuterwearHoodAccent() {
  return (
    <g {...gProps} strokeWidth={1.75} opacity={0.95}>
      <path d="M118 52 Q160 14 202 52" />
      <path d="M128 52 Q160 28 192 52" />
      <path d="M138 50 L138 62 M182 50 L182 62" strokeDasharray="2 3" opacity={0.8} />
    </g>
  );
}

function ShoesPaths() {
  return (
    <g {...gProps}>
      <path d="M60 140 Q140 100 260 120 Q280 125 275 145 Q270 175 200 178 L80 165 Q55 158 60 140 Z" />
      <path d="M100 130 Q160 118 220 128" />
    </g>
  );
}

function BagsPaths() {
  return (
    <g {...gProps}>
      <rect x="100" y="72" width="120" height="120" rx="12" />
      <path d="M130 72 Q160 40 190 72" />
      <path d="M140 120 L180 120" />
    </g>
  );
}

function HeadwearPaths() {
  return (
    <g {...gProps}>
      <ellipse cx="160" cy="100" rx="72" ry="48" />
      <path d="M88 100 Q160 140 232 100" />
      <path d="M120 88 L200 88" />
    </g>
  );
}

function FurPaths() {
  return (
    <g {...gProps}>
      <path d="M100 56 L220 56 L228 80 L215 200 L105 200 L92 80 Z" />
      <path d="M105 90 Q160 110 215 90" />
      <path d="M125 120 L125 170 M195 120 L195 170" />
    </g>
  );
}

function AccessoriesPaths() {
  return (
    <g {...gProps}>
      <ellipse cx="160" cy="120" rx="64" ry="64" />
      <rect x="130" y="40" width="60" height="24" rx="4" />
      <path d="M160 64 L160 56" />
    </g>
  );
}

function GenericPaths() {
  return (
    <g {...gProps}>
      <path d="M122 52 L198 52 L208 80 L202 186 L118 186 L112 80 Z" />
      <path d="M122 52 Q160 42 198 52" />
      <path d="M112 84 L88 128 L78 176 M208 84 L232 128 L242 176" />
      <path d="M136 92 L184 92 M134 124 L186 124 M132 156 L188 156" strokeDasharray="3 4" opacity={0.8} />
      <path d="M150 80 L170 80" strokeWidth="1.5" opacity={0.7} />
    </g>
  );
}
