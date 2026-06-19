/** Brand / W2 collection linesheet PDF (server, PG published-articles). */
export function workshop2CollectionLinesheetPdfHref(collectionId: string): string {
  return `/api/workshop2/collections/${encodeURIComponent(collectionId.trim() || 'SS27')}/linesheet.pdf`;
}
