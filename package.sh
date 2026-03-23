#!/usr/bin/env bash
set -euo pipefail

OUT="shoosh.xpi"

zip -r "$OUT" \
  manifest.json \
  background/ \
  content/ \
  icons/ \
  options/

echo "Packaged: $OUT"
