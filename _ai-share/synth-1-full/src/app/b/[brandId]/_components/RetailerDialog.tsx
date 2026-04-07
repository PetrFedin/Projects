'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MapPin, Phone, Mail, Instagram, Send, Youtube } from 'lucide-react';

interface RetailerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brandName: string;
}

export function RetailerDialog({ isOpen, onOpenChange, brandName }: RetailerDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <Tabs defaultValue="info" className="w-full">
                    <DialogHeader className="p-4 pb-4 bg-muted/5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-black tracking-tighter uppercase">Шоурум бренда</DialogTitle>
                                    <DialogDescription className="text-sm font-medium">{brandName}</DialogDescription>
                                </div>
                            </div>
                            <TabsList className="bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white text-[10px] font-black uppercase tracking-widest px-4">Инфо</TabsTrigger>
                                <TabsTrigger value="map" className="rounded-lg data-[state=active]:bg-white text-[10px] font-black uppercase tracking-widest px-4">Карта</TabsTrigger>
                            </TabsList>
                        </div>
                    </DialogHeader>

                    <div className="p-4 pt-2">
                        <TabsContent value="info" className="m-0 space-y-6 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Card className="p-4 rounded-3xl border-muted/20 bg-muted/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Социальные сети</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm border border-muted/20"><MapPin className="h-4 w-4 text-muted-foreground" /></div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">Адрес</p>
                                                <p className="text-sm font-black">г. Москва, ул. Петровка, 2 (ЦУМ, 3 этаж)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm border border-muted/20"><Phone className="h-4 w-4 text-muted-foreground" /></div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">Телефон</p>
                                                <p className="text-sm font-black">+7 (495) 933-73-00 (доб. 124)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm border border-muted/20"><Mail className="h-4 w-4 text-muted-foreground" /></div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">Email</p>
                                                <p className="text-sm font-black">showroom@syntha-lab.ai</p>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-2 flex gap-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm border border-muted/20 hover:text-accent cursor-pointer transition-colors"><Instagram className="h-4 w-4" /></div>
                                            <div className="p-2 rounded-lg bg-white shadow-sm border border-muted/20 hover:text-accent cursor-pointer transition-colors"><Send className="h-4 w-4" /></div>
                                            <div className="p-2 rounded-lg bg-white shadow-sm border border-muted/20 hover:text-accent cursor-pointer transition-colors"><Youtube className="h-4 w-4" /></div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4 rounded-3xl border-muted/20 bg-muted/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Время работы</h4>
                                    <div className="space-y-3">
                                        {[
                                            { day: 'Пн – Пт', time: '10:00 – 22:00', active: true },
                                            { day: 'Сб – Вс', time: '11:00 – 21:00', active: true }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-muted/20 last:border-0">
                                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">{item.day}</span>
                                                <span className="text-sm font-black text-foreground">{item.time}</span>
                                            </div>
                                        ))}
                                        <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-green-700 uppercase">Сейчас открыто</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                                <p className="text-xs font-bold text-muted-foreground leading-relaxed text-center italic">
                                    «В нашем шоуруме вы можете не только примерить все изделия, но и воспользоваться услугой индивидуального снятия мерок для AI-гардероба.»
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="map" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-muted border-2 border-muted/20">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.025123456789!2d37.6176!3d55.7602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5c12345678%3A0x1234567890abcdef!2z0KbQo9Cc!5e0!3m2!1sru!2sru!4v1234567890123"
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-muted/20">
                                    <p className="text-[10px] font-black uppercase text-accent tracking-widest">Адрес для навигатора</p>
                                    <p className="text-xs font-bold mt-1">Москва, Петровка, 2</p>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
