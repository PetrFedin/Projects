#!/usr/bin/env bash
# Dry-run merge vs main: сколько файлов в conflict (без изменения working tree).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

BASE="${1:-origin/main}"
HEAD="${2:-HEAD}"

git fetch origin main 2>/dev/null || true

if ! git rev-parse --verify "$BASE" >/dev/null 2>&1; then
  echo "[merge-conflicts] base not found: $BASE"
  exit 1
fi

MB="$(git merge-base "$BASE" "$HEAD")"
OUT="$(mktemp)"
git merge-tree "$MB" "$BASE" "$HEAD" > "$OUT" 2>/dev/null || true

python3 - "$OUT" <<'PY'
import sys
path = sys.argv[1]
conflicts = []
mode = None
with open(path, 'rb') as f:
    for line in f:
        s = line.decode('utf-8', errors='replace')
        if s.startswith('changed in both'):
            mode = 'conflict'
            continue
        if mode == 'conflict' and s.startswith('  our'):
            parts = s.split()
            if len(parts) >= 3:
                conflicts.append(parts[-1])
            mode = None
u = sorted(set(conflicts))
print(f"[merge-conflicts] {len(u)} file(s) vs main")
critical = [
    '_ai-share/synth-1-full/package.json',
    '_ai-share/synth-1-full/src/app/layout.tsx',
    '_ai-share/synth-1-full/next.config.ts',
]
for c in critical:
    mark = 'CONFLICT' if c in u else 'ok'
    print(f"  {mark}: {c}")
if u:
    print('  sample:', ', '.join(u[:5]), ('...' if len(u) > 5 else ''))
    sys.exit(2)
sys.exit(0)
PY
RC=$?
rm -f "$OUT"
exit $RC
