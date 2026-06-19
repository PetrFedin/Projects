/** Read-only shop view: production attrs в контексте опубликованной коллекции (столп 3). */

export type ShopMatrixArticleFabricLine = {
  materialName: string;
  compositionText?: string;
  supplier?: string;
  role: string;
  isPrimary?: boolean;
};

export type ShopMatrixArticleInspectorView = {
  collectionId: string;
  articleId: string;
  name: string;
  sku?: string;
  heroImageUrl?: string;
  wholesalePriceRub: number;
  msrpRub?: number;
  moq?: number;
  campaignName?: string;
  supplierModelNote?: string;
  sewingRegionNote?: string;
  compositionSummary?: string;
  sizeSchemaNote?: string;
  fabricLines: ShopMatrixArticleFabricLine[];
  lifecycleLabel?: string;
  published: boolean;
};
