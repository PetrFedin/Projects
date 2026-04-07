
'use client';

import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Wand2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { Product, UserProfile } from '@/lib/types';
import { useUIState } from '@/providers/ui-state';

interface SizeGuideDialogProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function SizeGuideDialog({ product, isOpen, onOpenChange }: SizeGuideDialogProps) {
    const { user } = useUIState();
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const getFieldsForCategory = () => {
        const category = product.category;
        const subcategory = product.subcategory;

        if (category === 'Обувь') {
            return [{ id: 'footLength', label: 'Длина стопы (см)', placeholder: 'Напр. 25' }];
        }
        if (subcategory === 'Ремни') {
             return [{ id: 'waist', label: 'Обхват талии (см)', placeholder: 'Напр. 75' }];
        }
        if (subcategory === 'Головные уборы') {
            return [{ id: 'headCircumference', label: 'Обхват головы (см)', placeholder: 'Напр. 57' }];
        }
        // Default to clothing measurements
        return [{ id: 'height', label: 'Рост (см)', placeholder: 'Напр. 175' }, { id: 'weight', label: 'Вес (кг)', placeholder: 'Напр. 65' }];
    }
    
    const fields = getFieldsForCategory();

    useEffect(() => {
        // Reset state when dialog opens or product changes
        if (isOpen) {
            setRecommendation(null);
            // Pre-fill from user profile
            const userMeasurements = user?.measurements || {};
            const initialInputs: Record<string, string> = {};
            fields.forEach(field => {
                if (userMeasurements[field.id as keyof typeof userMeasurements]) {
                    initialInputs[field.id] = String(userMeasurements[field.id as keyof typeof userMeasurements]);
                } else {
                    initialInputs[field.id] = '';
                }
            });
            setInputs(initialInputs);
        }
    }, [isOpen, product, user]);


    const canAnalyze = fields.every(field => inputs[field.id] && inputs[field.id].trim() !== '');

    const handleInputChange = (id: string, value: string) => {
        setInputs(prev => ({...prev, [id]: value}));
    }

    const handleAnalyze = async () => {
        if (!canAnalyze) return;
        setIsLoading(true);
        setRecommendation(null);
        try {
            const sizeChart = product.sizeChart ? String(product.sizeChart) : "S: 44-46, M: 48-50, L: 52-54, XL: 56-58";
            const res = await fetch("/api/ai/suggest-size", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: product.name,
                    category: product.category || product.subcategory || "Одежда",
                    sizeChart,
                    userHeight: inputs.height ? Number(inputs.height) : undefined,
                    userWeight: inputs.weight ? Number(inputs.weight) : undefined,
                    userWaist: inputs.waist ? Number(inputs.waist) : undefined,
                    userQuestion: inputs.footLength ? `Длина стопы: ${inputs.footLength} см` : undefined,
                }),
            });
            const data = await res.json();
            const parts = [data.recommendation];
            if (data.suggestedSize) parts.unshift(`Рекомендуемый размер: ${data.suggestedSize}.`);
            if (data.tips?.length) parts.push(data.tips.join(" "));
            setRecommendation(parts.join(" "));
        } catch {
            const allSizes = product.sizes?.map(s => s.name) || [];
            const recommendedSize = allSizes.length > 0 ? allSizes[0] : "M";
            setRecommendation(`Рекомендуем размер ${recommendedSize}. Ориентируйтесь на таблицу размеров на странице товара.`);
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleClose = () => {
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Гид по размерам для "{product.name}"</DialogTitle>
                    <DialogDescription>
                        Введите свои параметры, чтобы AI подобрал для вас идеальный размер.
                    </DialogDescription>
                </DialogHeader>
                
                {fields.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-3 py-4">
                            {fields.map(field => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id}>{field.label}</Label>
                                    <Input 
                                        id={field.id} 
                                        value={inputs[field.id] || ''} 
                                        onChange={(e) => handleInputChange(field.id, e.target.value)} 
                                        placeholder={field.placeholder} 
                                        type="number"
                                    />
                                </div>
                            ))}
                        </div>

                        {isLoading && (
                            <div className="flex justify-center items-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        )}

                        {recommendation && (
                            <Alert>
                                <Wand2 className="h-4 w-4" />
                                <AlertTitle>Рекомендация AI</AlertTitle>
                                <AlertDescription>
                                    {recommendation}
                                </AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Закрыть</Button>
                            <Button onClick={handleAnalyze} disabled={!canAnalyze || isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Подобрать размер
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-4">
                         <Alert>
                            <AlertTitle>Стандартный размер</AlertTitle>
                            <AlertDescription>
                                Этот товар представлен в едином размере.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
