'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Handshake, Users, ArrowRight, Wand2, Loader2, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Brand, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateCollaborativeLookbook } from '@/ai/flows/generate-collaborative-lookbook';

interface CollaborationInsightsProps {
  brand: Brand;
  allProducts: Product[];
}

// Mock data, in a real app this would come from an analytics engine
const audienceOverlap = {
  syntha: ['Acne Studios', 'A.P.C.', 'Jil Sander'],
};

export default function CollaborationInsights({ brand, allProducts }: CollaborationInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Find the product to feature - more robust selection
  const brandProducts = allProducts.filter((p) => p.brand === brand.name || p.brandId === brand.id);
  const mainProduct = brandProducts[0] || allProducts.find((p) => p.brand === brand.name);

  // Find a collaborative product (one that is NOT from this brand)
  const collabProduct = allProducts.find((p) => p.brand !== brand.name && p.brandId !== brand.id);

  const overlappingBrands = audienceOverlap[brand.slug as keyof typeof audienceOverlap] || [
    'Acne Studios',
    'A.P.C.',
    'Stone Island',
  ];

  const handleGenerate = async () => {
    if (!mainProduct || !collabProduct) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Необходимые товары для генерации не найдены.',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Fetch both images and convert to data URIs
      const [res1, res2] = await Promise.all([
        fetch(mainProduct.images[0].url),
        fetch(collabProduct.images[0].url),
      ]);

      const [blob1, blob2] = await Promise.all([res1.blob(), res2.blob()]);

      const reader1 = new FileReader();
      const reader2 = new FileReader();

      const p1 = new Promise<string>((resolve) => {
        reader1.onloadend = () => resolve(reader1.result as string);
        reader1.readAsDataURL(blob1);
      });
      const p2 = new Promise<string>((resolve) => {
        reader2.onloadend = () => resolve(reader2.result as string);
        reader2.readAsDataURL(blob2);
      });

      const [uri1, uri2] = await Promise.all([p1, p2]);

      const result = await generateCollaborativeLookbook({
        productOneName: mainProduct.name,
        productOneImageDataUri: uri1,
        productTwoName: collabProduct.name,
        productTwoImageDataUri: uri2,
      });

      if (result.creativeImageUrl) {
        setGeneratedImage(result.creativeImageUrl);
        toast({ title: 'Совместный лукбук создан!' });
      } else {
        throw new Error('AI не удалось сгенерировать изображение.');
      }
    } catch (error) {
      console.error('Ошибка генерации совместного лукбука:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка генерации',
        description: 'Пожалуйста, попробуйте снова.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-9">
        <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner">
                <Handshake className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-sm font-bold uppercase leading-none tracking-widest text-slate-900">
                AI Collaboration Proposal
              </CardTitle>
            </div>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Cross-brand partnership recommendations based on audience behavioral intelligence.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {mainProduct && collabProduct ? (
              <div className="space-y-4">
                <Alert
                  variant="default"
                  className="rounded-xl border-indigo-100 bg-indigo-50/50 py-2.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <AlertTitle className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-indigo-900">
                    Intelligence Match Found
                  </AlertTitle>
                  <AlertDescription className="text-[11px] font-medium tracking-tight text-slate-600">
                    Customers purchasing your{' '}
                    <span className="font-bold text-indigo-600">{mainProduct.name}</span> exhibit
                    88% affinity overlap with{' '}
                    <span className="font-bold text-slate-900">{collabProduct.name}</span> from{' '}
                    <span className="font-bold">{collabProduct.brand}</span>.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="space-y-2 text-center">
                    <div className="relative h-32 w-24 overflow-hidden rounded-xl border border-slate-200 shadow-lg transition-transform group-hover:scale-105">
                      <Image
                        src={mainProduct.images[0].url}
                        alt={mainProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-600">
                        {brand.name}
                      </p>
                      <p className="w-24 truncate text-[8px] font-bold uppercase tracking-tight text-slate-400">
                        {mainProduct.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 shadow-inner">
                    +
                  </div>

                  <div className="space-y-2 text-center">
                    <div className="relative h-32 w-24 overflow-hidden rounded-xl border border-slate-200 shadow-lg transition-transform group-hover:scale-105">
                      <Image
                        src={collabProduct.images[0].url}
                        alt={collabProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-900">
                        {collabProduct.brand}
                      </p>
                      <p className="w-24 truncate text-[8px] font-bold uppercase tracking-tight text-slate-400">
                        {collabProduct.name}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[9px] font-bold uppercase italic tracking-widest text-slate-400 opacity-60">
                  Generate a collaborative visual concept to drive cross-brand conversion.
                </p>
              </div>
            ) : (
              <p className="rounded-xl border-2 border-dashed p-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Insufficient data for generation.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-3 text-white shadow-lg">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <Wand2 className="h-24 w-24 text-indigo-400" />
          </div>
          <CardHeader className="relative z-10 mb-4 p-0">
            <div className="mb-1.5 flex items-center gap-2.5">
              <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-2 shadow-lg transition-transform group-hover:scale-105">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-300">
                  Creative AI
                </span>
                <CardTitle className="text-sm font-bold uppercase leading-none tracking-widest text-white">
                  Collaborative Lookbook Generation
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase italic tracking-tight text-slate-400">
              Synthesize a unified visual narrative combining disparate brand elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 grid grid-cols-1 items-center gap-3 p-0 md:grid-cols-2">
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 shadow-inner transition-all group-hover:bg-white/10">
              {isGenerating && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                  <p className="animate-pulse text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                    Synthesis in progress...
                  </p>
                </div>
              )}
              {!isGenerating && generatedImage && (
                <div className="relative aspect-[3/4] h-full w-full overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                  <Image
                    src={generatedImage}
                    alt="Synthesized Lookbook"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {!isGenerating && !generatedImage && (
                <div className="space-y-2 text-center opacity-30">
                  <Wand2 className="mx-auto mb-1 h-10 w-10" />
                  <p className="text-[9px] font-bold uppercase tracking-widest">
                    Output Ready for Synthesis
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-3">
              <p className="text-[11px] font-bold uppercase italic leading-relaxed tracking-tight text-slate-400">
                "Execute creative synthesis to produce a high-fidelity marketing asset unifying your
                SKU with partner catalog elements."
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !mainProduct || !collabProduct}
                className="h-9 w-full rounded-lg bg-white text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-indigo-50"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-3.5 w-3.5" />
                )}
                Synthesize Visuals
              </Button>
            </div>
          </CardContent>
          <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20" />
        </Card>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
            <div className="mb-1 flex items-center gap-2">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner">
                <Users className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                Audience Overlap
              </CardTitle>
            </div>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              High-affinity cross-brand follows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 p-3.5">
            {overlappingBrands.map((brandName) => (
              <div
                key={brandName}
                className="group flex items-center justify-between rounded-xl border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar className="h-8 w-8 shrink-0 border border-white shadow-sm">
                    <AvatarImage
                      src={`https://picsum.photos/seed/${brandName.toLowerCase()}/32/32`}
                    />
                    <AvatarFallback>{brandName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-bold uppercase leading-none tracking-tight text-slate-900">
                      {brandName}
                    </p>
                    <p className="mt-1 text-[7px] font-bold uppercase tracking-widest text-emerald-500">
                      84% Overlap
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md opacity-0 transition-all group-hover:opacity-100"
                >
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              className="mt-2 h-8 w-full rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
            >
              View Network
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
