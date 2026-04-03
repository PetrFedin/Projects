#!/usr/bin/env bash
# Запуск Synth-1 Fashion OS (бэкенд + открытие в браузере)
set -e
cd "$(dirname "$0")"

if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null | grep -q 200; then
  echo "Запуск бэкенда на http://localhost:8000 ..."
  source .venv/bin/activate
  open "http://localhost:8000"
  exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
else
  echo "Бэкенд уже запущен: http://localhost:8000"
  open "http://localhost:8000"
fi
