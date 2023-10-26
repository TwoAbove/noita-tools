#!/bin/bash

# Get the list of all directories containing .cpp files
directories=($(find ./InfoProviders -type d -iname '*' -exec sh -c '
    for dir do
        if find "$dir" -maxdepth 1 -name "*.cpp" | read -r _; then
            printf "%s\n" "$dir"
        fi
    done' sh {} +))

# Get the script's directory
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Build each module
for dir in "${directories[@]}"; do
  module_name=$(basename "$dir")
  output_file="${module_name}"

  cd "$dir"

  # Compile using emscripten
  em++ --bind -O3 -msse2 -msimd128 \
    -o $output_file.mjs \
    --std=c++20 \
    --extern-pre-js="$script_dir/pre.js" \
    --closure 1 \
    --embind-emit-tsd $output_file.d.ts \
    -s WASM=1 \
    -s FILESYSTEM=0 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s NO_EXIT_RUNTIME=1 \
    -s ENVIRONMENT="web,worker,node" \
    -s EXPORT_NAME="create_${module_name}" \
    -s "EXPORTED_FUNCTIONS=['_free','_malloc']" \
    *.cpp

  em++ --bind -O3 \
    -o $output_file-base.mjs \
    --std=c++20 \
    --extern-pre-js="$script_dir/pre.js" \
    --closure 1 \
    --embind-emit-tsd $output_file.d.ts \
    -s WASM=1 \
    -s FILESYSTEM=0 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s NO_EXIT_RUNTIME=1 \
    -s ENVIRONMENT="web,worker,node" \
    -s EXPORT_NAME="create_${module_name}" \
    -s "EXPORTED_FUNCTIONS=['_free','_malloc']" \
    *.cpp

  cd "$script_dir"
done
