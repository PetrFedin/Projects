export interface SentimentData {
  region: string;
  topic: string; // e.g., "sustainable_sneakers", "y2k_cyberpunk_jacket"
  valence: number; // -1.0 (extremely negative) to 1.0 (extremely positive)
  arousal: number; // 0.0 (calm/bored) to 1.0 (excited/angry)
  volume: number; // Number of mentions/data points in the last hour
}

export interface SentimentAnalysisResult {
  topic: string;
  viralPotentialScore: number; // 0.0 to 1.0
  recommendedAction: 'launch_campaign' | 'increase_price' | 'monitor' | 'damage_control';
  reasoning: string;
}

/**
 * [Phase 61 — Autonomous Crowd Sentiment Orchestrator]
 * ИИ-движок для анализа глобальных настроений толпы (соцсети, новости, BCI-телеметрия).
 * Выявляет зарождающиеся тренды (виральность) или волны негатива.
 * Автоматически рекомендует запуск маркетинговых кампаний, динамическое повышение цен
 * или активацию протоколов антикризисного PR.
 */
export class CrowdSentimentEngine {
  /**
   * Анализирует поток данных о настроениях и выдает рекомендацию.
   */
  public static analyzeSentiment(data: SentimentData): SentimentAnalysisResult {
    // [Phase 61] Math Hardening: защита от NaN и выход за пределы диапазонов
    const safeValence = Math.max(-1.0, Math.min(1.0, isNaN(data.valence) ? 0 : data.valence));
    const safeArousal = Math.max(0.0, Math.min(1.0, isNaN(data.arousal) ? 0 : data.arousal));
    const safeVolume = Math.max(0, isNaN(data.volume) ? 0 : data.volume);

    // Виральный потенциал (Viral Potential) высок, если высок уровень возбуждения (arousal)
    // и значителен объем упоминаний (volume).
    // Валентность (valence) определяет *тип* виральности: хайп или возмущение.
    const volumeMultiplier = Math.min(1.0, safeVolume / 1000000); // Нормализация объема (1 млн = макс)
    const viralPotentialScore = safeArousal * volumeMultiplier;

    let action: SentimentAnalysisResult['recommendedAction'] = 'monitor';
    let reasoning = `Monitoring topic '${data.topic}'. Viral potential: ${(viralPotentialScore * 100).toFixed(1)}%. Volume: ${safeVolume.toLocaleString()}.`;

    if (viralPotentialScore > 0.6) {
      if (safeValence > 0.4) {
        action = 'launch_campaign';
        reasoning = `High positive virality detected for '${data.topic}' (Valence: ${safeValence.toFixed(2)}). Recommend immediate generative campaign launch to capitalize on hype.`;
      } else if (safeValence < -0.4) {
        action = 'damage_control';
        reasoning = `High negative virality detected for '${data.topic}' (Valence: ${safeValence.toFixed(2)}). Recommend immediate PR damage control and swarm crisis resolution.`;
      } else {
        action = 'increase_price';
        reasoning = `High neutral/mixed virality detected for '${data.topic}'. High attention but polarized sentiment. Recommend dynamic price increase to test demand elasticity.`;
      }
    }

    return {
      topic: data.topic,
      viralPotentialScore: Number(viralPotentialScore.toFixed(3)),
      recommendedAction: action,
      reasoning,
    };
  }
}
