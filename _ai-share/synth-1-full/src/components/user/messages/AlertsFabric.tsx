import React from 'react';
import { X } from 'lucide-react';

interface AlertsFabricProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AlertsFabric: React.FC<AlertsFabricProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
<<<<<<< HEAD
    <div className="mx-[-2rem] mb-4 mt-[-2rem] flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2rem] text-white duration-500 animate-in slide-in-from-top">
=======
    <div className="bg-text-primary border-text-primary/30 mx-[-2rem] mb-4 mt-[-2rem] flex shrink-0 items-center justify-between border-b px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2rem] text-white duration-500 animate-in slide-in-from-top">
>>>>>>> recover/cabinet-wip-from-stash
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-blue-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          СИСТЕМА ОПОВЕЩЕНИЙ АКТИВНА
        </span>
        <div className="h-3 w-[1px] bg-white/10" />
<<<<<<< HEAD
        <span className="text-slate-300">
          Обнаружен критический риск задержки отгрузки для TSUM (SLA: 14m)
=======
        <span className="text-text-muted">
          Обнаружен критический риск задержки отгрузки для демо-ритейла (SLA: 14m)
>>>>>>> recover/cabinet-wip-from-stash
        </span>
      </div>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
