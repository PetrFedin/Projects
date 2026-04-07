
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { achievements as allAchievements } from "@/lib/achievements";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function Achievements() {
    const [achievements, setAchievements] = useState(allAchievements);

    useEffect(() => {
        // Simulate unlocking an achievement after a delay
        const timer = setTimeout(() => {
            setAchievements(prev => prev.map(ach => 
                ach.id === 'stylist' ? { ...ach, achieved: true } : ach
            ));
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Достижения</CardTitle>
                <CardDescription>Ваши награды за активность на платформе Syntha.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements.map(ach => (
                    <Card key={ach.id} className={cn("flex items-start gap-3 p-4 transition-opacity", !ach.achieved && "opacity-40 hover:opacity-100")}>
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0", ach.achieved ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
                            <ach.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-grow">
                             <div className="flex justify-between items-center">
                                <p className="font-semibold">{ach.title}</p>
                                {ach.achieved && <Check className="h-5 w-5 text-green-500" />}
                             </div>
                            <p className="text-sm text-muted-foreground">{ach.description}</p>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
