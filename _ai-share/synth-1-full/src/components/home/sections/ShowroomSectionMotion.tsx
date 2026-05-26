'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** Outer motion shell showroom — framer-motion в отдельном chunk. */
export function ShowroomSectionWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="section-spacing relative bg-transparent"
    >
      {children}
    </motion.section>
  );
}

type ShowroomGridPresenceProps = {
  tabKey: string;
  children: ReactNode;
};

/** Tab/view transition для горизонтального scroll grid. */
export function ShowroomGridPresence({ tabKey, children }: ShowroomGridPresenceProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={tabKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex gap-3"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
