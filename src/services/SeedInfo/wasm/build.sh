#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v zig >/dev/null 2>&1; then
  echo "zig not found. Install Zig to build SeedInfo wasm modules." >&2
  exit 1
fi

build_module() {
  local name="$1"
  local entry="$2"
  local output="$3"

  echo "Building $name wasm"

  zig build-exe \
    -target wasm32-freestanding \
    -O ReleaseSmall \
    -fno-entry \
    -rdynamic \
    --dep nolla_prng \
    --dep materials \
    -Mroot="$script_dir/entries/$entry.zig" \
    -Mnolla_prng="$script_dir/core/nolla_prng.zig" \
    -Mmaterials="$script_dir/core/materials.zig" \
    -femit-bin="$script_dir/$output"

  du -sh "$script_dir/$output"
}

target="${1:-all}"
case "$target" in
  all | rng | alchemy | fungal) ;;
  *entries/rng.zig | *rng.zig) target="rng" ;;
  *entries/alchemy.zig | *alchemy.zig) target="alchemy" ;;
  *entries/fungal.zig | *fungal.zig) target="fungal" ;;
  *) target="all" ;;
esac

case "$target" in
  rng)
    build_module "rng" "rng" "rng.wasm"
    ;;
  alchemy)
    build_module "alchemy" "alchemy" "../infoHandler/InfoProviders/Alchemy/Alchemy.wasm"
    ;;
  fungal)
    build_module "fungal" "fungal" "../infoHandler/InfoProviders/FungalShift/FungalShift.wasm"
    ;;
  all)
    build_module "rng" "rng" "rng.wasm"
    build_module "alchemy" "alchemy" "../infoHandler/InfoProviders/Alchemy/Alchemy.wasm"
    build_module "fungal" "fungal" "../infoHandler/InfoProviders/FungalShift/FungalShift.wasm"
    ;;
esac

echo ""
