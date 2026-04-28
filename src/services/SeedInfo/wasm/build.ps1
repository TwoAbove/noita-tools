param(
  [string]$Module = "all"
)

if (!(Get-Command zig -ErrorAction Ignore)) {
  Write-Error -Message "Zig not found! Did you add it to the PATH?" -Exception ([System.Management.Automation.CommandNotFoundException]::new()) -ErrorAction Stop
}

$ScriptDir = $PSScriptRoot

function Build-ZigModule {
  param(
    [string]$Entry,
    [string]$Output
  )

  $entryPath = Join-Path $ScriptDir "entries\$Entry.zig"
  $outputPath = Join-Path $ScriptDir $Output
  $prngPath = Join-Path $ScriptDir "core\nolla_prng.zig"
  $materialsPath = Join-Path $ScriptDir "core\materials.zig"

  Write-Host "Building $Entry wasm"

  zig build-exe `
    -target wasm32-freestanding `
    -O ReleaseSmall `
    -fno-entry `
    -rdynamic `
    --dep nolla_prng `
    --dep materials `
    "-Mroot=$entryPath" `
    "-Mnolla_prng=$prngPath" `
    "-Mmaterials=$materialsPath" `
    "-femit-bin=$outputPath"

  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }

  Get-Item $outputPath | ForEach-Object {
    Write-Host "$([Math]::Round($_.Length / 1KB, 1))K $($_.FullName)"
  }
}

switch -Wildcard ($Module) {
  "all" { $target = "all"; break }
  "rng" { $target = "rng"; break }
  "alchemy" { $target = "alchemy"; break }
  "fungal" { $target = "fungal"; break }
  "*entries/rng.zig" { $target = "rng"; break }
  "*rng.zig" { $target = "rng"; break }
  "*entries/alchemy.zig" { $target = "alchemy"; break }
  "*alchemy.zig" { $target = "alchemy"; break }
  "*entries/fungal.zig" { $target = "fungal"; break }
  "*fungal.zig" { $target = "fungal"; break }
  default { $target = "all" }
}

switch ($target) {
  "rng" {
    Build-ZigModule "rng" "rng.wasm"
  }
  "alchemy" {
    Build-ZigModule "alchemy" "..\infoHandler\InfoProviders\Alchemy\Alchemy.wasm"
  }
  "fungal" {
    Build-ZigModule "fungal" "..\infoHandler\InfoProviders\FungalShift\FungalShift.wasm"
  }
  "all" {
    Build-ZigModule "rng" "rng.wasm"
    Build-ZigModule "alchemy" "..\infoHandler\InfoProviders\Alchemy\Alchemy.wasm"
    Build-ZigModule "fungal" "..\infoHandler\InfoProviders\FungalShift\FungalShift.wasm"
  }
}
