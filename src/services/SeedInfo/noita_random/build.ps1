if (!(Get-Command zig -ErrorAction Ignore)) {
  Write-Error -Message "Zig not found! Did you add it to the PATH?" -Exception ([System.Management.Automation.CommandNotFoundException]::new()) -ErrorAction Stop
}

if (!(Test-Path $PSScriptRoot\src\wasm_in.cpp)) {
  Write-Error -Message "Missing src\wasm_in.cpp" -Exception ([System.IO.FileNotFoundException]::new()) -ErrorAction Stop
}

$exports = @(
  "malloc",
  "free",
  "SetWorldSeedRaw",
  "GetWorldSeedRaw",
  "GetWidthFromPixRaw",
  "GetWidthFromPixWithOffsetRaw",
  "GetGlobalPosX",
  "GetGlobalPosY",
  "GetTilePosX",
  "GetTilePosY",
  "PngImageDecode",
  "PngImageDelete",
  "MapHandlerNew",
  "MapHandlerDelete",
  "MapHandlerMapPtr",
  "MapHandlerBigMapPtr",
  "MapHandlerGenerateMap",
  "MapHandlerToBig",
  "MapHandlerDrawImageData",
  "GenerateMapRaw",
  "GeneratePathMapRaw"
)

$exportFlags = @("-Wl,--export-memory", "-Wl,--initial-memory=67108864", "-Wl,--strip-all")
foreach ($exportName in $exports) {
  $exportFlags += "-Wl,--export=$exportName"
}

zig c++ `
  -target wasm32-wasi `
  -mexec-model=reactor `
  -O3 `
  -std=c++20 `
  -fno-exceptions `
  -fno-rtti `
  @exportFlags `
  -o $PSScriptRoot\noita_random.wasm `
  $PSScriptRoot\src\wasm_in.cpp

exit $LASTEXITCODE
