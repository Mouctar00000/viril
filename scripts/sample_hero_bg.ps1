Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "public/images/hero-frame0-master.png"))
$bmp = New-Object System.Drawing.Bitmap $img
$w = $bmp.Width
$h = $bmp.Height
Write-Output "Image Dimensions: $w x $h"

function SamplePixel($x, $y) {
    $c = $bmp.GetPixel($x, $y)
    $hex = "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
    return "($x, $y): R=$($c.R), G=$($c.G), B=$($c.B) -> $hex"
}

Write-Output "Top-left: $(SamplePixel 10 10)"
Write-Output "Top-center: $(SamplePixel ([int]($w/2)) 10)"
Write-Output "Top-right: $(SamplePixel ($w - 10) 10)"
Write-Output "Mid-left: $(SamplePixel 10 ([int]($h/2)))"
Write-Output "Mid-right: $(SamplePixel ($w - 10) ([int]($h/2)))"
Write-Output "Bottom-left: $(SamplePixel 10 ($h - 10))"
Write-Output "Bottom-center: $(SamplePixel ([int]($w/2)) ($h - 10))"
Write-Output "Bottom-right: $(SamplePixel ($w - 10) ($h - 10))"

# Check an area in the background surrounding the figures (x=100, y=300)
Write-Output "Left-bg (100, 300): $(SamplePixel 100 300)"
Write-Output "Right-bg ($($w - 100), 300): $(SamplePixel ($w - 100) 300)"
Write-Output "Left-bg (150, 700): $(SamplePixel 150 700)"
Write-Output "Right-bg ($($w - 150), 700): $(SamplePixel ($w - 150) 700)"

$bmp.Dispose()
$img.Dispose()
