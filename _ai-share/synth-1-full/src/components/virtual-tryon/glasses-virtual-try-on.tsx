'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Camera, ImageIcon, Loader2, Square, Upload } from 'lucide-react';

/** Углы глаз в схеме из 478 точек MediaPipe Face Landmarker (как в Face Mesh). */
const LM_LEFT_OUTER = 33;
const LM_RIGHT_OUTER = 263;

const DEFAULT_GLASSES_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100" viewBox="0 0 240 100">
  <ellipse cx="72" cy="50" rx="52" ry="38" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="168" cy="50" rx="52" ry="38" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <path d="M124 50 h-8" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <path d="M20 48 Q10 42 8 35" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <path d="M220 48 Q230 42 232 35" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
</svg>`
);

/** Демо-оправа (SVG), если в PIM нет PNG оправы */
export const DEMO_GLASSES_DATA_URL = `data:image/svg+xml,${DEFAULT_GLASSES_SVG}`;

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';

export type GlassesVirtualTryOnProps = {
  /** Прозрачный PNG/SVG оправы (фасад), смотрящий на камеру. */
  initialGlassesUrl?: string;
  className?: string;
};

export function GlassesVirtualTryOn({ initialGlassesUrl, className }: GlassesVirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glassesImgRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<{ detectForVideo: (source: HTMLCanvasElement, ts: number) => unknown; close: () => void } | null>(null);
  const rafRef = useRef<number>(0);
  const staticBitmapRef = useRef<ImageBitmap | null>(null);

  const [status, setStatus] = useState<'idle' | 'loading-model' | 'ready' | 'running' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [glassesUrl, setGlassesUrl] = useState(initialGlassesUrl || DEMO_GLASSES_DATA_URL);
  const [scaleMul, setScaleMul] = useState(2.35);
  const [bridgeOffsetY, setBridgeOffsetY] = useState(-0.04);
  const [mirror, setMirror] = useState(true);
  const scaleMulRef = useRef(scaleMul);
  const bridgeOffsetYRef = useRef(bridgeOffsetY);
  scaleMulRef.current = scaleMul;
  bridgeOffsetYRef.current = bridgeOffsetY;

  const loadGlassesImage = useCallback((url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      glassesImgRef.current = img;
    };
    img.onerror = () => {
      glassesImgRef.current = null;
      setErrorMsg('Не удалось загрузить изображение оправы (CORS или неверный URL).');
    };
    img.src = url;
  }, []);

  useEffect(() => {
    loadGlassesImage(glassesUrl);
  }, [glassesUrl, loadGlassesImage]);

  useEffect(() => {
    if (initialGlassesUrl?.trim()) setGlassesUrl(initialGlassesUrl.trim());
  }, [initialGlassesUrl]);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const b = staticBitmapRef.current;
    if (b && 'close' in b && typeof (b as ImageBitmap).close === 'function') {
      (b as ImageBitmap).close();
    }
    staticBitmapRef.current = null;
    setStatus((s) => (s === 'running' ? 'ready' : s));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus('loading-model');
      setErrorMsg(null);
      try {
        const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const fileset = await FilesetResolver.forVisionTasks(WASM_CDN);
        const faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });
        if (cancelled) {
          faceLandmarker.close();
          return;
        }
        landmarkerRef.current = faceLandmarker;
        setStatus('ready');
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(e instanceof Error ? e.message : 'Ошибка загрузки модели');
        }
      }
    })();
    return () => {
      cancelled = true;
      stopCamera();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [stopCamera]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const lm = landmarkerRef.current;
    const gImg = glassesImgRef.current;
    if (!canvas || !lm) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bitmap = staticBitmapRef.current;
    const useVideo = streamRef.current && video && video.readyState >= 2;

    let w = 640;
    let h = 480;
    if (useVideo && video) {
      w = video.videoWidth;
      h = video.videoHeight;
    } else if (bitmap) {
      w = bitmap.width;
      h = bitmap.height;
    }

    if (w < 2 || h < 2) {
      rafRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    canvas.width = w;
    canvas.height = h;
    if (useVideo && video) {
      ctx.drawImage(video, 0, 0, w, h);
    } else if (bitmap) {
      ctx.drawImage(bitmap, 0, 0, w, h);
    } else {
      rafRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    const ts = performance.now();
    let detection: { faceLandmarks?: { x: number; y: number }[][] } | null = null;
    try {
      detection = lm.detectForVideo(canvas, ts) as { faceLandmarks?: { x: number; y: number }[][] };
    } catch {
      detection = null;
    }

    const marks = detection?.faceLandmarks?.[0];
    if (marks && gImg?.complete && gImg.naturalWidth > 0) {
      const toPx = (x: number, y: number) => ({ x: x * w, y: y * h });
      const L = toPx(marks[LM_LEFT_OUTER].x, marks[LM_LEFT_OUTER].y);
      const R = toPx(marks[LM_RIGHT_OUTER].x, marks[LM_RIGHT_OUTER].y);
      const cx = (L.x + R.x) / 2;
      const cy = (L.y + R.y) / 2 + bridgeOffsetYRef.current * h;
      const dx = R.x - L.x;
      const dy = R.y - L.y;
      const ipd = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      const gw = ipd * scaleMulRef.current;
      const aspect = gImg.naturalHeight / gImg.naturalWidth;
      const gh = gw * aspect;
      const anchorY = gh * 0.38;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.drawImage(gImg, -gw / 2, -anchorY, gw, gh);
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(drawFrame);
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        await v.play();
      }
      setStatus('running');
      rafRef.current = requestAnimationFrame(drawFrame);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Нет доступа к камере');
    }
  };

  const onUploadFile = async (f: File | null) => {
    if (!f?.type.startsWith('image/')) return;
    setErrorMsg(null);
    stopCamera();
    try {
      const bmp = await createImageBitmap(f);
      staticBitmapRef.current = bmp;
      setStatus('running');
      rafRef.current = requestAnimationFrame(drawFrame);
    } catch {
      setErrorMsg('Не удалось прочитать фото');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative overflow-hidden rounded-xl border bg-slate-950 aspect-[4/3] max-h-[min(72vh,520px)] mx-auto">
        <video ref={videoRef} className="absolute opacity-0 pointer-events-none w-px h-px" playsInline muted />
        <canvas
          ref={canvasRef}
          className={cn('block w-full h-full object-contain bg-slate-900', mirror && '-scale-x-100')}
        />
        {status === 'loading-model' && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/80 text-slate-200 text-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
            Загрузка детектора лица…
          </div>
        )}
      </div>

      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={startCamera} disabled={status === 'loading-model' || status === 'error'}>
          <Camera className="h-4 w-4 mr-1.5" />
          Камера
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={stopCamera} disabled={status !== 'running'}>
          <Square className="h-4 w-4 mr-1.5" />
          Стоп
        </Button>
        <Label className="inline-flex items-center gap-2 cursor-pointer text-sm border rounded-md px-3 py-1.5 bg-background hover:bg-muted/50">
          <Upload className="h-4 w-4" />
          Фото лица
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onUploadFile(e.target.files?.[0] ?? null)}
          />
        </Label>
        <Button type="button" size="sm" variant={mirror ? 'secondary' : 'outline'} onClick={() => setMirror((m) => !m)}>
          Зеркало {mirror ? 'вкл' : 'выкл'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <ImageIcon className="h-3.5 w-3.5" />
            URL прозрачного фото оправы (PNG/WebP)
          </Label>
          <Input
            value={glassesUrl.startsWith('data:') ? '' : glassesUrl}
            placeholder="https://…/frame.png"
            onChange={(e) => {
              const v = e.target.value.trim();
              if (v) setGlassesUrl(v);
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => setGlassesUrl(DEMO_GLASSES_DATA_URL)}>
            Демо-оправа (SVG)
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Масштаб к межзрачковому расстоянию ({scaleMul.toFixed(2)}×)</Label>
            <input
              type="range"
              min={1.6}
              max={3.4}
              step={0.05}
              value={scaleMul}
              onChange={(e) => setScaleMul(parseFloat(e.target.value))}
              className="mt-2 w-full accent-foreground"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Сдвиг по вертикали (мостик)</Label>
            <input
              type="range"
              min={-0.12}
              max={0.12}
              step={0.005}
              value={bridgeOffsetY}
              onChange={(e) => setBridgeOffsetY(parseFloat(e.target.value))}
              className="mt-2 w-full accent-foreground"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Опора на{' '}
        <a
          className="underline hover:text-foreground"
          href="https://github.com/google/mediapipe"
          target="_blank"
          rel="noreferrer"
        >
          MediaPipe Face Landmarker
        </a>
        : по видео или фото находятся уголки глаз, по межзрачковому расстоянию масштабируется и поворачивается слой оправы.
        Для бренда: выложите фронтальное изображение оправы с прозрачным фоном и передайте SKU URL в этот блок как опцию карточки товара.
      </p>
    </div>
  );
}
