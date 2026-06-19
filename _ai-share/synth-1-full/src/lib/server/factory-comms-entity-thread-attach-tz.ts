import 'server-only';

import {
  factoryCommsEntityThreadAttachTzMessage,
  manufacturerCommsEntityThreadSupportsAttachTz,
  supplierCommsEntityThreadSupportsAttachTz,
  type FactoryCommsEntityThreadKind,
} from '@/lib/fashion/factory-comms-entity-thread-attach-tz';
import type { ManufacturerCommsEntityThreadKind } from '@/lib/fashion/manufacturer-comms-entity-threads';
import type { SupplierCommsEntityThreadKind } from '@/lib/fashion/supplier-comms-entity-threads';
import { bumpPlatformCoreCommsInbox } from '@/lib/server/platform-core-comms-inbox-hub';
import { appendWorkshop2ContextualMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { WORKSHOP2_CONTEXTUAL_SYSTEM_SENDER } from '@/lib/server/workshop2-contextual-message-sender';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { WORKSHOP2_ARTICLE_CONTEXT_TYPE } from '@/lib/production/workshop2-domain-event-types';

function resolveDossierPane(threadKind: FactoryCommsEntityThreadKind): {
  w2pane: 'tz' | 'sample';
  w2sec?: 'spec' | 'material';
} {
  if (threadKind === 'sample') return { w2pane: 'sample' };
  if (threadKind === 'bom') return { w2pane: 'tz', w2sec: 'material' };
  return { w2pane: 'tz', w2sec: 'spec' };
}

export async function attachFactoryCommsEntityThreadTzServer(input: {
  variant: 'manufacturer' | 'supplier';
  collectionId: string;
  articleId: string;
  threadKind: FactoryCommsEntityThreadKind;
  organizationId?: string;
}): Promise<{ ok: true; messageId: string; dossierHref: string }> {
  const supported =
    input.variant === 'manufacturer'
      ? manufacturerCommsEntityThreadSupportsAttachTz(
          input.threadKind as ManufacturerCommsEntityThreadKind
        )
      : supplierCommsEntityThreadSupportsAttachTz(
          input.threadKind as SupplierCommsEntityThreadKind
        );
  if (!supported) throw new Error('THREAD_KIND_UNSUPPORTED');

  const collectionId = input.collectionId.trim();
  const articleId = input.articleId.trim();
  const pane = resolveDossierPane(input.threadKind);
  const dossierHref = workshop2ArticleHref(collectionId, articleId, pane);
  const contextId = `${collectionId}:${articleId}`;
  const message = factoryCommsEntityThreadAttachTzMessage({
    variant: input.variant,
    threadKind: input.threadKind,
    collectionId,
    articleId,
    dossierHref,
  });

  const saved = await appendWorkshop2ContextualMessage({
    organizationId: input.organizationId?.trim() || 'org-factory-001',
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId,
    message,
    sender: WORKSHOP2_CONTEXTUAL_SYSTEM_SENDER,
    isSystem: true,
    attachmentName: 'workshop2-dossier-tz',
    attachmentUrl: dossierHref,
  });

  bumpPlatformCoreCommsInbox('contextual_message');
  return { ok: true, messageId: saved.id, dossierHref };
}
