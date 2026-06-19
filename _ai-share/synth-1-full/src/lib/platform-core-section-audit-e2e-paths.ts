import {
  PLATFORM_CORE_DEMO,
  type CoreChainRoleId,
  type CoreHubPillarId,
  type PlatformCoreDemoContext,
} from '@/lib/platform-core-hub-matrix';
import { SECTION_AUDIT } from '@/lib/platform-core-readiness-sections';

export type SectionAuditE2ePath = {
  roleId: CoreChainRoleId;
  pillarId: CoreHubPillarId;
  sectionId: string;
  label: string;
  href: string;
};

/** Все resolveHref из SECTION_AUDIT для smoke e2e (честный обход разделов матрицы). */
export function buildSectionAuditE2ePaths(
  demo: PlatformCoreDemoContext = PLATFORM_CORE_DEMO
): SectionAuditE2ePath[] {
  const paths: SectionAuditE2ePath[] = [];
  for (const roleId of Object.keys(SECTION_AUDIT) as CoreChainRoleId[]) {
    const pillars = SECTION_AUDIT[roleId];
    if (!pillars) continue;
    for (const pillarId of Object.keys(pillars) as CoreHubPillarId[]) {
      const sections = pillars[pillarId];
      if (!sections) continue;
      for (const section of sections) {
        paths.push({
          roleId,
          pillarId,
          sectionId: section.id,
          label: section.label,
          href: section.resolveHref(demo),
        });
      }
    }
  }
  return paths;
}
