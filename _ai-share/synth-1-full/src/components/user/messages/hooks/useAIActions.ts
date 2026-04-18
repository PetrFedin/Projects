import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { optimizeBlogText } from '@/ai/flows/optimize-blog-text';

export function useAIActions(composerText: string, setComposerText: (t: string) => void) {
  const { toast } = useToast();
  const [isAiProcessing, setIsAiProcessing] = React.useState(false);
  const [aiSuggestedText, setAiSuggestedText] = React.useState('');
  const [showAiComparison, setShowAiComparison] = React.useState(false);

  const processAiCorrection = async () => {
    if (!composerText.trim()) return;
    setIsAiProcessing(true);
    try {
      const result = await optimizeBlogText({ text: composerText });
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
