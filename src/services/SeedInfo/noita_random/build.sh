#!/bin/bash

# To watch, use
# while inotifywait -e close_write wasm_in.cpp; do sh build.sh; doneSetting

emcc --bind -Os -o noita_random.js \
  --std=c++17 \
  --extern-pre-js="pre.js" \
  -s WASM=1 \
  -s STRICT_JS=1 \
  -s EXPORT_ES6=1 \
  -s FILESYSTEM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s ASSERTIONS=1 \
  -s ENVIRONMENT="web,worker" \
  -s EXPORT_NAME="create_noita_random" \
  wasm_in.cpp

# To see what the size is to sanity-check
du -sh noita_random.wasm;
du -sh noita_random.js;
