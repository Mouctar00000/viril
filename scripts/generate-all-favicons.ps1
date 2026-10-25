Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\GLC\.gemini\antigravity-ide\brain\40efc3ee-2e10-40cb-8259-cf22b4c1ae7a\.user_uploaded\media_1792837322231.png"
$publicDir = "c:\mes proget\viril\public"
$imagesDir = "$publicDir\images"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source file does not exist: $srcPath"
    exit 1
}

# 1. Save official raw logo
Copy-Item $srcPath "$imagesDir\logo-official.png" -Force
Copy-Item $srcPath "$imagesDir\logo-phoenix-raw.png" -Force
Write-Host "1. Saved logo-official.png and updated logo-phoenix-raw.png"

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# 2. Generate crisp logo-white.png (full resolution) for Header/Footer
$whiteBmp = New-Object System.Drawing.Bitmap($srcBmp.Width, $srcBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gWhite = [System.Drawing.Graphics]::FromImage($whiteBmp)
$cmWhite = New-Object System.Drawing.Imaging.ColorMatrix
$cmWhite.Matrix00 = 0; $cmWhite.Matrix01 = 0; $cmWhite.Matrix02 = 0; $cmWhite.Matrix03 = 0; $cmWhite.Matrix04 = 0
$cmWhite.Matrix10 = 0; $cmWhite.Matrix11 = 0; $cmWhite.Matrix12 = 0; $cmWhite.Matrix13 = 0; $cmWhite.Matrix14 = 0
$cmWhite.Matrix20 = 0; $cmWhite.Matrix21 = 0; $cmWhite.Matrix22 = 0; $cmWhite.Matrix23 = 0; $cmWhite.Matrix24 = 0
$cmWhite.Matrix30 = 0; $cmWhite.Matrix31 = 0; $cmWhite.Matrix32 = 0; $cmWhite.Matrix33 = 1; $cmWhite.Matrix34 = 0
$cmWhite.Matrix40 = 1; $cmWhite.Matrix41 = 1; $cmWhite.Matrix42 = 1; $cmWhite.Matrix43 = 0; $cmWhite.Matrix44 = 1

$iaWhite = New-Object System.Drawing.Imaging.ImageAttributes
$iaWhite.SetColorMatrix($cmWhite)
$gWhite.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle(0, 0, $srcBmp.Width, $srcBmp.Height)), 0, 0, $srcBmp.Width, $srcBmp.Height, [System.Drawing.GraphicsUnit]::Pixel, $iaWhite)
$iaWhite.Dispose()
$gWhite.Dispose()

