export interface TNVEDResolutionRequest {
  materialComposition: Array<{
    material: string;
    percentage: number;
  }>;
  category: string;
  targetCountry: string;
}

export interface TNVEDResolutionResponse {
  code: string;
  confidence: number;
  requiredCertificates: string[];
}

export interface ChestnyZnakAPIRequest {
  endpoint: string;
  payload: any;
  authHeader?: string;
}
