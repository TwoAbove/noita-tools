#!/bin/bash

# echo "Script triggered for file: $1"

# Function to compile with emscripten
compile_module() {
  local output_file=$1
  local extra_flags=$2

  em++ --bind -O3 $extra_flags \
    -o $output_file.mjs \
    --std=c++20 \
    --extern-pre-js="$script_dir/pre.js" \
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
}

# Get the script's directory
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if a file path is provided
if [ "$#" -eq 1 ]; then
  changed_file="$1"
  dir=$(dirname "$changed_file")
  module_name=$(basename "$dir")

  if [[ "$changed_file" == *.cpp ]]; then
    output_file="${module_name}"
    cd "$dir"

    # Compile only the module related to the changed file
    compile_module "$output_file" "-msse2 -msimd128"
    compile_module "$output_file-base" ""

    du -sh "$output_file.wasm"
    du -sh "$output_file.mjs"

    cd "$script_dir"
  fi
else
  echo "No file path provided"
fi
