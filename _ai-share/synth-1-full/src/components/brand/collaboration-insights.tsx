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
    'syntha': ['Acne Studios', 'A.P.C.', 'Jil Sander'],
}

export default function CollaborationInsights({ brand, allProducts }: CollaborationInsightsProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const { toast } = useToast();

    // Find the product to feature - more robust selection
    const brandProducts = allProducts.filter(p => p.brand === brand.name || p.brandId === brand.id);
    const mainProduct = brandProducts[0] || allProducts.find(p => p.brand === brand.name);
    
    // Find a collaborative product (one that is NOT from this brand)
    const collabProduct = allProducts.find(p => p.brand !== brand.name && p.brandId !== brand.id);
    
    const overlappingBrands = audienceOverlap[brand.slug as keyof typeof audienceOverlap] || ['Acne Studios', 'A.P.C.', 'Stone Island'];

    const handleGenerate = async () => {
        if (!mainProduct || !collabProduct) {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Необходимые товары для генерации не найдены.' });
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            // Fetch both images and convert to data URIs
            const [res1, res2] = await Promise.all([
                fetch(mainProduct.images[0].url),
                fetch(collabProduct.images[0].url)
            ]);

            const [blob1, blob2] = await Promise.all([res1.blob(), res2.blob()]);

            const reader1 = new FileReader();
            const reader2 = new FileReader();

            const p1 = new Promise<string>(resolve => {
                reader1.onloadend = () => resolve(reader1.result as string);
                reader1.readAsDataURL(blob1);
            });
            const p2 = new Promise<string>(resolve => {
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
            toast({ variant: 'destructive', title: 'Ошибка генерации', description: 'Пожалуйста, попробуйте снова.' });
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-9 space-y-4">
                <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
                    <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner"><Handshake className="h-3.5 w-3.5" /></div>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 leading-none">AI Collaboration Proposal</CardTitle>
                        </div>
                        <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cross-brand partnership recommendations based on audience behavioral intelligence.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        {mainProduct && collabProduct ? (
                            <div className="space-y-4">
                                <Alert variant="default" className="bg-indigo-50/50 border-indigo-100 rounded-xl py-2.5">
                                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                                    <AlertTitle className="text-[10px] font-bold uppercase tracking-widest text-indigo-900 leading-none mb-1">Intelligence Match Found</AlertTitle>
                                    <AlertDescription className="text-[11px] text-slate-600 font-medium tracking-tight">
                                        Customers purchasing your <span className="font-bold text-indigo-600">{mainProduct.name}</span> exhibit 88% affinity overlap with <span className="font-bold text-slate-900">{collabProduct.name}</span> from <span className="font-bold">{collabProduct.brand}</span>.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex items-center justify-center gap-3 py-2">
                                    <div className="text-center space-y-2">
                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-lg border border-slate-200 group-hover:scale-105 transition-transform">
                                            <Image src={mainProduct.images[0].url} alt={mainProduct.name} fill className="object-cover"/>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-bold uppercase text-indigo-600 tracking-widest">{brand.name}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight truncate w-24">{mainProduct.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold shadow-inner text-xs">
                                        +
                                    </div>

                                    <div className="text-center space-y-2">
                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-lg border border-slate-200 group-hover:scale-105 transition-transform">
                                            <Image src={collabProduct.images[0].url} alt={collabProduct.name} fill className="object-cover"/>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-bold uppercase text-slate-900 tracking-widest">{collabProduct.brand}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight truncate w-24">{collabProduct.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">
                                    Generate a collaborative visual concept to drive cross-brand conversion.
                                </p>
                            </div>
                        ) : (
                             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground p-4 text-center border-2 border-dashed rounded-xl">Insufficient data for generation.</p>
                        )}
                    </CardContent>
                </Card>

                 <Card className="rounded-xl border border-slate-800 bg-slate-900 text-white p-3 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Wand2 className="h-24 w-24 text-indigo-400" />
                    </div>
                    <CardHeader className="p-0 mb-4 relative z-10">
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform">
                                <Sparkles className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 leading-none">Creative AI</span>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white leading-none">Collaborative Lookbook Generation</CardTitle>
                            </div>
                        </div>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-tight text-slate-400 italic">Synthesize a unified visual narrative combining disparate brand elements.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center relative z-10 p-0">
                        <div className="flex items-center justify-center border border-white/10 rounded-xl p-3 bg-white/5 min-h-[280px] relative overflow-hidden group-hover:bg-white/10 transition-all shadow-inner">
                            {isGenerating && (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400"/>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 animate-pulse">Synthesis in progress...</p>
                                </div>
                            )}
                            {!isGenerating && generatedImage && (
                                <div className="relative w-full h-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border border-white/10">
                                    <Image src={generatedImage} alt="Synthesized Lookbook" fill className="object-cover" />
                                </div>
                            )}
                            {!isGenerating && !generatedImage && (
                                <div className="text-center space-y-2 opacity-30">
                                    <Wand2 className="h-10 w-10 mx-auto mb-1" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest">Output Ready for Synthesis</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-3">
                             <p className="text-[11px] font-bold uppercase tracking-tight leading-relaxed italic text-slate-400">
                                "Execute creative synthesis to produce a high-fidelity marketing asset unifying your SKU with partner catalog elements."
                             </p>
                             <Button 
                                onClick={handleGenerate} 
                                disabled={isGenerating || !mainProduct || !collabProduct}
                                className="w-full h-9 bg-white text-slate-900 hover:bg-indigo-50 rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-xl transition-all"
                             >
                                {isGenerating ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin"/> : <Wand2 className="mr-2 h-3.5 w-3.5" />}
                                Synthesize Visuals
                            </Button>
                        </div>
                    </CardContent>
                    <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700" />
                </Card>
            </div>

            <div className="lg:col-span-3 space-y-4">
                <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
                    <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner"><Users className="h-3.5 w-3.5" /></div>
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Audience Overlap</CardTitle>
                        </div>
                        <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">High-affinity cross-brand follows.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5 p-3.5">
                        {overlappingBrands.map(brandName => (
                            <div key={brandName} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Avatar className="h-8 w-8 border border-white shadow-sm shrink-0">
                                        <AvatarImage src={`https://picsum.photos/seed/${brandName.toLowerCase()}/32/32`} />
                                        <AvatarFallback>{brandName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-bold text-[10px] uppercase text-slate-900 tracking-tight truncate leading-none">{brandName}</p>
                                        <p className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest mt-1">84% Overlap</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                    <ArrowRight className="h-3 w-3 text-slate-400" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full mt-2 h-8 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                            View Network
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
