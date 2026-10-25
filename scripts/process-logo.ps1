Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\GLC\.gemini\antigravity-ide\brain\9d95c0d2-1dfb-4d83-9162-d8ea1a7f527b\.user_uploaded\media_1792344914539.png"
Copy-Item $srcPath "c:\mes proget\viril\public\images\logo-phoenix-raw.png" -Force

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
        if ($lum -lt 25) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } elseif ($lum -gt 210) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        } else {
            $alpha = [int](($lum - 25) / 185.0 * 255)
            if ($alpha -gt 255) { $alpha = 255 }
            if ($alpha -lt 0) { $alpha = 0 }
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
        }
    }
}

$bmp.Dispose()
$newBmp.Save("c:\mes proget\viril\public\images\logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Dispose()

Write-Host "LOGO_PROCESSED_SUCCESS"
