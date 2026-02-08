#!/usr/bin/env bash
set -euo pipefail

max_retries="${MAX_RETRIES:-0}"
attempt=1

while true; do
  echo "🔁 Attempt ${attempt}: Installing dependencies..."
  if npm install --omit=dev; then
    echo "✅ npm dependencies installed."
  else
    echo "⚠️ npm install failed."
  fi

  echo "🔁 Attempt ${attempt}: Installing Playwright browsers..."
  if npx playwright install --with-deps; then
    echo "✅ Playwright browsers installed."
    exit 0
  else
    echo "⚠️ Playwright install failed."
  fi

  if [ "${max_retries}" -gt 0 ] && [ "${attempt}" -ge "${max_retries}" ]; then
    echo "❌ Reached MAX_RETRIES=${max_retries}. Exiting."
    exit 1
  fi

  attempt=$((attempt + 1))
  echo "⏳ Retrying in 5 seconds... (CTRL+C to stop)"
  sleep 5
done
