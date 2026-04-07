'use client';

import * as React from 'react';
import { useUIState } from '@/providers/ui-state';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, CheckCircle2 } from 'lucide-react';

export function GlobalNotifications() {
  const { notifications, removeNotification } = useUIState();

  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            layout
            className="pointer-events-auto w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                {notif.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Bell className="h-5 w-5 text-indigo-600" />
                )}
              </div>
              
              <div className="flex-1 space-y-1 pr-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notif.title}</p>
                <p className="text-[11px] font-bold text-slate-900 leading-tight">{notif.message}</p>
              </div>

              <button 
                onClick={() => removeNotification(notif.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-900 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Progress Bar Decor */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-0.5 bg-indigo-500/20"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
