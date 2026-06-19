'use client';

import Link from 'next/link';
import { PLATFORM_CORE_B2B_MESSAGE_TEMPLATES } from '@/lib/communications/platform-core-b2b-message-templates';
import { factoryMessagesWorkshop2ArticleContextHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  articleId: string;
};

/** Mfr dev dossier · comment-only annotation via chat template (read-only TZ). */
export function ManufacturerDevDossierCommentPeerStrip({ collectionId, articleId }: Props) {
  const template = PLATFORM_CORE_B2B_MESSAGE_TEMPLATES.find((t) => t.id === 'article-tz');
  const body =
    template?.buildBody({ collectionId, articleId }) ??
    `Комментарий к ТЗ (read-only) · ${articleId} · ${collectionId}`;
  const chatHref = `${factoryMessagesWorkshop2ArticleContextHref(collectionId, articleId, {
    role: 'manufacturer',
  })}&prefill=${encodeURIComponent(body.slice(0, 120))}`;

  return (
    <div className={hubGadget.goldenPath} data-testid="mfr-dev-dossier-comment-peer-strip">
      <Link href={chatHref} data-testid="mfr-dev-dossier-comment-chat-link" className={hubGadget.goldenLink}>
        Комментарий в чат
      </Link>
    </div>
  );
}
