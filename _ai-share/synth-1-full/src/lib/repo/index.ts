import { MockGeoRepo } from './geoRepo';
import { MockSearchRepo } from './searchRepo';
import { MockCmsRepo } from './cmsRepo';
import { MockLooksRepo } from './looksRepo';
import { aiStylistStub } from './aiStylistRepo.stub';

export type {
  AiStylistRepo,
  StylistRequest,
  StylistResponse,
  Message,
  StylistPreferences,
} from './aiStylistRepo';

export const repo = {
  geo: new MockGeoRepo(),
  /** На клиенте — заглушка; LLM через `aiStylistRepo` в `ai-stylist-repo-instance.ts` (server-only). */
  aiStylist: aiStylistStub,
  search: new MockSearchRepo(),
  cms: new MockCmsRepo(),
  looks: new MockLooksRepo(),
};
