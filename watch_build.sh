#!/bin/bash

# Function to start watching a directory and run a build script on changes
watch_and_build() {
  local dir=$1
  local pattern=$2
  local build_script=$3

  (
    cd "$dir"
    fswatch $pattern | while read -r file; do
      # echo "Script triggered for file: $dir $file"
      bash $build_script $file
    done
  ) &
}

# Watch 'infoHandler' directory for changes in .cpp files
watch_and_build "src/services/SeedInfo/infoHandler" "**/**/*.cpp" "./build.sh"

# Watch 'noita_random' directory for any changes
watch_and_build "src/services/SeedInfo/noita_random" "**/*.cpp" "./build.sh"

echo "Watching for changes..."

# Keep the script running
wait
