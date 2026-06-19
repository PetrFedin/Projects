/**
 * Platform Core · столп «Связь» (comms) — единственное место разделов чата и календаря.
 *
 * Принципы:
 * - У каждой роли все рабочие разделы чата/календаря/групп — только в pillarId=comms.
 * - В других столпах допустимы context-strip deep-link (?order=, ?article=, section=) → comms.
 * - Свободные треды/события вне активных столпов — ok; auto-группы по sectionId из контекста работы — target.
 *
 * См. ADR-002 Appendix B · CROSS_ROLE_FLOWS.md §1.
 */
import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';

export const PLATFORM_CORE_COMMS_PILLAR_ID = 'comms' as const;

/** Audit section ids comms-столпа: `{role}-cm-*`. */
export const PLATFORM_CORE_COMMS_SECTION_ID_PREFIX = '-cm-' as const;

/** Peer-CTA из empty-cell / других столпов — не раздел comms, только ссылка. */
export const PLATFORM_CORE_COMMS_PEER_SECTION_SUFFIX = '-comms-peer' as const;

const CHAT_CALENDAR_SECTION_RE =
  /(?:^|-)(chat|calendar|messages|cm-order|cm-article|cm-calendar|cm-groups)(?:-|$)/i;

type SectionLike = { id: string };

type AuditLike = Partial<
  Record<CoreChainRoleId, Partial<Record<CoreHubPillarId, readonly SectionLike[]>>>
>;

export function isPlatformCoreCommsSectionAuditId(sectionId: string): boolean {
  return sectionId.includes(PLATFORM_CORE_COMMS_SECTION_ID_PREFIX);
}

export function isPlatformCoreCommsPeerSectionAuditId(sectionId: string): boolean {
  return sectionId.endsWith(PLATFORM_CORE_COMMS_PEER_SECTION_SUFFIX);
}

/** Раздел выглядит как чат/календарь, но не comms-peer CTA. */
export function looksLikeCommsWorkspaceSectionId(sectionId: string): boolean {
  if (isPlatformCoreCommsSectionAuditId(sectionId)) return true;
  if (isPlatformCoreCommsPeerSectionAuditId(sectionId)) return false;
  return CHAT_CALENDAR_SECTION_RE.test(sectionId);
}

/**
 * Возвращает списки нарушений канона (пустой = ok).
 * comms pillar: section id должен содержать `-cm-`.
 * non-comms: не должно быть workspace-разделов чата/календаря (peer `-comms-peer` — ok).
 */
export function findCommsSectionAuditViolations(audit: AuditLike): string[] {
  const out: string[] = [];
  for (const [roleId, pillars] of Object.entries(audit) as Array<
    [CoreChainRoleId, Partial<Record<CoreHubPillarId, readonly SectionLike[]>> | undefined]
  >) {
    if (!pillars) continue;
    for (const [pillarId, sections] of Object.entries(pillars) as Array<
      [CoreHubPillarId, readonly SectionLike[] | undefined]
    >) {
      if (!sections?.length) continue;
      for (const section of sections) {
        const id = section.id;
        if (pillarId === PLATFORM_CORE_COMMS_PILLAR_ID) {
          if (!isPlatformCoreCommsSectionAuditId(id)) {
            out.push(`${roleId}×${pillarId}: section "${id}" must use -cm- prefix in comms pillar`);
          }
          continue;
        }
        if (looksLikeCommsWorkspaceSectionId(id) && !isPlatformCoreCommsPeerSectionAuditId(id)) {
          out.push(
            `${roleId}×${pillarId}: section "${id}" is comms workspace — move to comms or rename to *-comms-peer`
          );
        }
      }
    }
  }
  return out;
}

/** Query для deep-link из раздела столпа N в comms (группы/треды по контексту). */
export function platformCoreCommsSectionContextQuery(input: {
  pillarId: CoreHubPillarId;
  sectionId: string;
  collectionId?: string;
  orderId?: string;
  articleId?: string;
}): Record<string, string> {
  const q: Record<string, string> = {
    pillar: input.pillarId,
    section: input.sectionId,
  };
  if (input.collectionId?.trim()) q.collection = input.collectionId.trim();
  if (input.orderId?.trim()) q.order = input.orderId.trim();
  if (input.articleId?.trim()) q.article = input.articleId.trim();
  return q;
}
