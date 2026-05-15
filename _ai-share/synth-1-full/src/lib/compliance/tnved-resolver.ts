import { TNVEDResolutionRequest, TNVEDResolutionResponse } from './types';

export class TNVEDResolver {
  resolve(request: TNVEDResolutionRequest): TNVEDResolutionResponse {
    const { materialComposition, category } = request;

    let mainMaterial = '';
    let maxPercentage = 0;

    for (const comp of materialComposition) {
      if (comp.percentage > maxPercentage) {
        maxPercentage = comp.percentage;
        mainMaterial = comp.material.toLowerCase();
      }
    }

    if (maxPercentage < 50) {
      return {
        code: 'UNKNOWN',
        confidence: 0.1,
        requiredCertificates: []
      };
    }

    if (category.toLowerCase() === 't-shirt') {
      if (mainMaterial.includes('cotton')) {
        return {
          code: '6109100000',
          confidence: 0.95,
          requiredCertificates: ['EAC_DECLARATION']
        };
      } else if (mainMaterial.includes('polyester')) {
        return {
          code: '6109902000',
          confidence: 0.95,
          requiredCertificates: ['EAC_DECLARATION']
        };
      }
    }

    return {
      code: '6200000000',
      confidence: 0.5,
      requiredCertificates: ['EAC_DECLARATION']
    };
  }
}
