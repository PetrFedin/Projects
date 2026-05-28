import 'server-only';

/**
 * Проверка наличия ключа Google GenAI для Genkit (DFM, matchmaker).
 * @genkit-ai/google-genai читает GOOGLE_GENAI_API_KEY; в проектах также встречается GEMINI_API_KEY.
 */
export function getWorkshop2GenkitApiKeyStatus(): 'configured' | 'missing' {
  const key =
    process.env.GOOGLE_GENAI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  return key ? 'configured' : 'missing';
}

/** Genkit (DFM, matchmaker) готов к вызовам — есть API key. */
export function isWorkshop2AiConfigured(): boolean {
  return getWorkshop2GenkitApiKeyStatus() === 'configured';
}
