'use client';

import { useEffect, useState } from 'react';

/** Локальные черновики SKU / названия строки каталога, синх при смене пропсов с родителя. */
export function useWorkshop2Phase1DossierArticleLineDrafts(input: {
  articleSku: string;
  articleName: string;
}) {
  const { articleSku, articleName } = input;
  const [skuDraft, setSkuDraft] = useState(articleSku);
  const [nameDraft, setNameDraft] = useState(articleName);

  useEffect(() => {
    setSkuDraft(articleSku);
  }, [articleSku]);

  useEffect(() => {
    setNameDraft(articleName);
  }, [articleName]);

  return { skuDraft, setSkuDraft, nameDraft, setNameDraft };
}
