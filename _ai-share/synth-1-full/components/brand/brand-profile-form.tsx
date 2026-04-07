'use client';

import { useState } from 'react';
import type { Brand } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import BrandCard from '../brand-card';
import Image from 'next/image';

interface BrandProfileFormProps {
    brand: Brand;
    onUpdate: (updatedBrand: Brand) => void;
}

export default function BrandProfileForm({ brand: initialBrand, onUpdate }: BrandProfileFormProps) {
    const [brand, setBrand] = useState(initialBrand);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedBrand = { ...brand, [name]: value };
        setBrand(updatedBrand);
        onUpdate(updatedBrand); // Update parent for live preview
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: 'Профиль бренда сохранен',
                description: 'Ваши данные были успешно обновлены.',
            });
            // In a real app, you might refetch data or confirm the update
        }, 1500);
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Редактировать профиль бренда</CardTitle>
                        <CardDescription>
                            Эта информация будет отображаться на вашей публичной странице и карточках.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Название бренда</Label>
                            <Input
                                id="name"
                                name="name"
                                value={brand.name}
                                onChange={handleInputChange}
                                placeholder="Например, Syntha"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={brand.description}
                                onChange={handleInputChange}
                                placeholder="Расскажите о своем бренде..."
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Логотип</Label>
                             <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-md border p-1 bg-muted/30">
                                    <Image
                                        src={brand.logo.url}
                                        alt={brand.logo.alt}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <Button variant="outline">
                                    <Upload className="mr-2" />
                                    Загрузить новый
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 animate-spin" />}
                            Сохранить изменения
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Предпросмотр</CardTitle>
                         <CardDescription>
                            Так ваша карточка будет выглядеть в каталоге брендов.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <BrandCard brand={brand} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
