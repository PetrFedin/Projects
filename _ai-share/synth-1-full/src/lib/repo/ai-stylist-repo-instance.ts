import 'server-only';

import { MockAiStylistRepo } from './aiStylistRepo';

/** Единственный серверный инстанс с LLM; не импортировать из client components. */
export const aiStylistRepo = new MockAiStylistRepo();