$whiteBmp.Save("$imagesDir\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
$whiteBmp.Dispose()
Write-Host "2. Generated high-res logo-white.png"

# Helper function to resize and center with aspect ratio
function Create-ResizedIcon {
    param(
        [System.Drawing.Bitmap]$source,
        [int]$size,
        [double]$paddingRatio = 0.04, # subtle padding for favicons
        [string]$variant = "black",   # "black", "white", "black_with_subtle_glow"
        [System.Drawing.Color]$background = [System.Drawing.Color]::Transparent
    )

    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($background -ne [System.Drawing.Color]::Transparent) {
        $g.Clear($background)
    } else {
        $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    }

    $pad = [int][Math]::Round($size * $paddingRatio)
    $availW = $size - (2 * $pad)
    $availH = $size - (2 * $pad)

    $aspect = $source.Width / [double]$source.Height
    if ($availW / [double]$availH -gt $aspect) {
        $drawH = $availH
        $drawW = [int][Math]::Round($drawH * $aspect)
    } else {
        $drawW = $availW
        $drawH = [int][Math]::Round($drawW / $aspect)
    }

    $destX = [int][Math]::Round(($size - $drawW) / 2.0)
    $destY = [int][Math]::Round(($size - $drawH) / 2.0)
    $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $drawW, $drawH)

    if ($variant -eq "white") {
        $cm = New-Object System.Drawing.Imaging.ColorMatrix
        $cm.Matrix00 = 0; $cm.Matrix01 = 0; $cm.Matrix02 = 0; $cm.Matrix03 = 0; $cm.Matrix04 = 0
        $cm.Matrix10 = 0; $cm.Matrix11 = 0; $cm.Matrix12 = 0; $cm.Matrix13 = 0; $cm.Matrix14 = 0
        $cm.Matrix20 = 0; $cm.Matrix21 = 0; $cm.Matrix22 = 0; $cm.Matrix23 = 0; $cm.Matrix24 = 0
        $cm.Matrix30 = 0; $cm.Matrix31 = 0; $cm.Matrix32 = 0; $cm.Matrix33 = 1; $cm.Matrix34 = 0
        $cm.Matrix40 = 1; $cm.Matrix41 = 1; $cm.Matrix42 = 1; $cm.Matrix43 = 0; $cm.Matrix44 = 1

        $ia = New-Object System.Drawing.Imaging.ImageAttributes
        $ia.SetColorMatrix($cm)
        $g.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, $ia)
        $ia.Dispose()
    } elseif ($variant -eq "black_with_subtle_glow") {
        # Subtle light contour for universal visibility
        $cmGlow = New-Object System.Drawing.Imaging.ColorMatrix
        $cmGlow.Matrix00 = 0; $cmGlow.Matrix01 = 0; $cmGlow.Matrix02 = 0; $cmGlow.Matrix03 = 0; $cmGlow.Matrix04 = 0
        $cmGlow.Matrix10 = 0; $cmGlow.Matrix11 = 0; $cmGlow.Matrix12 = 0; $cmGlow.Matrix13 = 0; $cmGlow.Matrix14 = 0
        $cmGlow.Matrix20 = 0; $cmGlow.Matrix21 = 0; $cmGlow.Matrix22 = 0; $cmGlow.Matrix23 = 0; $cmGlow.Matrix24 = 0
        $cmGlow.Matrix30 = 0; $cmGlow.Matrix31 = 0; $cmGlow.Matrix32 = 0; $cmGlow.Matrix33 = 0.45; $cmGlow.Matrix34 = 0
        $cmGlow.Matrix40 = 1; $cmGlow.Matrix41 = 1; $cmGlow.Matrix42 = 1; $cmGlow.Matrix43 = 0; $cmGlow.Matrix44 = 1

        $iaG = New-Object System.Drawing.Imaging.ImageAttributes
        $iaG.SetColorMatrix($cmGlow)
        $offsets = @(
            [int[]]@(-1, 0),
            [int[]]@(1, 0),
            [int[]]@(0, -1),
            [int[]]@(0, 1)
        )
        foreach ($off in $offsets) {
            $ox = [int]$off[0]
            $oy = [int]$off[1]
            $glowRect = New-Object System.Drawing.Rectangle(($destX + $ox), ($destY + $oy), $drawW, $drawH)
            $g.DrawImage($source, $glowRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, $iaG)
        }
        $iaG.Dispose()
        $g.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel)
    } else {
        $g.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel)
    }

    $g.Dispose()
    return $bmp
}

# 3. Generate PNG favicons (16x16, 32x32, 48x48)
$fav16 = Create-ResizedIcon -source $srcBmp -size 16 -variant "black"
$fav16.Save("$publicDir\favicon-16x16.png", [System.Drawing.Imaging.ImageFormat]::Png)

