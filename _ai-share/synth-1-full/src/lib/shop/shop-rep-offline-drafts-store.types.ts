export type ShopRepOfflineDraft = {
  id: string;
  repId: string;
  campaignId: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type ShopRepOfflineDraftsConfig = {
  repId: string;
  drafts: ShopRepOfflineDraft[];
  updatedAt: string;
};
