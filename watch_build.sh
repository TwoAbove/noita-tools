#!/bin/bash

# Function to start watching a directory and run a build script on changes
watch_and_build() {
  local dir=$1
  local pattern=$2
  local build_script=$3

  (
    cd "$dir" && chokidar "$pattern" -c "bash $build_script \"{path}\""
  ) &
}

# Watch shared Zig SeedInfo wasm components
watch_and_build "src/services/SeedInfo/wasm" "**/*.zig" "./build.sh"

# Watch map/wang wasm bindings
watch_and_build "src/services/SeedInfo/noita_random" "**/*.cpp" "./build.sh"

echo "Watching for changes..."

# Keep the script running
wait
