#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$script_dir"

if ! command -v zig >/dev/null 2>&1; then
  echo "zig not found. Install Zig to build noita_random wasm." >&2
  exit 1
fi

exports=(
  malloc
  free
  SetWorldSeedRaw
  GetWorldSeedRaw
  GetWidthFromPixRaw
  GetWidthFromPixWithOffsetRaw
  GetGlobalPosX
  GetGlobalPosY
  GetTilePosX
  GetTilePosY
  PngImageDecode
  PngImageDelete
  MapHandlerNew
  MapHandlerDelete
  MapHandlerMapPtr
  MapHandlerBigMapPtr
  MapHandlerGenerateMap
  MapHandlerToBig
  MapHandlerDrawImageData
  GenerateMapRaw
  GeneratePathMapRaw
)

export_flags=(-Wl,--export-memory -Wl,--initial-memory=67108864 -Wl,--strip-all)
for export_name in "${exports[@]}"; do
  export_flags+=("-Wl,--export=$export_name")
done

zig c++ \
  -target wasm32-wasi \
  -mexec-model=reactor \
  -O3 \
  -std=c++20 \
  -fno-exceptions \
  -fno-rtti \
  "${export_flags[@]}" \
  -o noita_random.wasm \
  src/wasm_in.cpp

du -sh noita_random.wasm
echo ""
