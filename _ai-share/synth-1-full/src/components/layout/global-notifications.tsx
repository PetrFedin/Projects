'use client';

import * as React from 'react';
import { useUIState } from '@/providers/ui-state';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, CheckCircle2 } from 'lucide-react';

export function GlobalNotifications() {
  const { notifications, removeNotification } = useUIState();

  return (
    <div className="pointer-events-none fixed right-6 top-24 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            layout
            className="group pointer-events-auto relative w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500" />

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                {notif.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Bell className="h-5 w-5 text-indigo-600" />
                )}
              </div>

              <div className="flex-1 space-y-1 pr-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {notif.title}
                </p>
                <p className="text-[11px] font-bold leading-tight text-slate-900">
                  {notif.message}
                </p>
              </div>

              <button
                onClick={() => removeNotification(notif.id)}
                className="absolute right-4 top-4 text-slate-300 transition-colors hover:text-slate-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Progress Bar Decor */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-indigo-500/20"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
