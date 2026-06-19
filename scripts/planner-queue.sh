#!/usr/bin/env bash
# Platform Core planner queue — CLI for Cursor agents (dev:core :3001).
set -euo pipefail
BASE="${PLANNER_API_BASE:-http://127.0.0.1:3001}"
CMD="${1:-next}"
shift || true

case "${CMD}" in
  next)
    curl -fsS "${BASE}/api/dev/platform-core/planner/next" | python3 -m json.tool
    ;;
  claim)
    ID="${1:-}"
    BODY="{\"by\":\"cli-agent\""
    [[ -n "${ID}" ]] && BODY="${BODY},\"id\":\"${ID}\""
    BODY="${BODY}}"
    curl -fsS -X POST "${BASE}/api/dev/platform-core/planner/claim" \
      -H 'Content-Type: application/json' -d "${BODY}" | python3 -m json.tool
    ;;
  complete)
    ID="${1:?task id}"
    NOTE="${2:-done}"
    curl -fsS -X POST "${BASE}/api/dev/platform-core/planner/complete" \
      -H 'Content-Type: application/json' \
      -d "$(python3 -c 'import json,sys; print(json.dumps({"id":sys.argv[1],"by":"cli-agent","note":sys.argv[2]}))' "${ID}" "${NOTE}")" | python3 -m json.tool
    ;;
  snapshot)
    curl -fsS "${BASE}/api/dev/platform-core/planner" | python3 -m json.tool
    ;;
  run)
    ID="${1:-}"
    BODY="{\"by\":\"cli-agent\""
    [[ -n "${ID}" ]] && BODY="${BODY},\"id\":\"${ID}\""
    BODY="${BODY}}"
    curl -fsS -X POST "${BASE}/api/dev/platform-core/planner/run-agents" \
      -H 'Content-Type: application/json' -d "${BODY}" | python3 -m json.tool
    ;;
  analyze)
    curl -fsS -X POST "${BASE}/api/dev/platform-core/planner/analyze" \
      -H 'Content-Type: application/json' -d '{}' | python3 -m json.tool
    ;;
  *)
    echo "Usage: planner-queue.sh [next|claim [id]|complete <id> [note]|snapshot|run [id]|analyze]" >&2
    exit 1
    ;;
esac
