'use client';

import Image from 'next/image';
import { memo, useEffect, useRef, useState, type Ref } from 'react';
import { Loader2, PictureInPicture2, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ScrollVideoSources } from '@/lib/product-scroll-switcher';
import type { Product, ProductScrollSwitcherSection } from '@/lib/types';
import { RunwaySectionIndicator } from '@/components/product/scroll-switcher/RunwaySectionIndicator';
import { t } from '@/lib/runway/runway-i18n';

interface SwitcherStageProps {
  product: Product;
  current: ProductScrollSwitcherSection;
  activeSection: number;
  sectionCount: number;
  stageImageUrl?: string;
  prevImageUrl?: string;
  /** Видео активной секции (sectionVideoUrl или product fallback). */
  videoSources?: ScrollVideoSources;
  /** Есть ли отдельные клипы по секциям — crossfade вместо scrub. */
  usePerSectionVideo?: boolean;
  canUseVideo: boolean;
  videoReady: boolean;
  videoLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stageBackground: string;
  prefersReducedMotion: boolean;
  compact: boolean;
  shouldLoadMedia: boolean;
  enableKenBurns?: boolean;
  onVideoLoaded: () => void;
  /** loadeddata секции 0 — LCP hero metric. */
  onHeroVideoLoadedData?: () => void;
  onVideoError: () => void;
  /** Повторная попытка загрузки видео (1×) при сбое сети. */
  videoRetryKey?: number;
  /** Minimal layout — без overlay pill/swatch на сцене. */
  minimalChrome?: boolean;
}

