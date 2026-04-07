'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RollingDigit({ value }: { value: string }) {
    return (
        <div className="relative h-7 w-5 overflow-hidden rounded-md bg-black shadow-inner group/digit">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center text-white font-mono font-black text-xs z-10"
                >
                    {value === ',' || value === ' ' ? <span className="text-black bg-transparent w-1"> </span> : value}
                </motion.div>
            </AnimatePresence>
            {value !== ',' && value !== ' ' && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />
            )}
        </div>
    );
}
