if (!(Get-Command emcc -ErrorAction Ignore)) {
  Write-Error -Message "Emscripten Compiler Frontend (emcc) not found! Did you add it to the PATH?" -Exception ([System.Management.Automation.CommandNotFoundException]::new()) -ErrorAction Stop
}

if(!(Test-Path $PSScriptRoot\wasm_in.cpp) -or !(Test-Path $PSScriptRoot\pre.js)) {
  Write-Error -Message "This script must be placed in the same directory as files 'wasm_in.cpp' and 'pre.js'!" -Exception ([System.IO.FileNotFoundException]::new()) -ErrorAction Stop
}

emcc --bind -Oz `
  -o $PSScriptRoot\noita_random.js `
  --std=c++17 `
  --extern-pre-js="$PSScriptRoot\pre.js" `
  -s WASM=1 `
  -s STRICT_JS=1 `
  -s EXPORT_ES6=1 `
  -s FILESYSTEM=0 `
  -s ALLOW_MEMORY_GROWTH=1 `
  -s MODULARIZE=1 `
  -s ASSERTIONS=1 `
  -s NO_EXIT_RUNTIME=1 `
  -s ENVIRONMENT="web,worker" `
  -s EXPORT_NAME="create_noita_random" `
  -s "EXPORTED_FUNCTIONS=['_generate_map']" `
  -s "EXPORTED_RUNTIME_METHODS='cwrap'" `
  $PSScriptRoot\wasm_in.cpp
