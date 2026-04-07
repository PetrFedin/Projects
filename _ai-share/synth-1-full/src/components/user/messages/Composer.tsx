import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Paperclip, Mic, Send, Sparkles, Factory, CreditCard, ShieldAlert, BellRing, Languages, Handshake, MicOff, X, Eye, EyeOff, Package, ListTodo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat as ChatConversation } from '@/lib/types';

interface ComposerProps {
  activeChat: ChatConversation | undefined;
  composerText: string;
  setComposerText: (t: string) => void;
  isPrivate: boolean;
  setIsPrivate: (v: boolean) => void;
  onSendMessage: () => void;
  onSmartReply: (type: string) => void;
  onOpenNegotiation: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  recording: boolean;
  isAiProcessing: boolean;
  onProcessAiCorrection: () => void;
  onFileClick: () => void;
  onUnarchiveChat: () => void;
  onOpenCreateTask?: () => void;
  onAttachProduct?: () => void;
}

export const Composer: React.FC<ComposerProps> = ({
  activeChat,
  composerText,
  setComposerText,
  isPrivate,
  setIsPrivate,
  onSendMessage,
  onSmartReply,
  onOpenNegotiation,
  onStartRecording,
  onStopRecording,
  recording,
  isAiProcessing,
  onProcessAiCorrection,
  onFileClick,
  onUnarchiveChat,
  onOpenCreateTask,
  onAttachProduct
}) => {
  if (activeChat?.isArchived) {
    return (
      <div className="p-4 border-t border-slate-100 bg-white relative z-10 max-w-5xl mx-auto w-full transition-all">
        <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="p-2.5 bg-slate-100 rounded-full mb-2">
            <Paperclip className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Этот чат находится в архиве</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Вы можете просматривать историю, но отправка сообщений ограничена</p>
          <Button 
            variant="outline" 
            className="mt-3 rounded-xl border-slate-200 font-black text-[8px] uppercase tracking-widest hover:bg-white h-8"
            onClick={onUnarchiveChat}
          >
            РАЗАРХИВИРОВАТЬ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-slate-100 bg-white relative z-10 max-w-4xl mx-auto w-full transition-all">
      <div className="mb-2.5 flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
        <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-indigo-100 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm" onClick={() => onSmartReply('status')}>
          <Factory className="h-3 w-3 mr-1.5" /> Status
        </Button>
        <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-emerald-100 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" onClick={() => onSmartReply('invoice')}>
          <CreditCard className="h-3 w-3 mr-1.5" /> Invoice
        </Button>
        <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-amber-100 bg-amber-50/30 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm" onClick={() => onSmartReply('qc')}>
          <ShieldAlert className="h-3 w-3 mr-1.5" /> QC Report
        </Button>
        <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-indigo-100 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm" onClick={() => onSmartReply('reminder')}>
          <BellRing className="h-3 w-3 mr-1.5" /> Reminder
        </Button>
        <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-slate-200 bg-white text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm" onClick={() => onSmartReply('translate')}>
          <Languages className="h-3 w-3 mr-1.5" /> Translate
        </Button>
        {onOpenCreateTask && (
          <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-violet-100 bg-violet-50/30 text-violet-600 hover:bg-violet-600 hover:text-white transition-all shadow-sm" onClick={onOpenCreateTask}>
            <ListTodo className="h-3 w-3 mr-1.5" /> Задача
          </Button>
        )}
        {onAttachProduct && (
          <Button variant="outline" className="rounded-lg h-6.5 px-2.5 text-[8px] font-bold uppercase tracking-widest border-amber-100 bg-amber-50/30 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm" onClick={onAttachProduct}>
            <Package className="h-3 w-3 mr-1.5" /> Товар
          </Button>
        )}
      </div>

      <div className="relative group/composer">
        <div className="relative bg-slate-100 border border-slate-200 rounded-2xl shadow-inner hover:shadow-md transition-all duration-300 p-1 overflow-hidden">
          <Textarea 
            placeholder="Type a message or issue a command…" 
            className="border-none bg-transparent focus-visible:ring-0 min-h-[80px] max-h-[200px] resize-none py-3 px-4 font-medium text-sm placeholder:text-slate-400 placeholder:italic scrollbar-hide shadow-none"
            value={composerText}
            onChange={e => setComposerText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/50 backdrop-blur-md border-t border-slate-200/50 rounded-b-xl">
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white text-slate-400 hover:text-indigo-600 transition-all" onClick={onFileClick}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 rounded-lg transition-all relative overflow-hidden",
                  recording ? "bg-rose-50 text-rose-600 shadow-inner" : "hover:bg-white text-slate-400 hover:text-indigo-600"
                )}
                onClick={recording ? onStopRecording : onStartRecording}
              >
                {recording ? (
                  <>
                    <MicOff className="h-4 w-4 relative z-10" />
                    <span className="absolute inset-0 bg-rose-200/50 animate-ping opacity-20" />
                  </>
                ) : <Mic className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 rounded-lg hover:bg-white transition-all",
                  isAiProcessing ? "text-indigo-600 animate-pulse" : "text-slate-400 hover:text-indigo-600"
                )}
                onClick={onProcessAiCorrection}
                disabled={isAiProcessing || !composerText}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 px-2.5 rounded-lg transition-all gap-1.5",
                  isPrivate ? "bg-rose-50 text-rose-600 border border-rose-100" : "text-slate-400 hover:bg-white hover:text-indigo-600"
                )}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                {isPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span className="text-[8px] font-bold uppercase tracking-widest">{isPrivate ? 'Private' : 'Shared'}</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[9px] font-bold tracking-widest uppercase transition-all tabular-nums",
                composerText.length > 500 ? "text-rose-500" : "text-slate-300"
              )}>
                {composerText.length} / 1000
              </span>
              <Button 
                disabled={!composerText.trim() && !recording}
                className={cn(
                  "h-8 px-6 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all shadow-lg",
                  composerText.trim() ? "bg-slate-900 text-white hover:bg-indigo-600 hover:scale-105 border border-slate-900" : "bg-slate-100 text-slate-300 border-none cursor-not-allowed"
                )}
                onClick={onSendMessage}
              >
                SEND
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
