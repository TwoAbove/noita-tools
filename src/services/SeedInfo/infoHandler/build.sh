#!/bin/bash
source "/app/emsdk/emsdk_env.sh"

# echo "Script triggered for file: $1"

# Function to compile with emscripten
compile_module() {
  local output_file=$1
  local extra_flags=$2

  em++ --bind -O3 $extra_flags \
    -o $output_file.mjs \
    --std=c++20 \
    --extern-pre-js="$script_dir/pre.js" \
    --emit-tsd $output_file.d.ts \
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
cd "$script_dir"

compile() {
  dir="$1"
  module_name="$2"
  output_file="${module_name}"

  echo "Compiling $module_name"

  cd "$dir"

  # Compile the module
  compile_module "$output_file" "-msse2 -msimd128"
  compile_module "$output_file-base" ""

  du -sh "$output_file.wasm"
  du -sh "$output_file.mjs"

  cd "$script_dir"
}

compile "InfoProviders/Alchemy" "Alchemy"
compile "InfoProviders/FungalShift" "Fungal"
compile "InfoProviders/Map/module" "Map"
