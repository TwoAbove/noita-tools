#!/bin/bash

# To watch, use
# while inotifywait -e close_write **; do sh build.sh; done

# For memory debugging, add these:
  # -s WARN_UNALIGNED=1 \
  # -Wover-aligned \
  # -fsanitize=address \
  # --profiling \

# em++ --bind \
em++ --bind -O3 -msse2 -msimd128 \
  -o noita_random.js \
  --std=c++20 \
  --extern-pre-js="pre.js" \
  --profiling \
  -s WASM=1 \
  -s STRICT_JS=1 \
  -s FILESYSTEM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s ASSERTIONS=1 \
  -s NO_EXIT_RUNTIME=1 \
  -s ENVIRONMENT="web,worker,node" \
  -s EXPORT_NAME="create_noita_random" \
  -s "EXPORTED_FUNCTIONS=['_generate_map','_generate_path_map']" \
  -s "EXPORTED_RUNTIME_METHODS='cwrap'" \
  src/wasm_in.cpp

# em++ --bind \
em++ --bind -O3 \
  -o noita_random-base.js \
  --std=c++20 \
  --extern-pre-js="pre.js" \
  -s WASM=1 \
  -s STRICT_JS=1 \
  -s FILESYSTEM=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s ASSERTIONS=1 \
  -s NO_EXIT_RUNTIME=1 \
  -s ENVIRONMENT="web,worker,node" \
  -s EXPORT_NAME="create_noita_random" \
  -s "EXPORTED_FUNCTIONS=['_generate_map','_generate_path_map']" \
  -s "EXPORTED_RUNTIME_METHODS='cwrap'" \
  src/wasm_in.cpp

# To see what the size is to sanity-check
du -sh noita_random.wasm;
du -sh noita_random.js;
echo "";