$fav32 = Create-ResizedIcon -source $srcBmp -size 32 -variant "black"
$fav32.Save("$publicDir\favicon-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)

$fav48 = Create-ResizedIcon -source $srcBmp -size 48 -variant "black"
$fav48.Save("$publicDir\favicon-48x48.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 4. Generate Dark Mode Favicons (white with crisp silhouette for dark tabs)
$favDark16 = Create-ResizedIcon -source $srcBmp -size 16 -variant "white"
$favDark16.Save("$publicDir\favicon-dark-16x16.png", [System.Drawing.Imaging.ImageFormat]::Png)

$favDark32 = Create-ResizedIcon -source $srcBmp -size 32 -variant "white"
$favDark32.Save("$publicDir\favicon-dark-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)

$favDark48 = Create-ResizedIcon -source $srcBmp -size 48 -variant "white"
$favDark48.Save("$publicDir\favicon-dark-48x48.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "3. Generated favicon PNGs (standard and dark mode variants)"

# 5. Generate Apple Touch Icon (180x180) - Luxury presentation with dark background #04050A
$appleBg = [System.Drawing.Color]::FromArgb(255, 4, 5, 10)
$appleIcon = Create-ResizedIcon -source $srcBmp -size 180 -paddingRatio 0.16 -variant "white" -background $appleBg
$appleIcon.Save("$publicDir\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$appleIcon.Dispose()
Write-Host "4. Generated apple-touch-icon.png (180x180)"

# 6. Generate Android Chrome Icons (192x192, 512x512)
$android192 = Create-ResizedIcon -source $srcBmp -size 192 -paddingRatio 0.14 -variant "white" -background $appleBg
$android192.Save("$publicDir\android-chrome-192x192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$android192.Dispose()

$android512 = Create-ResizedIcon -source $srcBmp -size 512 -paddingRatio 0.14 -variant "white" -background $appleBg
$android512.Save("$publicDir\android-chrome-512x512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$android512.Dispose()
Write-Host "5. Generated android-chrome-192x192.png and android-chrome-512x512.png"

# 7. Generate Multi-Resolution favicon.ico (16, 32, 48) with subtle glow for universal visibility on light AND dark browser tabs
$ico16 = Create-ResizedIcon -source $srcBmp -size 16 -variant "black_with_subtle_glow"
$ico32 = Create-ResizedIcon -source $srcBmp -size 32 -variant "black_with_subtle_glow"
$ico48 = Create-ResizedIcon -source $srcBmp -size 48 -variant "black_with_subtle_glow"

$icoBitmaps = @($ico16, $ico32, $ico48)
$pngBytesList = @()
foreach ($b in $icoBitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytesList += ,$ms.ToArray()
    $ms.Dispose()
}

$icoPath = "$publicDir\favicon.ico"
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)

$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type (1=ICO)
$bw.Write([uint16]$icoBitmaps.Count) # Count

$offset = 6 + (16 * $icoBitmaps.Count)
for ($i = 0; $i -lt $icoBitmaps.Count; $i++) {
    $b = $icoBitmaps[$i]
    $bytes = $pngBytesList[$i]
    $w = if ($b.Width -ge 256) { 0 } else { [byte]$b.Width }
    $h = if ($b.Height -ge 256) { 0 } else { [byte]$b.Height }
    $bw.Write([byte]$w)
    $bw.Write([byte]$h)
    $bw.Write([byte]0) # Colors
    $bw.Write([byte]0) # Reserved
    $bw.Write([uint16]1) # Planes
    $bw.Write([uint16]32) # BPP
    $bw.Write([uint32]$bytes.Length) # Image size
    $bw.Write([uint32]$offset) # Offset
    $offset += $bytes.Length
}

for ($i = 0; $i -lt $icoBitmaps.Count; $i++) {
    $bw.Write($pngBytesList[$i])
}

$bw.Dispose()
$fs.Dispose()

$fav16.Dispose(); $fav32.Dispose(); $fav48.Dispose()
$favDark16.Dispose(); $favDark32.Dispose(); $favDark48.Dispose()
$ico16.Dispose(); $ico32.Dispose(); $ico48.Dispose()
$srcBmp.Dispose()
Write-Host "6. Generated multi-resolution favicon.ico"

# 8. Generate SVG Favicon with responsive Dark / Light mode adaptation
$base64Png = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($srcPath))
$svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <style>
      :root {
        --icon-filter: none;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --icon-filter: invert(1) brightness(1.2) drop-shadow(0 0 1px rgba(255,255,255,0.9));
        }
      }
      .phoenix-official-favicon {
        filter: var(--icon-filter);
        transition: filter 0.3s ease;
      }
    </style>
  </defs>
  <!-- Official VIRIL Phoenix Emblem Logo -->
  <image class="phoenix-official-favicon" x="40" y="0" width="944" height="1024" href="data:image/png;base64,$base64Png" />
</svg>
"@

[System.IO.File]::WriteAllText("$publicDir\favicon.svg", $svgContent, [System.Text.Encoding]::UTF8)
Write-Host "7. Generated responsive favicon.svg"

# 9. Generate site.webmanifest
$manifestContent = @"
{
  "name": "VIRILACCESSORIES — Le style dans les détails",
  "short_name": "VIRIL",
  "description": "VIRILACCESSORIES — Redéfinir le luxe masculin. Accessoires premium, e-books et style pour l'homme moderne.",
  "icons": [
    {
      "src": "/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#04050A",
  "background_color": "#04050A",
  "display": "standalone",
  "start_url": "/"
}
"@

[System.IO.File]::WriteAllText("$publicDir\site.webmanifest", $manifestContent, [System.Text.Encoding]::UTF8)
Write-Host "8. Generated site.webmanifest"
Write-Host "ALL_FAVICONS_GENERATED_SUCCESS"