/** Центральная сцена: hybrid — секционное фото + видео (scrub или per-section crossfade). */
function SwitcherStageInner({
  current,
  activeSection,
  sectionCount,
  stageImageUrl,
  prevImageUrl,
  videoSources,
  usePerSectionVideo = false,
  canUseVideo,
  videoReady,
  videoLoading,
  videoRef,
  stageBackground,
  prefersReducedMotion,
  compact,
  shouldLoadMedia,
  enableKenBurns = false,
  onVideoLoaded,
  onHeroVideoLoadedData,
  onVideoError,
  videoRetryKey = 0,
  minimalChrome = false,
}: SwitcherStageProps) {
  const retryAttemptedRef = useRef(false);
  const transitionClass = prefersReducedMotion
    ? 'transition-none'
    : 'transition-opacity duration-300 ease-out';
  const bgTransitionClass = prefersReducedMotion
    ? 'transition-none'
    : 'transition-[background-color] duration-300 ease-out';
  const prevSectionRef = useRef(activeSection);
  const prevVideoUrlRef = useRef<string | undefined>(undefined);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudioTrack, setHasAudioTrack] = useState(false);
  const [crossfadeOpacity, setCrossfadeOpacity] = useState(1);
  const [pipSupported, setPipSupported] = useState(false);
  const showKenBurns =
    enableKenBurns && !canUseVideo && !prefersReducedMotion && Boolean(stageImageUrl);

  const isHeroSection = activeSection === 0;
  const videoPreload = !shouldLoadMedia ? 'none' : isHeroSection ? 'auto' : 'metadata';
  const activeVideoUrl = videoSources?.mp4 ?? videoSources?.webm;

  useEffect(() => {
    setPipSupported(
      typeof document !== 'undefined' &&
        'pictureInPictureEnabled' in document &&
        Boolean(document.pictureInPictureEnabled)
    );
  }, []);

  useEffect(() => {
    setIsMuted(true);
    setHasAudioTrack(false);
    retryAttemptedRef.current = false;
  }, [canUseVideo, activeVideoUrl, videoRetryKey]);

  const handlePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video || !pipSupported) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      /* PiP отклонён браузером */
    }
  };

  // Scrub одного файла при смене секции (legacy mode) — отключаем при reduced motion.
  useEffect(() => {
    if (usePerSectionVideo || prefersReducedMotion) return;
    if (prevSectionRef.current === activeSection) return;
    prevSectionRef.current = activeSection;

    const video = videoRef.current;
    if (!canUseVideo || !videoReady || !video) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    const midpoint = (activeSection + 0.5) / Math.max(1, sectionCount);
    video.currentTime = midpoint * video.duration;
  }, [
    activeSection,
    sectionCount,
    canUseVideo,
    videoReady,
    videoRef,
    usePerSectionVideo,
    prefersReducedMotion,
  ]);

  // Per-section: crossfade при смене src.
  useEffect(() => {
    if (!usePerSectionVideo || !canUseVideo) return;
    const video = videoRef.current;
    if (!video || !activeVideoUrl) return;

    if (prevVideoUrlRef.current && prevVideoUrlRef.current !== activeVideoUrl) {
      setCrossfadeOpacity(0);
      const t = window.setTimeout(() => setCrossfadeOpacity(1), prefersReducedMotion ? 0 : 120);
      return () => window.clearTimeout(t);
    }
    prevVideoUrlRef.current = activeVideoUrl;
    prevSectionRef.current = activeSection;
  }, [
    activeVideoUrl,
    activeSection,
    canUseVideo,
    usePerSectionVideo,
    prefersReducedMotion,
    videoRef,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted, videoRef, videoReady]);

  const showVideoLayer = canUseVideo && videoReady && !prefersReducedMotion;

  const handleVideoMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const audioHint =
        typeof (video as HTMLVideoElement & { audioTracks?: { length: number } }).audioTracks !==
        'undefined'
          ? ((video as HTMLVideoElement & { audioTracks?: { length: number } }).audioTracks
              ?.length ?? 0) > 0
          : video.duration > 0;
      setHasAudioTrack(audioHint);
    }
    onVideoLoaded();
  };

  const handleCanPlay = () => {
    if (usePerSectionVideo) {
      const video = videoRef.current;
      if (video) {
        video.play().catch(() => undefined);
      }
    }
  };

  const handleVideoError = () => {
    const video = videoRef.current;
    if (video && !retryAttemptedRef.current && activeVideoUrl) {
      retryAttemptedRef.current = true;
      const separator = activeVideoUrl.includes('?') ? '&' : '?';
      video.load();
      const sources = video.querySelectorAll('source');
      sources.forEach((source) => {
        const base = source.getAttribute('src')?.split('?')[0];
        if (base) source.setAttribute('src', `${base}${separator}rvretry=1`);
      });
      video.load();
      return;
    }
    onVideoError();
  };

  return (
    <div
      className={cn('absolute inset-0 flex items-center justify-center', bgTransitionClass)}
      style={{ backgroundColor: stageBackground }}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[680px] items-center justify-center px-4 py-16 md:py-20">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border border-border bg-card shadow-sm',
            compact ? 'aspect-[4/5] w-full max-w-[340px]' : 'aspect-[4/5] w-full max-w-[680px]'
          )}
          role="img"
          aria-roledescription={t('runway.aria.switcherStage')}
          aria-label={t('runway.aria.variant', { label: current.label })}
        >
          {canUseVideo ? (
            <>
              {videoLoading && !videoReady ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/80">
                  {stageImageUrl ? (
                    <Image
                      src={stageImageUrl}
                      alt=""
                      fill
                      className="object-cover opacity-60"
                      sizes={
                        compact
                          ? '(max-width: 768px) 50vw, 340px'
                          : '(max-width: 768px) 100vw, 680px'
                      }
                      priority={isHeroSection}
                      fetchPriority={isHeroSection ? 'high' : 'auto'}
                      aria-hidden
                    />
                  ) : videoSources?.poster ? (
                    <Image
                      src={videoSources.poster}
                      alt=""
                      fill
                      className="object-cover opacity-40"
                      sizes="(max-width: 768px) 100vw, 680px"
                      priority={isHeroSection}
                      fetchPriority={isHeroSection ? 'high' : 'auto'}
                      aria-hidden
                    />
                  ) : null}
                  <Loader2
                    className="relative z-10 h-8 w-8 animate-spin text-muted-foreground"
                    aria-hidden
                  />
                </div>
              ) : null}
              <video
                key={
                  usePerSectionVideo
                    ? `section-video-${activeSection}-${activeVideoUrl}`
                    : 'shared-video'
                }
                ref={videoRef as Ref<HTMLVideoElement>}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover',
                  usePerSectionVideo
                    ? 'transition-opacity duration-300 ease-out'
                    : 'transition-opacity duration-300',
                  !usePerSectionVideo && (showVideoLayer ? 'opacity-35' : 'opacity-0')
                )}
                style={
                  usePerSectionVideo && showVideoLayer
                    ? { opacity: crossfadeOpacity * 0.35 }
                    : undefined
                }
                muted={isMuted}
                playsInline
                autoPlay={usePerSectionVideo}
                loop={usePerSectionVideo}
                preload={videoPreload}
                poster={videoSources?.poster}
                data-runway-video-preload={videoPreload}
                data-runway-hero-priority={isHeroSection ? 'high' : 'auto'}
                onLoadedMetadata={handleVideoMetadata}
                onLoadedData={() => {
                  if (isHeroSection) onHeroVideoLoadedData?.();
                }}
                onCanPlay={handleCanPlay}
                onError={handleVideoError}
                aria-hidden
              >
                {videoSources?.mp4 ? <source src={videoSources.mp4} type="video/mp4" /> : null}
                {videoSources?.webm ? <source src={videoSources.webm} type="video/webm" /> : null}
              </video>
              {showVideoLayer ? (
                <div className="pointer-events-none absolute left-3 top-3 z-[3] flex items-center gap-1.5">
                  <span className="animate-runway-play-pulse flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                    <Play className="ml-0.5 h-3 w-3 fill-current" aria-hidden />
                  </span>
                </div>
              ) : null}
              {showVideoLayer && hasAudioTrack ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="pointer-events-auto absolute right-3 top-3 z-[3] h-8 w-8 border-white/30 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={
                    isMuted ? t('runway.aria.videoMuteOn') : t('runway.aria.videoMuteOff')
                  }
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              ) : null}
              {showVideoLayer && pipSupported ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="pointer-events-auto absolute right-3 top-12 z-[3] h-8 w-8 border-white/30 bg-black/50 text-white hover:bg-black/70"
                  onClick={handlePictureInPicture}
                  aria-label={t('runway.aria.pictureInPicture')}
                >
                  <PictureInPicture2 className="h-4 w-4" />
                </Button>
              ) : null}
            </>
          ) : null}

          <div className="relative z-[1] h-full w-full overflow-hidden">
            {prevImageUrl && prevImageUrl !== stageImageUrl ? (
              <Image
                key={`prev-${activeSection}`}
                src={prevImageUrl}
                alt=""
                fill
                className={cn('object-cover opacity-0', transitionClass)}
                sizes={
                  compact ? '(max-width: 768px) 50vw, 340px' : '(max-width: 768px) 100vw, 680px'
                }
                aria-hidden
              />
            ) : null}
            {stageImageUrl ? (
              <Image
                key={`stage-${current.id}-${activeSection}`}
                src={stageImageUrl}
                alt={current.label}
                fill
                className={cn(
                  'object-cover',
                  transitionClass,
                  showKenBurns && 'animate-runway-ken-burns',
                  !prefersReducedMotion && !showKenBurns && 'animate-runway-section-enter'
                )}
                sizes={
                  compact ? '(max-width: 768px) 50vw, 340px' : '(max-width: 768px) 100vw, 680px'
                }
                priority={activeSection === 0}
                fetchPriority={activeSection === 0 ? 'high' : 'auto'}
                loading={activeSection === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div
                className={cn('h-full w-full', transitionClass)}
                style={{ backgroundColor: current.color }}
                aria-hidden
              />
            )}
          </div>

          {!minimalChrome ? (
            <RunwaySectionIndicator
              label={current.label}
              colorHex={current.color}
              activeSection={activeSection}
              sectionCount={sectionCount}
              prefersReducedMotion={prefersReducedMotion}
            />
          ) : null}

          {!minimalChrome ? (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-[2] -translate-x-1/2 md:hidden">
              <span
                key={`pill-mobile-${current.id}-${activeSection}`}
                className={cn(
                  'inline-block rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur-sm',
                  !prefersReducedMotion && 'animate-runway-section-enter'
                )}
              >
                {current.label}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const SwitcherStage = memo(SwitcherStageInner);
