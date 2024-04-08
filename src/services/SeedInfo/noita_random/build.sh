#!/bin/bash

# To watch, use
# while inotifywait -e close_write **; do sh build.sh; done

# For memory debugging, add these:
# -s WARN_UNALIGNED=1 \
# -Wover-aligned \
# -fsanitize=address \
# --profiling \

# TODO: --closure 1 seems to be bugged where it crashes the build, so check on this in the future

OS="$(uname)"
ARCH="$(uname -m)"

run_empp() {
  output_file="$1"
  shift

  em++ --bind -O3 "$@" \
    -o "$output_file" \
    --std=c++20 \
    --extern-pre-js="pre.js" \
    -s WASM=1 \
    -s FILESYSTEM=0 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s NO_EXIT_RUNTIME=1 \
    -s ENVIRONMENT="web,worker,node" \
    -s EXPORT_NAME="create_noita_random" \
    -s "EXPORTED_FUNCTIONS=['_generate_path_map','_free','_malloc']" \
    -s "EXPORTED_RUNTIME_METHODS='cwrap'" \
    src/wasm_in.cpp
}

run_empp noita_random.mjs -msse2 -msimd128
run_empp noita_random-base.mjs

# To see what the size is to sanity-check
du -sh noita_random.wasm
du -sh noita_random.mjs
echo ""
