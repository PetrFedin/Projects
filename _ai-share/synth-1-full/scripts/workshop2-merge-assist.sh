#!/usr/bin/env bash
# Wave 52: merge assist — unit + probe, gh pr create from pr-body, NO git commit.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[merge-assist] unit tests…"
npm run test:workshop2:unit

BASE_URL="${WORKSHOP2_PROBE_BASE_URL:-http://127.0.0.1:3123}"
echo "[merge-assist] probe-alert against ${BASE_URL}…"
node scripts/workshop2-probe-alert.mjs "$BASE_URL"

PR_BODY="${ROOT}/.planning/workshop2-pr-body.md"
if [[ ! -f "$PR_BODY" ]]; then
  echo "[merge-assist] generating minimal pr-body…"
  mkdir -p .planning
  cat > "$PR_BODY" <<'EOF'
## Summary
- Wave 52 prod live: cutover dashboard, brand registry, probe scripts.

## Test plan
- [ ] npm run test:workshop2:unit
- [ ] node scripts/workshop2-probe-alert.mjs
- [ ] Human UAT signoff ops + staging
EOF
fi

if command -v gh >/dev/null 2>&1; then
  echo "[merge-assist] gh pr create --body-file ${PR_BODY}"
  gh pr create --title "feat(workshop2): Wave 52 prod live cutover" --body-file "$PR_BODY" || true
else
  echo "[merge-assist] gh CLI not found — print command only (NO commit):"
  echo "  gh pr create --title \"feat(workshop2): Wave 52 prod live cutover\" --body-file \"${PR_BODY}\""
fi

echo "[merge-assist] done (no git commit performed)"
