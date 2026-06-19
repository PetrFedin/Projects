'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  defaultHubViews,
  hubViewsToSearchParams,
  parseHubViewsFromUrl,
  readPlatformCoreHubViews,
  writePlatformCoreHubViews,
  type PlatformCoreHubViews,
} from '@/lib/platform-core-hub-view';

export function usePlatformCoreHubViews() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hubViews, setHubViews] = useState<PlatformCoreHubViews>(() => defaultHubViews());

  useEffect(() => {
    const fromUrl = parseHubViewsFromUrl(searchParams);
    if (fromUrl) {
      setHubViews(fromUrl);
      writePlatformCoreHubViews(fromUrl);
      return;
    }
    setHubViews(readPlatformCoreHubViews());
  }, [searchParams]);

  const onHubViewsChange = useCallback(
    (views: PlatformCoreHubViews) => {
      setHubViews(views);
      writePlatformCoreHubViews(views);
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      url.searchParams.delete('hub');
      const viewParams = hubViewsToSearchParams(views);
      url.searchParams.delete('views');
      for (const [key, val] of viewParams.entries()) {
        url.searchParams.set(key, val);
      }
      router.replace(`${url.pathname}?${url.searchParams.toString()}`, { scroll: false });
    },
    [router]
  );

  return { hubViews, onHubViewsChange };
}
