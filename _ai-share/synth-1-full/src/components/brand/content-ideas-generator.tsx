'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Idea = { title: string; caption: string; hashtags?: string[] };

export function ContentIdeasGenerator() {
  const [brandName, setBrandName] = useState('Syntha');
  const [theme, setTheme] = useState('новая коллекция');
  const [channel, setChannel] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const res = await fetch('/api/ai/content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, theme, channel, count: 5 }),
      });
      const data = await res.json();
      if (data.ideas?.length) setIdeas(data.ideas);
    } catch (e) {
      console.error('Content ideas failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" /> Идеи контента
        </CardTitle>
        <CardDescription>
          Генерация идей для постов в соцсетях: заголовки, подписи, хештеги.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Бренд</Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Syntha"
            />
          </div>
          <div>
            <Label>Тема</Label>
            <Input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="новая коллекция"
            />
          </div>
          <div>
            <Label>Канал</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="blog">Блог</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Сгенерировать идеи
        </Button>
        {ideas.length > 0 && (
          <div className="mt-4 space-y-3">
            {ideas.map((idea, i) => (
              <div key={i} className="rounded-lg border bg-muted/30 p-3">
                <p className="font-medium">{idea.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{idea.caption}</p>
                {idea.hashtags?.length && (
                  <p className="mt-2 text-xs text-muted-foreground">{idea.hashtags.join(' ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
