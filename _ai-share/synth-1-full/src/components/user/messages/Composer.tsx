import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Paperclip,
  Mic,
  Send,
  Sparkles,
  Factory,
  CreditCard,
  ShieldAlert,
  BellRing,
  Languages,
  Handshake,
  MicOff,
  X,
  Eye,
  EyeOff,
  Package,
  ListTodo,
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
  onAttachProduct,
}) => {
  if (activeChat?.isArchived) {
    return (
      <div className="border-border-subtle relative z-10 mx-auto w-full max-w-5xl border-t bg-white p-4 transition-all">
        <div className="bg-bg-surface2 border-border-default flex flex-col items-center justify-center rounded-xl border border-dashed py-4">
          <div className="bg-bg-surface2 mb-2 rounded-full p-2.5">
            <Paperclip className="text-text-muted h-5 w-5" />
          </div>
          <p className="text-text-secondary text-xs font-black uppercase tracking-widest">
            Этот чат находится в архиве
          </p>
          <p className="text-text-muted mt-0.5 text-[9px] font-bold uppercase">
            Вы можете просматривать историю, но отправка сообщений ограничена
          </p>
          <Button
            variant="outline"
            className="border-border-default mt-3 h-8 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white"
            onClick={onUnarchiveChat}
          >
            РАЗАРХИВИРОВАТЬ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border-subtle relative z-10 mx-auto w-full max-w-4xl border-t bg-white p-3 transition-all">
      <div className="scrollbar-hide mb-2.5 flex gap-1.5 overflow-x-auto py-0.5">
        <Button
          variant="outline"
          className="h-6.5 border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary rounded-lg px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
          onClick={() => onSmartReply('status')}
        >
          <Factory className="mr-1.5 h-3 w-3" /> Status
        </Button>
        <Button
          variant="outline"
          className="h-6.5 rounded-lg border-emerald-100 bg-emerald-50/30 px-2.5 text-[8px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
          onClick={() => onSmartReply('invoice')}
        >
          <CreditCard className="mr-1.5 h-3 w-3" /> Invoice
        </Button>
        <Button
          variant="outline"
          className="h-6.5 rounded-lg border-amber-100 bg-amber-50/30 px-2.5 text-[8px] font-bold uppercase tracking-widest text-amber-600 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
          onClick={() => onSmartReply('qc')}
        >
          <ShieldAlert className="mr-1.5 h-3 w-3" /> QC Report
        </Button>
        <Button
          variant="outline"
          className="h-6.5 border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary rounded-lg px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
          onClick={() => onSmartReply('reminder')}
        >
          <BellRing className="mr-1.5 h-3 w-3" /> Reminder
        </Button>
        <Button
          variant="outline"
          className="h-6.5 border-border-default text-text-secondary hover:bg-text-primary/90 rounded-lg bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
          onClick={() => onSmartReply('translate')}
        >
          <Languages className="mr-1.5 h-3 w-3" /> Translate
        </Button>
        {onOpenCreateTask && (
          <Button
            variant="outline"
            className="h-6.5 border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary rounded-lg px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
            onClick={onOpenCreateTask}
          >
            <ListTodo className="mr-1.5 h-3 w-3" /> Задача
          </Button>
        )}
        {onAttachProduct && (
          <Button
            variant="outline"
            className="h-6.5 rounded-lg border-amber-100 bg-amber-50/30 px-2.5 text-[8px] font-bold uppercase tracking-widest text-amber-600 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
            onClick={onAttachProduct}
          >
            <Package className="mr-1.5 h-3 w-3" /> Товар
          </Button>
        )}
      </div>

      <div className="group/composer relative">
        <div className="bg-bg-surface2 border-border-default relative overflow-hidden rounded-2xl border p-1 shadow-inner transition-all duration-300 hover:shadow-md">
          <Textarea
            placeholder="Type a message or issue a command…"
            className="placeholder:text-text-muted scrollbar-hide max-h-[200px] min-h-[80px] resize-none border-none bg-transparent px-4 py-3 text-sm font-medium shadow-none placeholder:italic focus-visible:ring-0"
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />

          <div className="border-border-default/50 flex items-center justify-between rounded-b-xl border-t bg-white/50 px-3 py-1.5 backdrop-blur-md">
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="text-text-muted hover:text-accent-primary h-8 w-8 rounded-lg transition-all hover:bg-white"
                onClick={onFileClick}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="bg-border-subtle mx-1 h-4 w-px" />
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'relative h-8 w-8 overflow-hidden rounded-lg transition-all',
                  recording
                    ? 'bg-rose-50 text-rose-600 shadow-inner'
                    : 'text-text-muted hover:text-accent-primary hover:bg-white'
                )}
                onClick={recording ? onStopRecording : onStartRecording}
              >
                {recording ? (
                  <>
                    <MicOff className="relative z-10 h-4 w-4" />
                    <span className="absolute inset-0 animate-ping bg-rose-200/50 opacity-20" />
                  </>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-lg transition-all hover:bg-white',
                  isAiProcessing
                    ? 'text-accent-primary animate-pulse'
                    : 'text-text-muted hover:text-accent-primary'
                )}
                onClick={onProcessAiCorrection}
                disabled={isAiProcessing || !composerText}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <div className="bg-border-subtle mx-1 h-4 w-px" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 rounded-lg px-2.5 transition-all',
                  isPrivate
                    ? 'border border-rose-100 bg-rose-50 text-rose-600'
                    : 'text-text-muted hover:text-accent-primary hover:bg-white'
                )}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                {isPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span className="text-[8px] font-bold uppercase tracking-widest">
                  {isPrivate ? 'Private' : 'Shared'}
                </span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-[9px] font-bold uppercase tabular-nums tracking-widest transition-all',
                  composerText.length > 500 ? 'text-rose-500' : 'text-text-muted'
                )}
              >
                {composerText.length} / 1000
              </span>
              <Button
                disabled={!composerText.trim() && !recording}
                className={cn(
                  'h-8 rounded-lg px-6 text-[9px] font-bold uppercase tracking-widest shadow-lg transition-all',
                  composerText.trim()
                    ? 'bg-text-primary hover:bg-accent-primary border-text-primary border text-white hover:scale-105'
                    : 'bg-bg-surface2 text-text-muted cursor-not-allowed border-none'
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
