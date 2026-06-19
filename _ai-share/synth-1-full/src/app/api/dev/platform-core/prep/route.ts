import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import path from 'node:path';

function monorepoRoot() {
  return path.join(process.cwd(), '../..');
}

/** Dev: поднять PG + seed (фоном). Требует OrbStack. */
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const root = monorepoRoot();
  const log = path.join(root, '.planning', 'syntha-prep.log');
  const prepScript = path.join(root, 'scripts/desktop/syntha-prep.sh');
  const child = spawn('bash', [prepScript], { cwd: root, detached: true, stdio: 'ignore' });
  child.unref();
  return NextResponse.json({
    ok: true,
    message: 'Запущено: db:core:up + core:bootstrap. Подождите ~1–2 мин и нажмите «Проверить».',
    log,
  });
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  try {
    const r = await fetch('http://127.0.0.1:3001/api/workshop2/platform-core/health', {
      cache: 'no-store',
    });
    const j = await r.json();
    return NextResponse.json({ ok: true, health: j });
  } catch {
    return NextResponse.json({ ok: false, health: null });
  }
}
