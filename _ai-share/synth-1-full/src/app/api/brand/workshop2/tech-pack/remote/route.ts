import { NextResponse } from 'next/server';
import { w2TechPackRemoteUploadServerConfigured } from '@/lib/server/w2-tech-pack-remote-s3';

/**
 * Клиент узнаёт, показывать ли статусы и пытаться ли заливку (без утечки учёток — только флаг).
 */
export function GET() {
  return NextResponse.json({ enabled: w2TechPackRemoteUploadServerConfigured() });
}
