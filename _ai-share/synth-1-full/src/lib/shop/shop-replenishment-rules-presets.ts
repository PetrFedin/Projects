export type ReplenishmentRulePreset = {
  id: string;
  titleRu: string;
  summaryRu: string;
  kind: 'basic' | 'fashion';
};

export const REPLENISHMENT_RULE_PRESETS: readonly ReplenishmentRulePreset[] = [
  {
    id: 'basic-low-sold',
    titleRu: 'Basic · low sold',
    summaryRu: 'Pcs sold < 3 за 30 дней и ATP < safety → suggest reorder.',
    kind: 'basic',
  },
  {
    id: 'fashion-eos',
    titleRu: 'Fashion · end of season',
    summaryRu: 'ATP > 0 и sell-through < порога → markdown / stop reorder.',
    kind: 'fashion',
  },
];

export const REPLENISHMENT_RULE_PRESET_IDS = new Set(REPLENISHMENT_RULE_PRESETS.map((p) => p.id));
