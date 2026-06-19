/** Единый порядок в столпе «Связь»: сообщения → календарь (все роли Platform Core). */
export function sortCommsNavLinksMessagesFirst<T extends { value: string }>(
  links: readonly T[]
): T[] {
  const messages = links.find((l) => l.value === 'messages');
  const calendar = links.find((l) => l.value === 'calendar');
  const rest = links.filter((l) => l.value !== 'messages' && l.value !== 'calendar');
  return [...(messages ? [messages] : []), ...(calendar ? [calendar] : []), ...rest];
}
