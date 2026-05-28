/**
 * Политика бренда: подставлять POM-шаблон при создании артикула.
 */
export function readWorkshop2PomOnCreatePolicyDefault(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const flag = env.WORKSHOP2_POM_ON_CREATE_DEFAULT?.trim().toLowerCase();
  return flag === '1' || flag === 'true' || flag === 'yes';
}
