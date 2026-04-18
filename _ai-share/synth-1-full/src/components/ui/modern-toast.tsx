import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface ModernToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

export function ModernToast({
  title,
  description,
  variant = 'default',
  onClose,
}: ModernToastProps) {
  const variants = {
    default: {
      bg: 'bg-slate-900',
      text: 'text-white',
      border: 'border-slate-700',
      icon: '📋',
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      text: 'text-white',
      border: 'border-emerald-400',
      icon: '✅',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
      text: 'text-white',
      border: 'border-amber-400',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-gradient-to-r from-rose-500 to-rose-600',
      text: 'text-white',
      border: 'border-rose-400',
      icon: '❌',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-white',
      border: 'border-blue-400',
      icon: 'ℹ️',
    },
  };

  const v = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'glass-effect relative min-w-[320px] overflow-hidden rounded-2xl border-2 p-4 pr-12 shadow-xl',
        v.bg,
        v.text,
        v.border
      )}
    >
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-white blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        <span className="text-sm">{v.icon}</span>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-sm font-bold">{title}</h4>
          {description && <p className="text-xs leading-relaxed opacity-90">{description}</p>}
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

// Toast container component
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
}

// Usage example:
// <ToastContainer>
//   <ModernToast
//     title="Товар добавлен в корзину"
//     description="Cyber Tech Parka добавлен в вашу корзину"
//     variant="success"
//     onClose={() => {}}
//   />
// </ToastContainer>
