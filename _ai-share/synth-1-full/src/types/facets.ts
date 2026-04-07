export type FacetBucket = { value: string; count: number };
export type Facets = {
  status: FacetBucket[];
  category: FacetBucket[];
  brand: FacetBucket[];
  countryOfOrigin: FacetBucket[];
  productionStage: FacetBucket[];
};

