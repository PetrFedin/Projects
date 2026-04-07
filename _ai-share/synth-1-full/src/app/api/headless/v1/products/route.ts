import { NextResponse } from 'next/server';

/**
 * Headless Commerce API — GET /v1/products
 * Эндпоинт для внешних фронтендов (Next.js, Mobile App, 3rd Party Storefronts).
 */

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  // Имитация проверки API-ключа
  if (!authHeader || !authHeader.startsWith('Bearer syn_live_')) {
    return NextResponse.json({ 
      error: 'Unauthorized', 
      message: 'Missing or invalid API Key. Please generate a key in Synth-1 Brand Settings.' 
    }, { status: 401 });
  }

  // Mock-данные товаров
  const products = [
    {
      id: 'p-1',
      name: 'Metallic Satin Blouse',
      sku: 'BL-SLK-SS26-01',
      price: 125,
      currency: 'USD',
      stock: {
        total: 142,
        by_warehouse: { 'W-LON-01': 42, 'W-NYC-01': 100 }
      },
      images: ['/products/blouse-metallic.jpg'],
      categories: ['Trend', 'Metallic'],
      materials: ['80% Silk', '20% Metallic Fiber'],
      ai_metadata: {
        trend_score: 94,
        style_dna: 'High-gloss Futurism'
      }
    },
    {
      id: 'p-2',
      name: 'Wide-Leg Wool Trousers',
      sku: 'TRS-WOL-SS26-42',
      price: 185,
      currency: 'USD',
      stock: {
        total: 89,
        by_warehouse: { 'W-LON-01': 89 }
      },
      images: ['/products/trousers-charcoal.jpg'],
      categories: ['Essentials'],
      materials: ['100% Virgin Wool'],
      ai_metadata: {
        trend_score: 72,
        style_dna: 'Modern Tailoring'
      }
    }
  ];

  return NextResponse.json({
    status: 'success',
    data: products,
    metadata: {
      total: products.length,
      page: 1,
      api_version: 'v1.2.4-stable'
    }
  });
}

/**
 * OPTIONS for CORS (Simulated)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
