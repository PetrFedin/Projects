import React from 'react';
import { X } from 'lucide-react';

interface AlertsFabricProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AlertsFabric: React.FC<AlertsFabricProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="mx-[-2rem] mt-[-2rem] mb-4 bg-slate-900 text-white px-8 py-2.5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2rem] shrink-0 border-b border-slate-800 animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-blue-400">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          СИСТЕМА ОПОВЕЩЕНИЙ АКТИВНА
        </span>
        <div className="h-3 w-[1px] bg-white/10" />
        <span className="text-slate-300">Обнаружен критический риск задержки отгрузки для TSUM (SLA: 14m)</span>
      </div>
      <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
