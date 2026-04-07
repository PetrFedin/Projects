'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gem, Rocket } from "lucide-react";

const metrics = {
    clv: 128500,
    rfm: {
        recency: 5,
        frequency: 8,
        monetary: 9,
        segment: 'Лояльные чемпионы',
        segmentColor: 'bg-green-500'
    },
    loyaltyScore: 850,
    influenceScore: 75
};

export function KeyMetrics() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer Lifetime Value (CLV)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{metrics.clv.toLocaleString('ru-RU')} ₽</div>
                    <p className="text-xs text-muted-foreground">+15% прогнозируемый рост</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">RFM Сегментация</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-bold">{metrics.rfm.segment}</div>
                        <Badge className={`${metrics.rfm.segmentColor} text-white`}>R{metrics.rfm.recency} F{metrics.rfm.frequency} M{metrics.rfm.monetary}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Недавность: {metrics.rfm.recency}, Частота: {metrics.rfm.frequency}, Деньги: {metrics.rfm.monetary}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Loyalty Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                         <Gem className="h-8 w-8 text-blue-500"/>
                        <div className="text-4xl font-bold">{metrics.loyaltyScore}</div>
                    </div>
                    <p className="text-xs text-muted-foreground">Платиновый уровень</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Influence Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Rocket className="h-8 w-8 text-amber-500"/>
                        <div className="text-4xl font-bold">{metrics.influenceScore}</div>
                    </div>
                    <p className="text-xs text-muted-foreground">Высокий потенциал влияния</p>
                </CardContent>
            </Card>
        </div>
    )
}
