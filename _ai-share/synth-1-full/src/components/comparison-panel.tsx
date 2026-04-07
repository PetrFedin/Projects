'use client';

import { useState } from "react";
import { useUIState } from "@/providers/ui-state";
import { Button } from "./ui/button";
import { X, Scale, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import ProductCard from "./product-card";

export default function ComparisonPanel() {
    const { comparisonList, toggleComparisonItem, clearComparisonList, isComparisonOpen, setIsComparisonOpen, saveComparison } = useUIState();
    const [isSaving, setIsSaving] = useState(false);
    const [comparisonName, setComparisonName] = useState("");
    const { toast } = useToast();

    if (comparisonList.length === 0 && !isComparisonOpen) {
        return null;
    }

    const openModal = () => setIsComparisonOpen(true);
    
    const handleSave = () => {
        if (comparisonName.trim() === "") {
            toast({
                variant: 'destructive',
                title: 'Введите название',
                description: 'Пожалуйста, дайте название вашему сравнению.'
            });
            return;
        }
        saveComparison(comparisonName);
        toast({
            title: 'Сравнение сохранено',
            description: `Список "${comparisonName}" добавлен в ваш профиль.`
        });
        setIsSaving(false);
        setComparisonName("");
    }

    return (
        <>
            {/* Bottom Bar Trigger */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-2xl animate-in slide-in-from-bottom-full duration-500">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Scale className="h-5 w-5" />
                                Сравнение ({comparisonList.length}/4)
                            </h3>
                             <div className="flex -space-x-4">
                                {comparisonList.map(p => (
                                    <div key={p.id} className="relative h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={openModal} disabled={comparisonList.length < 1}>Сравнить</Button>
                            <Button variant="ghost" size="sm" onClick={clearComparisonList}>
                                <X className="mr-1 h-4 w-4" />
                                Очистить
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Dialog */}
            <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
                 <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-sm">Сравнение товаров</DialogTitle>
                         <DialogDescription>
                            Сравните до 4 товаров бок о бок.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 -mx-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-6">
                            {comparisonList.map(product => (
                                <div key={product.id} className="border rounded-lg flex flex-col">
                                    <div className="relative p-2">
                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 z-10 bg-background/50 backdrop-blur-sm" onClick={() => toggleComparisonItem(product)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <ProductCard product={product} />
                                    </div>
                                    <div className="p-4 border-t space-y-3 text-sm">
                                       <div className="flex justify-between">
                                            <span className="text-muted-foreground">Категория</span>
                                            <span className="font-medium">{product.subcategory || product.category}</span>
                                        </div>
                                         <div className="flex justify-between">
                                            <span className="text-muted-foreground">Сезон</span>
                                            <span className="font-medium">{product.season}</span>
                                        </div>
                                         <div className="flex justify-between">
                                            <span className="text-muted-foreground">Состав</span>
                                            <span className="font-medium truncate max-w-[150px]">{product.material}</span>
                                         </div>
                                    </div>
                                </div>
                            ))}
                             {[...Array(Math.max(0, 2 - comparisonList.length))].map((_, i) => (
                                 <div key={`placeholder-${i}`} className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center text-muted-foreground p-4 min-h-[300px]">
                                    <Scale className="h-10 w-10 mb-4" />
                                    <h4 className="font-semibold">Добавьте товар для сравнения</h4>
                                 </div>
                             ))}
                        </div>
                    </ScrollArea>
                     <DialogFooter className="pt-4 border-t items-center">
                        {isSaving ? (
                             <div className="flex w-full sm:w-auto gap-2">
                                <Input 
                                    placeholder="Название для сравнения..." 
                                    value={comparisonName}
                                    onChange={(e) => setComparisonName(e.target.value)}
                                    className="sm:w-64"
                                />
                                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Сохранить</Button>
                                <Button variant="ghost" onClick={() => setIsSaving(false)}>Отмена</Button>
                            </div>
                        ) : (
                             <Button variant="outline" onClick={() => setIsSaving(true)}>
                                <Save className="mr-2 h-4 w-4" /> Сохранить сравнение
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setIsComparisonOpen(false)} className="sm:ml-auto">Закрыть</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
