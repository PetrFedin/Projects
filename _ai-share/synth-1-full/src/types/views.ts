import type { MarketplaceFilters } from "./filters";

export type SavedView = {
  id: string;
  name: string;
  scope: "personal" | "team";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  filters: MarketplaceFilters;
};

