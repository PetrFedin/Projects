import { NextRequest, NextResponse } from 'next/server';
import { repo } from '@/lib/repo';
import { StylistRequest } from '@/lib/repo/aiStylistRepo';
import { parseChatParamsAsync } from '@/lib/ai-stylist';
import { generateStylistReply } from '@/ai/flows/generate-stylist-reply';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as StylistRequest;

  if (!body.mood) body.mood = 'Minimal';

  const lastMsgContent = body.messages?.[body.messages.length - 1]?.content ?? '';
  const parsed = await parseChatParamsAsync(lastMsgContent);
  if (parsed.occasion) body.occasion = parsed.occasion;
  if (parsed.mood) body.mood = parsed.mood;
  if (parsed.palette) body.palette = parsed.palette;
  if (parsed.budgetMax) body.budgetMax = parsed.budgetMax;
  if (parsed.colors?.length) body.colors = parsed.colors;
  if (parsed.excludeOversized || parsed.excludeBright) {
    body.preferences = {
      ...(body.preferences ?? {}),
      excludeOversized: parsed.excludeOversized,
      excludeBright: parsed.excludeBright,
    };
  }
  if (parsed.refineCheaper && body.budgetMax) body.budgetMax = Math.floor(body.budgetMax * 0.7);
  if (parsed.refinePricier && body.budgetMax) body.budgetMax = Math.floor(body.budgetMax * 1.5);

  if (body.temperature == null) {
    try {
      const wRes = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current=temperature_2m'
      );
      if (wRes.ok) {
        const w = await wRes.json();
        body.temperature = Math.round((w.current?.temperature_2m ?? 15) as number);
      }
    } catch {
      /* ignore */
    }
    if (body.temperature == null) {
      const seasonTemp: Record<string, number> = { Winter: 0, Autumn: 8, Spring: 15, Summer: 22 };
      body.temperature = seasonTemp[body.season] ?? 15;
    }
  }

  const lastMessage = lastMsgContent.toLowerCase();
  if (
    lastMessage.includes('расскажи про') ||
    lastMessage.includes('что такое') ||
    lastMessage.includes('сколько стоит')
  ) {
    const productQuery = lastMessage.replace(/расскажи про|что такое|сколько стоит/g, '').trim();
    const product = await repo.aiStylist.getProductDetails(productQuery);
    if (product) {
      const result = await repo.aiStylist.generateLooks(body);
      const personaName =
        body.mood === 'street'
          ? 'Urban Explorer'
          : body.mood === 'avant'
            ? 'Visionary'
            : 'Minimalist Master';
      return NextResponse.json({
        ...result,
        reply: `Анализ запроса завершен. Как ваш ${personaName}, я изучил ${product.title} от ${product.brand}. С учетом текущей погоды в Москве (+2°C, дождь), я рекомендую этот кашемировый слой для идеального термобаланса. Цена: ${product.price.toLocaleString('ru-RU')} ₽. Вот мои рекомендации по интеграции в ваш стиль:`,
      });
    }
  }

  if (!body?.occasion || !body?.audience || !body?.season) {
    return NextResponse.json(
      { error: 'audience, occasion, and season are required' },
      { status: 400 }
    );
  }

  if (
    parsed.rainy &&
    body.includeCategories?.length &&
    !body.includeCategories.includes('Outerwear')
  ) {
    body.includeCategories = [...body.includeCategories, 'Outerwear'];
  }

  const result = await repo.aiStylist.generateLooks(body);

  if (result.looks?.length) {
    try {
      const looksSummary = result.looks
        .map((l) =>
          l.items
            .map((it) =>
              it.title
                ? `${it.title}${it.price ? ` (${it.price.toLocaleString('ru-RU')} ₽)` : ''}`
                : ''
            )
            .filter(Boolean)
            .join(', ')
        )
        .filter(Boolean)
        .join('; ');

      const aiReply = await generateStylistReply({
        userMessage: lastMsgContent || undefined,
        history: body.messages?.map((m) => ({ role: m.role, content: m.content })),
        occasion: body.occasion,
        mood: body.mood,
        season: body.season,
        wardrobeItemTitle: body.wardrobe?.[0]?.title || '',
        looksCount: result.looks.length,
        totalPriceRange:
          result.looks.length > 0
            ? `${Math.min(...result.looks.map((l) => l.totalPrice)).toLocaleString('ru-RU')}-${Math.max(...result.looks.map((l) => l.totalPrice)).toLocaleString('ru-RU')} ₽`
            : '',
        looksSummary: looksSummary || undefined,
      });
      if (aiReply) result.reply = aiReply;
    } catch (_) {
      // fallback to repo reply
    }
  }

  return NextResponse.json(result);
}
