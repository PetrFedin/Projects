'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Share2, 
  Search, 
  Plus, 
  MoreVertical, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Upload,
  ExternalLink,
  Eye,
  Filter,
  FileCheck,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function DocumentManagementSystem() {
  const { b2bDocuments, uploadB2bDocument } = useB2BState();
  const [selectedDoc, setSelectedDoc] = useState<B2BDocument | null>(null);

  const getDocIcon = (type: string) => {
    switch(type) {
      case 'contract': return <ShieldCheck className="h-6 w-6 text-emerald-500" />;
      case 'invoice': return <FileCheck className="h-6 w-6 text-indigo-500" />;
      default: return <FileText className="h-6 w-6 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
              DMS_VAULT_v3.1
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Secure Document<br/>Repository
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Legally-binding storage for contracts, invoices, and technical specifications. Share securely with global partners and logistics providers.
          </p>
        </div>

        <div className="flex gap-3">
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              <Archive className="h-4 w-4" /> View Archive
           </Button>
           <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
              <Upload className="h-4 w-4" /> Upload Document
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Document Browser */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input placeholder="Search documents..." className="pl-12 h-12 rounded-xl border-none bg-slate-50 shadow-none" />
              </div>
              <div className="flex items-center gap-2 px-4">
                 <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400"><Filter className="h-4 w-4" /></Button>
                 <div className="h-6 w-[1px] bg-slate-100 mx-2" />
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sort: Recent</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {b2bDocuments.map((doc) => (
                <Card 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={cn(
                    "group border-none shadow-xl shadow-slate-200/50 rounded-xl cursor-pointer transition-all p-4",
                    selectedDoc?.id === doc.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
                  )}
                >
                   <div className="flex items-start justify-between mb-6">
                      <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                        selectedDoc?.id === doc.id ? "bg-white/10" : "bg-slate-50"
                      )}>
                         {getDocIcon(doc.type)}
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                        doc.status === 'final' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>{doc.status}</Badge>
                   </div>
                   
                   <div className="space-y-1 mb-6">
                      <h4 className="text-sm font-black uppercase tracking-tight truncate">{doc.title}</h4>
                      <p className={cn(
                        "text-[9px] font-bold uppercase tracking-widest",
                        selectedDoc?.id === doc.id ? "text-white/40" : "text-slate-400"
                      )}>{doc.type} • {doc.size}</p>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-slate-400">
                         <Clock className="h-3.5 w-3.5" />
                         <span className="text-[9px] font-bold uppercase">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600"><Download className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600"><Share2 className="h-4 w-4" /></Button>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Document Inspector / Meta Side */}
        <div className="lg:col-span-4">
           <AnimatePresence mode="wait">
             {selectedDoc ? (
               <motion.div
                 key={selectedDoc.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-4"
               >
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 space-y-4">
                     <div className="space-y-4">
                        <div className="aspect-[3/4] rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden flex items-center justify-center relative group">
                           <FileText className="h-20 w-20 text-slate-200" />
                           <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button className="bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
                                 <Eye className="h-4 w-4" /> Full Preview
                              </Button>
                           </div>
                        </div>
                        <div className="text-center space-y-1">
                           <h3 className="text-base font-black uppercase text-slate-900">{selectedDoc.title}</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedDoc.id}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Access Control</h4>
                        <div className="space-y-2">
                           {[
                             { name: 'Admin Node', role: 'Owner', access: 'Full' },
                             { name: 'Premium Store', role: 'Retailer', access: 'View Only' },
                             { name: 'Logistics Hub', role: 'Forwarder', access: 'Download' }
                           ].map((p, i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                <div className="flex items-center gap-3">
                                   <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black">{p.name[0]}</div>
                                   <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{p.name}</span>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">{p.role}</span>
                                   </div>
                                </div>
                                <Badge variant="outline" className="text-[7px] font-black border-slate-200">{p.access}</Badge>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-4 space-y-3">
                        <Button className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-indigo-100">
                           <Share2 className="h-4 w-4" /> Grant Secure Access
                        </Button>
                        <Button variant="outline" className="w-full h-10 border-slate-100 text-rose-600 font-black uppercase text-[10px] tracking-widest gap-2 rounded-2xl">
                           <Trash2 className="h-4 w-4" /> Revoke All Access
                        </Button>
                     </div>
                  </Card>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6 bg-white rounded-xl border border-dashed border-slate-200">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                     <FolderOpen className="h-10 w-10 text-slate-200" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-base font-black uppercase tracking-tight text-slate-400">Vault Preview node</h3>
                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Select a document to manage permissions and sharing</p>
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
