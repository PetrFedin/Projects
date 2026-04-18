import React from 'react';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { optimizeBlogText } from '@/ai/flows/optimize-blog-text';
=======
>>>>>>> recover/cabinet-wip-from-stash

export function useAIActions(composerText: string, setComposerText: (t: string) => void) {
  const { toast } = useToast();
  const [isAiProcessing, setIsAiProcessing] = React.useState(false);
  const [aiSuggestedText, setAiSuggestedText] = React.useState('');
  const [showAiComparison, setShowAiComparison] = React.useState(false);

  const processAiCorrection = async () => {
    if (!composerText.trim()) return;
    setIsAiProcessing(true);
    try {
      const res = await fetch('/api/ai/optimize-blog-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: composerText }),
      });
      const result = (await res.json()) as {
        optimizedText?: string;
        explanation?: string;
        message?: string;
      };
      if (!res.ok || !result.optimizedText || !result.explanation) {
        throw new Error(result?.message || 'Failed to optimize text');
      }
      setAiSuggestedText(result.optimizedText + `\n\n[AI: ${result.explanation}]`);
      setShowAiComparison(true);
      toast({ title: 'Текст оптимизирован' });
    } catch (error) {
      console.error('AI Error:', error);
      toast({ variant: 'destructive', title: 'Ошибка AI' });
    } finally {
      setIsAiProcessing(false);
    }
  };

  return {
    isAiProcessing,
    aiSuggestedText,
    showAiComparison,
    setShowAiComparison,
    processAiCorrection,
  };
}
