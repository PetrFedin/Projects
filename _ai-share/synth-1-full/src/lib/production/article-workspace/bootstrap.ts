'use client';

import { createLocalArticleWorkspacePort } from './local-port';
import { setArticleWorkspaceDataPort } from './registry';

/**
 * Явная инициализация слоя данных вкладок артикула.
 * Вызывайте синхронно при старте клиента (не в `useEffect` после дочерних экранов), иначе провайдер
 * может успеть взять старый singleton. По умолчанию порт создаётся лениво в `getArticleWorkspaceDataPort`.
 * Для API: `setArticleWorkspaceDataPort(yourAdapter)` или доработайте `createHttpArticleWorkspacePort`.
 */
export function initArticleWorkspaceDataLayer(): void {
  setArticleWorkspaceDataPort(createLocalArticleWorkspacePort());
}
