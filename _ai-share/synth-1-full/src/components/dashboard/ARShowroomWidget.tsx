'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Camera, Maximize2, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useB2BState } from '@/providers/b2b-state';
import { useState } from 'react';

export function ARShowroomWidget() {
  const { b2bCart } = useB2BState();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Get products with 3D models (mock)
  const productsWithAR = b2bCart.slice(0, 3).map(item => ({
    ...item,
    has3D: true,
    hasAR: item.id === '1' || item.id === '2',
    hasVideo: true
  }));
  
  if (productsWithAR.length === 0) {
    return (
      <Card className="border-2 border-indigo-100 shadow-xl rounded-xl">
        <CardContent className="p-3 text-center">
          <Eye className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="font-black text-slate-900 mb-2">No Products in Cart</h3>
          <p className="text-sm text-slate-500">Add products to preview in AR</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 border-indigo-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
                Virtual Showroom
              </CardTitle>
              <p className="text-[10px] text-slate-500 font-medium">
                3D & AR Preview
              </p>
            </div>
          </div>
          
          <Badge className="bg-indigo-600 text-white text-[7px] font-black uppercase animate-pulse">
            ✨ AI POWERED
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {productsWithAR.map((product) => (
          <div 
            key={product.id}
            className={cn(
              "p-4 rounded-xl border-2 transition-all cursor-pointer",
              selectedProduct === product.id 
                ? "bg-indigo-50 border-indigo-300" 
                : "bg-slate-50 border-slate-200 hover:border-indigo-200"
            )}
            onClick={() => setSelectedProduct(product.id)}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                {product.hasAR && (
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black uppercase text-slate-900 leading-tight mb-2">
                  {product.name}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {product.has3D && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 text-[8px] font-black uppercase"
                    >
                      <Maximize2 className="mr-1 h-3 w-3" />
                      3D View
                    </Button>
                  )}
                  
                  {product.hasAR && (
                    <Button 
                      size="sm"
                      className="h-7 text-[8px] font-black uppercase bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Camera className="mr-1 h-3 w-3" />
                      Try AR
                    </Button>
                  )}
                  
                  {product.hasVideo && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 text-[8px] font-black uppercase"
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Catwalk
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {selectedProduct === product.id && (
              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-100">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <Eye className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                    <p className="text-sm font-black text-indigo-900 uppercase">
                      3D Viewer
                    </p>
                    <p className="text-[10px] text-indigo-600">
                      Rotate • Zoom • Inspect Details
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 h-8 text-[8px] font-black uppercase"
                  >
                    <Maximize2 className="mr-1 h-3 w-3" />
                    Fullscreen
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 h-8 text-[8px] font-black uppercase"
                  >
                    Share View
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-indigo-900 uppercase mb-1">
                AR Try-On Available
              </p>
              <p className="text-[9px] text-indigo-700 leading-relaxed">
                Use your device camera to see how products look in real environment. 
                Works best with bags, accessories, and footwear.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
