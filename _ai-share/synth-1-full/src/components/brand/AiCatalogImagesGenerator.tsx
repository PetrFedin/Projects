'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ImageIcon, Loader2 } from 'lucide-react';
import {
  requestCatalogImageGeneration,
  getCatalogImageTypeLabel,
  type CatalogImageType,
} from '@/lib/ai/catalog-image-gen';

const IMAGE_TYPES: CatalogImageType[] = ['lifestyle', 'flat_lay', 'white_background', 'model'];

export function AiCatalogImagesGenerator() {
  const [sku, setSku] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageType, setImageType] = useState<CatalogImageType>('white_background');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResultUrl(null);
    setMessage(null);
    try {
      const res = await requestCatalogImageGeneration({
        sku: sku || undefined,
        productName: sku || undefined,
        prompt: prompt || undefined,
        imageType,
      });
      if (res.imageUrl) setResultUrl(res.imageUrl);
      if (res.message) setMessage(res.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="h-5 w-5" />
          AI-изображения каталога
        </CardTitle>
        <CardDescription>
          WizCommerce: генерация фото для каталога без съёмки — lifestyle, flat-lay, белый фон, на
          модели.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs">Артикул / название</Label>
          <Input
            placeholder="SKU или название продукта"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Тип изображения</Label>
          <div className="mt-1 flex flex-wrap gap-2">
            {IMAGE_TYPES.map((t) => (
              <Button
                key={t}
                variant={imageType === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageType(t)}
              >
                {getCatalogImageTypeLabel(t)}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs">Промпт (опционально)</Label>
          <Input
            placeholder="Например: летний свет, нейтральный фон"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Генерация...' : 'Сгенерировать изображение'}
        </Button>
        {message && <p className="text-text-secondary text-xs">{message}</p>}
        {resultUrl && (
          <div className="bg-bg-surface2 overflow-hidden rounded-lg border">
            <img src={resultUrl} alt="Generated catalog" className="max-h-64 w-full object-cover" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
