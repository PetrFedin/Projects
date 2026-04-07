import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

export type SketchBoardExportAnnotation = Pick<
  Workshop2Phase1CategorySketchAnnotation,
  'xPct' | 'yPct' | 'priority' | 'stage'
> & { index: number };

const W = 1600;
const H = Math.round((W * 3) / 4);

function pinColor(a: SketchBoardExportAnnotation): string {
  if (a.priority === 'critical') return '#e11d48';
  if (a.stage === 'qc') return '#d97706';
  return '#0d9488';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load'));
    img.src = src;
  });
}

export async function renderSketchBoardToPngBlob(opts: {
  imageDataUrl?: string;
  annotations: SketchBoardExportAnnotation[];
  subtitle?: string;
}): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  if (opts.imageDataUrl) {
    try {
      const img = await loadImage(opts.imageDataUrl);
      const ir = img.width / img.height;
      const cr = W / H;
      let dw = W;
      let dh = H;
      let dx = 0;
      let dy = 0;
      if (ir > cr) {
        dh = W / ir;
        dy = (H - dh) / 2;
      } else {
        dw = H * ir;
        dx = (W - dw) / 2;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#64748b';
      ctx.font = '24px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Не удалось отрисовать подложку', W / 2, H / 2);
    }
  } else {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#64748b';
    ctx.font = '22px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Типовой силуэт (в PNG не включён — загрузите подложку)', W / 2, H / 2 - 12);
    ctx.font = '16px system-ui,sans-serif';
    ctx.fillText('Метки ниже на условном поле 4∶3', W / 2, H / 2 + 18);
  }

  if (opts.subtitle?.trim()) {
    ctx.fillStyle = 'rgba(15,23,42,0.75)';
    ctx.fillRect(0, 0, W, 44);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 16px system-ui,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(opts.subtitle.trim().slice(0, 120), 16, 28);
  }

  const r = 22;
  for (const a of opts.annotations) {
    const x = (a.xPct / 100) * W;
    const y = (a.yPct / 100) * H;
    ctx.beginPath();
    ctx.fillStyle = pinColor(a);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(a.index + 1), x, y);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('blob'));
        else resolve(blob);
      },
      'image/png',
      0.92
    );
  });
}

/**
 * PNG с подложкой (или серой заглушкой) и кругами меток. Работает в браузере без внешних библиотек.
 */
export async function downloadSketchBoardPng(opts: {
  imageDataUrl?: string;
  annotations: SketchBoardExportAnnotation[];
  fileName: string;
  subtitle?: string;
}): Promise<void> {
  const blob = await renderSketchBoardToPngBlob({
    imageDataUrl: opts.imageDataUrl,
    annotations: opts.annotations,
    subtitle: opts.subtitle,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.fileName.endsWith('.png') ? opts.fileName : `${opts.fileName}.png`;
  a.click();
  URL.revokeObjectURL(url);
}
