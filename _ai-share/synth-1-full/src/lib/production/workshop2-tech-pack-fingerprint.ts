export async function sha256HexFull(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Короткий SHA-256 от Blob/File для отображения в досье (аудит). */
export async function sha256HexPrefix16(blob: Blob, prefixLen = 16): Promise<string> {
  const hex = await sha256HexFull(blob);
  return hex.slice(0, Math.min(prefixLen, hex.length));
}
