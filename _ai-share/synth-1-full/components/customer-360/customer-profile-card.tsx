'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Ruler, Smartphone, MapPin, Palette } from "lucide-react";

const profileData = {
    personal: { name: 'Анна Новикова', dob: '25.08.1995', gender: 'Женский', city: 'Москва', language: 'Русский' },
    interests: {
        categories: ['Casual', 'Streetwear'],
        brands: ['Syntha', 'A.P.C.'],
        colors: ['#000000', '#F6F2EC', '#C9B9A6']
    },
    body: { height: '172 см', weight: '60 кг', type: 'Песочные часы' },
    devices: [
        { type: 'web', browser: 'Chrome', os: 'macOS' },
        { type: 'mobile', model: 'iPhone 15 Pro', os: 'iOS 17' }
    ],
    geo: ['Москва', 'Санкт-Петербург', 'Сочи']
};

export function CustomerProfileCard() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Анкета клиента</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Личные данные</h4>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">ФИО:</strong> {profileData.personal.name}</p>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">Дата рождения:</strong> {profileData.personal.dob}</p>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">Пол:</strong> {profileData.personal.gender}</p>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">Город:</strong> {profileData.personal.city}</p>
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold flex items-center"><Ruler className="mr-2 h-4 w-4 text-muted-foreground"/>Параметры тела</h4>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">Рост:</strong> {profileData.body.height}</p>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">Вес:</strong> {profileData.body.weight}</p>
                        <p className="text-sm"><strong className="font-medium text-muted-foreground">Тип фигуры:</strong> {profileData.body.type}</p>
                    </div>
                     <div className="space-y-4 sm:col-span-2">
                        <h4 className="font-semibold flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/>Интересы</h4>
                        <p className="text-sm font-medium text-muted-foreground">Категории:</p>
                        <div className="flex flex-wrap gap-2">{profileData.interests.categories.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
                        <p className="text-sm font-medium text-muted-foreground">Бренды:</p>
                        <div className="flex flex-wrap gap-2">{profileData.interests.brands.map(b => <Badge key={b} variant="secondary">{b}</Badge>)}</div>
                        <p className="text-sm font-medium text-muted-foreground">Цветовая палитра:</p>
                        <div className="flex gap-2">{profileData.interests.colors.map(color => <div key={color} className="h-6 w-6 rounded-full border" style={{ backgroundColor: color }}></div>)}</div>
                    </div>
                </CardContent>
            </Card>
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><Smartphone className="mr-2 h-4 w-4"/>Устройства</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {profileData.devices.map(d => (
                            <div key={d.model || d.browser} className="text-sm">
                                <p className="font-semibold">{d.model || d.browser}</p>
                                <p className="text-muted-foreground">{d.os}</p>
                            </div>
                       ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><MapPin className="mr-2 h-4 w-4"/>Геоистория</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       {profileData.geo.map(city => <p key={city} className="text-sm">{city}</p>)}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
