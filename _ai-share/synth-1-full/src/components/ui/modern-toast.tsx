import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
  onClose
}: ModernToastProps) {
  const variants = {
    default: {
      bg: 'bg-slate-900',
      text: 'text-white',
      border: 'border-slate-700',
      icon: '📋'
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      text: 'text-white',
      border: 'border-emerald-400',
      icon: '✅'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
      text: 'text-white',
      border: 'border-amber-400',
      icon: '⚠️'
    },
    error: {
      bg: 'bg-gradient-to-r from-rose-500 to-rose-600',
      text: 'text-white',
      border: 'border-rose-400',
      icon: '❌'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-white',
      border: 'border-blue-400',
      icon: 'ℹ️'
    }
  };

  const v = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "glass-effect rounded-2xl p-4 pr-12 shadow-xl border-2 min-w-[320px] relative overflow-hidden",
        v.bg,
        v.text,
        v.border
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        <span className="text-sm">{v.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-1">
            {title}
          </h4>
          {description && (
            <p className="text-xs opacity-90 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity"
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
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
