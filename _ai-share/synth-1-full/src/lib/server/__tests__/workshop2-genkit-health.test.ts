import {
  getWorkshop2GenkitApiKeyStatus,
  isWorkshop2AiConfigured,
} from '@/lib/server/workshop2-genkit-health';

describe('workshop2-genkit-health', () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it('reports missing when no keys', () => {
    delete process.env.GOOGLE_GENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    expect(getWorkshop2GenkitApiKeyStatus()).toBe('missing');
  });

  it('reports configured when GOOGLE_GENAI_API_KEY set', () => {
    process.env.GOOGLE_GENAI_API_KEY = 'test-key';
    expect(getWorkshop2GenkitApiKeyStatus()).toBe('configured');
    expect(isWorkshop2AiConfigured()).toBe(true);
  });

  it('isWorkshop2AiConfigured false when keys missing', () => {
    delete process.env.GOOGLE_GENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    expect(isWorkshop2AiConfigured()).toBe(false);
  });
});
