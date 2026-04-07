'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilePlus, 
  Users, 
  LayoutGrid, 
  Send, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Settings2,
  Lock,
  ArrowRight,
  Share2,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function LinesheetCreator() {
  const { viewRole } = useUIState();
  const { customLinesheets, addLinesheet } = useB2BState();
  const [isCreating, setIsCreating] = useState(false);
  const [newSheet, setNewSheet] = useState({
    title: '',
    retailerId: '',
    products: [] as string[]
  });

  const retailers = [
    { id: 'ret-1', name: 'Premium Store HQ', location: 'Moscow' },
    { id: 'ret-2', name: 'Urban Elite', location: 'Dubai' },
    { id: 'ret-3', name: 'Minimalist Boutique', location: 'Milan' }
  ];

  const handleCreate = () => {
    if (!newSheet.title || !newSheet.retailerId) return;
    addLinesheet({
      id: Math.random().toString(36).substr(2, 9),
      brandId: 'brand-1',
      retailerId: newSheet.retailerId,
      title: newSheet.title,
      products: ['1', '2'], // Mock products
      customPrices: {},
      status: 'sent',
      viewCount: 0,
      createdAt: new Date().toISOString()
    });
    setIsCreating(false);
    setNewSheet({ title: '', retailerId: '', products: [] });
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Share2 className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              Sales_Hub_v2.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Custom Linesheets
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Create personalized collection subsets for specific retailers with custom pricing and private access.
          </p>
        </div>

        <Button 
          onClick={() => setIsCreating(true)}
          className="h-10 bg-slate-900 text-white rounded-[1.5rem] px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-slate-200 hover:scale-105 transition-all"
        >
          <FilePlus className="h-5 w-5" /> New Linesheet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Active Linesheets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Sent & Active</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sort by:</span>
              <select className="bg-transparent border-none text-[10px] font-black text-slate-900 focus:ring-0 uppercase">
                <option>Latest Created</option>
                <option>Highest Views</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {customLinesheets.length === 0 ? (
              <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No custom linesheets yet</p>
              </div>
            ) : (
              customLinesheets.map((sheet) => (
                <Card key={sheet.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden hover:scale-[1.01] transition-all">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4 gap-3">
                      <div className="h-20 w-20 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100">
                        <LayoutGrid className="h-8 w-8 text-indigo-200" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{sheet.title}</h4>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5",
                            sheet.status === 'sent' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                          )}>
                            {sheet.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Users className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase">{retailers.find(r => r.id === sheet.retailerId)?.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase">{new Date(sheet.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 pr-4 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-slate-300" />
                          <span className="text-base font-black text-slate-900">{sheet.viewCount}</span>
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Views</p>
                      </div>
                      <div className="flex items-center gap-2 pl-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50">
                          <Settings2 className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button className="h-12 w-12 rounded-xl bg-slate-900 text-white p-0 shadow-lg shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Analytics & Stats Sidebar */}
        <div className="space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Conversion Intelligence</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-indigo-600 uppercase">Avg. View-to-Order</p>
                  <p className="text-sm font-black text-slate-900">64%</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Top Retailer</p>
                  <p className="text-sm font-black text-slate-900 mt-1">TSUM HQ</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Open Rate</p>
                  <p className="text-sm font-black text-slate-900 mt-1">92.4%</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-black uppercase text-[9px] tracking-widest gap-2">
              View Detailed Sales Report
            </Button>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight">Private Access Control</h4>
            </div>
            <p className="text-[10px] font-medium text-white/60 leading-relaxed">
              Enable "Invite Only" mode for premium drops. Linesheets will be accessible only via encrypted personal links.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[9px] font-black uppercase tracking-widest">Master Key Status</span>
              <Badge className="bg-emerald-500 text-white border-none font-black text-[8px]">ACTIVE</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Modal Overlay */}
      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Create New Hub</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="rounded-full">
                    <Trash2 className="h-5 w-5 text-slate-400" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Internal Title</label>
                    <Input 
                      placeholder="e.g., VIP FW26 Preview - Dubai Mall" 
                      className="h-10 rounded-2xl bg-slate-50 border-none focus-visible:ring-indigo-500"
                      value={newSheet.title}
                      onChange={(e) => setNewSheet({...newSheet, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Target Retailer</label>
                    <div className="grid grid-cols-1 gap-2">
                      {retailers.map(r => (
                        <button 
                          key={r.id}
                          onClick={() => setNewSheet({...newSheet, retailerId: r.id})}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl transition-all border",
                            newSheet.retailerId === r.id ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-transparent hover:bg-slate-100"
                          )}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black uppercase text-slate-900">{r.name}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">{r.location}</span>
                          </div>
                          {newSheet.retailerId === r.id && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1 h-10 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</Button>
                  <Button 
                    onClick={handleCreate}
                    disabled={!newSheet.title || !newSheet.retailerId}
                    className="flex-1 h-10 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200"
                  >
                    Generate & Send <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
