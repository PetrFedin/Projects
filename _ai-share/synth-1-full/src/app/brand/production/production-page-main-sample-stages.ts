/** Стадии сэмплинга и подписи для legacy-страницы «Production control». */
export const SAMPLE_STAGES = ['Proto1', 'Proto2', 'SMS', 'PP', 'SizeSet', 'TOP'] as const;

export const STAGE_LABELS: Record<string, string> = {
  Proto1: 'Proto 1',
  Proto2: 'Proto 2',
  SMS: 'SMS',
  PP: 'Pre-Production',
  SizeSet: 'Size Set',
  TOP: 'TOP',
};
