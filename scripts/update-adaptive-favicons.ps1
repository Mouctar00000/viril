Add-Type -AssemblyName System.Drawing

$srcBlack = "c:\mes proget\viril\public\images\logo-official.png"
$srcWhite = "c:\mes proget\viril\public\images\logo-white.png"
$publicDir = "c:\mes proget\viril\public"

if (-not (Test-Path $srcBlack)) {
    Write-Error "Black logo not found: $srcBlack"
    exit 1
}
if (-not (Test-Path $srcWhite)) {
    Write-Error "White logo not found: $srcWhite"
    exit 1
}

$bBlack = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($srcBlack))
$bWhite = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($srcWhite))

# 1. Generate Adaptive favicon.svg (with prefers-color-scheme media query)
$adaptiveSvg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <style>
      .theme-light { display: block; }
      .theme-dark { display: none; }
      @media (prefers-color-scheme: dark) {
        .theme-light { display: none; }
        .theme-dark { display: block; }
      }
    </style>
  </defs>
  <!-- Light Theme Favicon: Dark Phoenix Emblem -->
  <image class="theme-light" x="40" y="0" width="944" height="1024" href="data:image/png;base64,$bBlack" />
  <!-- Dark Theme Favicon: White Phoenix Emblem -->
  <image class="theme-dark" x="40" y="0" width="944" height="1024" href="data:image/png;base64,$bWhite" />
</svg>
"@
[System.IO.File]::WriteAllText("$publicDir\favicon.svg", $adaptiveSvg, [System.Text.Encoding]::UTF8)

# 2. Generate Dedicated favicon-light.svg (Dark logo on light background)
$lightSvg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <!-- VIRIL Official Logo - Light Theme (Dark Emblem) -->
  <image x="40" y="0" width="944" height="1024" href="data:image/png;base64,$bBlack" />
</svg>
"@
[System.IO.File]::WriteAllText("$publicDir\favicon-light.svg", $lightSvg, [System.Text.Encoding]::UTF8)

# 3. Generate Dedicated favicon-dark.svg (White logo on dark background)
$darkSvg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <!-- VIRIL Official Logo - Dark Theme (White Emblem) -->
  <image x="40" y="0" width="944" height="1024" href="data:image/png;base64,$bWhite" />
</svg>
"@
[System.IO.File]::WriteAllText("$publicDir\favicon-dark.svg", $darkSvg, [System.Text.Encoding]::UTF8)

Write-Host "Adaptive and dedicated SVGs generated successfully."
