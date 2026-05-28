/**
 * Честная сводка источников справочников (PG vs static).
 */

export type Workshop2ReferencesStatusInput = {
  postgres: 'ok' | 'down' | 'disabled';
  directories: Record<string, 'postgres' | 'static'>;
};

export function summarizeWorkshop2ReferencesStatus(input: Workshop2ReferencesStatusInput): {
  pgReady: boolean;
  postgresLabelRu: string;
  staticDirectoryCount: number;
  postgresDirectoryCount: number;
  blockerRu?: string;
} {
  const dirs = Object.values(input.directories);
  const postgresDirectoryCount = dirs.filter((d) => d === 'postgres').length;
  const staticDirectoryCount = dirs.filter((d) => d === 'static').length;
  const pgReady = input.postgres === 'ok';

  let postgresLabelRu = 'PostgreSQL: не настроен';
  if (input.postgres === 'ok') postgresLabelRu = 'PostgreSQL: справочники из PG';
  else if (input.postgres === 'down')
    postgresLabelRu = 'PostgreSQL: недоступен · fallback на seeds';

  let blockerRu: string | undefined;
  if (input.postgres === 'disabled') {
    blockerRu = 'CRUD материалов и ТН ВЭД только при WORKSHOP2_DATABASE_URL.';
  } else if (input.postgres === 'down') {
    blockerRu = 'Справочники читаются из static seeds до восстановления PG.';
  }

  return {
    pgReady,
    postgresLabelRu,
    staticDirectoryCount,
    postgresDirectoryCount,
    blockerRu,
  };
}
