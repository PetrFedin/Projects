import React from 'react';
import { Building, MapPin, Clock, Phone, Map } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RetailerListDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    retailStores: any[];
    displayName: string;
}

export function RetailerListDialog({ isOpen, onOpenChange, retailStores = [], displayName }: RetailerListDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden rounded-xl p-0 border-none bg-background shadow-2xl flex flex-col">
                <DialogHeader className="p-3 pb-6 bg-muted/5 shrink-0 border-b border-muted/10">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Building className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-black tracking-tighter uppercase leading-none">Точки продаж</DialogTitle>
                            <DialogDescription className="text-sm font-medium mt-1.5">Где купить {displayName} в вашем городе</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                
                <ScrollArea className="flex-1 p-3 pt-6">
                    <div className="space-y-10">
                        {['Москва', 'Санкт-Петербург', 'Другие города'].map(city => {
                            const stores = (retailStores || []).filter(s => city === 'Другие города' ? (s.city !== 'Москва' && s.city !== 'Санкт-Петербург') : s.city === city);
                            if (stores.length === 0) return null;
                            
                            return (
                                <div key={city} className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-accent/10 pb-2 ml-2">{city}</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {stores.map((store, i) => (
                                            <Card key={i} className="p-4 rounded-3xl border border-muted/20 bg-muted/5 group hover:bg-white hover:border-accent/20 hover:shadow-xl transition-all duration-500">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="space-y-3">
                                                        <h5 className="font-black text-sm uppercase tracking-tight group-hover:text-accent transition-colors">{store.name}</h5>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                <span className="text-xs font-bold">{store.address}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                <span className="text-xs font-bold">{store.hours}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Phone className="h-3.5 w-3.5" />
                                                                <span className="text-xs font-bold">{store.phone}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 bg-white shadow-sm border border-muted/10 group-hover:bg-accent group-hover:text-white transition-all">
                                                        <Map className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
                
                <div className="p-4 bg-muted/5 border-t border-muted/10 flex justify-center shrink-0">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                        Бренд также представлен в более чем 50 мультибрендовых бутиках по всей России
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
