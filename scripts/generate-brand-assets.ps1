param(
    [string]$DarkSourcePath = "C:\Users\Dalibor Sojic\.gemini\antigravity-ide\brain\05e94e18-e85a-46bf-8b4e-7b8acd4b40fb\.user_uploaded\media_1790956760062.png",
    [string]$LightSourcePath = "C:\Users\Dalibor Sojic\.gemini\antigravity-ide\brain\05e94e18-e85a-46bf-8b4e-7b8acd4b40fb\.user_uploaded\media_1790956760119.png"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Get-TightCroppedSquare {
    param(
        [System.Drawing.Bitmap]$source,
        [bool]$isDark,
        [double]$paddingRatio = 0.01
    )
    $w = $source.Width
    $h = $source.Height

    $minX = $w; $minY = $h; $maxX = 0; $maxY = 0

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $source.GetPixel($x, $y)
            $isContent = $false
            if ($isDark) {
                if ($c.R -gt 35 -or $c.G -gt 35 -or $c.B -gt 35) {
                    $isContent = $true
                }
            } else {
                if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
                    $isContent = $true
                }
            }

            if ($isContent) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $objW = $maxX - $minX + 1
    $objH = $maxY - $minY + 1
    $maxDim = [Math]::Max($objW, $objH)
    $pad = [int]($maxDim * $paddingRatio)
    $cropSize = $maxDim + (2 * $pad)

    $centerX = ($minX + $maxX) / 2.0
    $centerY = ($minY + $maxY) / 2.0

    $srcX = [int]($centerX - ($cropSize / 2.0))
    $srcY = [int]($centerY - ($cropSize / 2.0))

    if ($srcX -lt 0) { $srcX = 0 }
    if ($srcY -lt 0) { $srcY = 0 }
    if (($srcX + $cropSize) -gt $w) { $srcX = $w - $cropSize }
    if (($srcY + $cropSize) -gt $h) { $srcY = $h - $cropSize }

    Write-Host "Auto-cropped emblem (Dark=$isDark): Object=${objW}x${objH} at ($minX,$minY)-($maxX,$maxY), Crop=${cropSize}x${cropSize} at ($srcX,$srcY)"

    $cropped = New-Object System.Drawing.Bitmap($cropSize, $cropSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $cropped.SetResolution($source.HorizontalResolution, $source.VerticalResolution)

    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $cropSize, $cropSize)
    $wrapMode = New-Object System.Drawing.Imaging.ImageAttributes
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $g.DrawImage($source, $destRect, $srcX, $srcY, $cropSize, $cropSize, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)
    $g.Dispose()
    $wrapMode.Dispose()

    return $cropped
}

function Resize-Image {
    param(
        [System.Drawing.Image]$source,
        [int]$width,
        [int]$height
    )
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $destImage = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $destImage.SetResolution($source.HorizontalResolution, $source.VerticalResolution)

    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $wrapMode = New-Object System.Drawing.Imaging.ImageAttributes
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $graphics.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)
    $graphics.Dispose()
    $wrapMode.Dispose()
    return $destImage
}

function Save-Png {
    param(
        [System.Drawing.Bitmap]$bitmap,
        [string]$filePath
    )
    $dir = [System.IO.Path]::GetDirectoryName($filePath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $bitmap.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Save-Ico {
    param(
        [System.Drawing.Bitmap[]]$bitmaps,
        [string]$outputPath
    )
    $dir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $pngBuffers = @()
    foreach ($bmp in $bitmaps) {
        $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngBuffers += ,$ms.ToArray()
        $ms.Dispose()
    }

    $fs = New-Object System.IO.FileStream($outputPath, [System.IO.FileMode]::Create)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]$bitmaps.Count)

    $offset = 6 + (16 * $bitmaps.Count)

    for ($i = 0; $i -lt $bitmaps.Count; $i++) {
        $bmp = $bitmaps[$i]
        $w = if ($bmp.Width -ge 256) { 0 } else { [byte]$bmp.Width }
        $h = if ($bmp.Height -ge 256) { 0 } else { [byte]$bmp.Height }
        $bytes = $pngBuffers[$i]

        $bw.Write([byte]$w)
        $bw.Write([byte]$h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([uint16]1)
        $bw.Write([uint16]32)
        $bw.Write([uint32]$bytes.Length)
        $bw.Write([uint32]$offset)

        $offset += $bytes.Length
    }

    foreach ($buf in $pngBuffers) {
        $bw.Write($buf)
    }

    $bw.Flush()
    $bw.Close()
    $fs.Close()
}

$repoRoot = (Get-Item -Path $PSScriptRoot).Parent.FullName
Write-Host "Repository root: $repoRoot"

# Ensure sources exist
if (-not (Test-Path $DarkSourcePath)) {
    throw "Dark source image not found at $DarkSourcePath"
}
if (-not (Test-Path $LightSourcePath)) {
    throw "Light source image not found at $LightSourcePath"
}

# Copy canonical originals
$sourceDir = Join-Path $repoRoot "assets\brand\source"
New-Item -ItemType Directory -Path $sourceDir -Force | Out-Null
Copy-Item -Path $DarkSourcePath -Destination (Join-Path $sourceDir "ln-ashlar-icon-dark-uncropped-1024.png") -Force
Copy-Item -Path $LightSourcePath -Destination (Join-Path $sourceDir "ln-ashlar-icon-light-uncropped-1024.png") -Force
Write-Host "Canonical uncropped source images saved to $sourceDir"

$darkRawBmp = [System.Drawing.Bitmap]::FromFile($DarkSourcePath)
$lightRawBmp = [System.Drawing.Bitmap]::FromFile($LightSourcePath)

# Perform tight cropping directly to the object (emblem)
$darkCroppedBmp = Get-TightCroppedSquare -source $darkRawBmp -isDark $true -paddingRatio 0.01
$lightCroppedBmp = Get-TightCroppedSquare -source $lightRawBmp -isDark $false -paddingRatio 0.01

# Save 1024 master cropped images
$darkMaster1024 = Resize-Image -source $darkCroppedBmp -width 1024 -height 1024
$lightMaster1024 = Resize-Image -source $lightCroppedBmp -width 1024 -height 1024

Save-Png -bitmap $darkMaster1024 -filePath (Join-Path $sourceDir "ln-ashlar-icon-dark-1024.png")
Save-Png -bitmap $lightMaster1024 -filePath (Join-Path $sourceDir "ln-ashlar-icon-light-1024.png")

$sizes = @(16, 32, 48, 64, 128, 180, 192, 256, 512)

# Pre-generate bitmap dictionaries for dark and light from tight cropped masters
$darkBmps = @{}
$lightBmps = @{}

foreach ($s in $sizes) {
    Write-Host "Generating ${s}x${s} cropped variants..."
    $darkBmps[$s] = Resize-Image -source $darkMaster1024 -width $s -height $s
    $lightBmps[$s] = Resize-Image -source $lightMaster1024 -width $s -height $s
}

# Directories to deploy
$brandDir = Join-Path $repoRoot "assets\brand"
$demoAssetsDir = Join-Path $repoRoot "demo\assets"

$targetDirs = @($brandDir, $demoAssetsDir)

foreach ($dir in $targetDirs) {
    Write-Host "Writing brand assets to $dir..."
    
    # 1. Dark favicons in all dimensions
    Save-Png -bitmap $darkBmps[16] -filePath (Join-Path $dir "favicon-dark-16x16.png")
    Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $dir "favicon-dark-32x32.png")
    Save-Png -bitmap $darkBmps[48] -filePath (Join-Path $dir "favicon-dark-48x48.png")
    Save-Png -bitmap $darkBmps[64] -filePath (Join-Path $dir "favicon-dark-64x64.png")
    Save-Png -bitmap $darkBmps[128] -filePath (Join-Path $dir "favicon-dark-128x128.png")
    Save-Png -bitmap $darkBmps[180] -filePath (Join-Path $dir "favicon-dark-180x180.png")
    Save-Png -bitmap $darkBmps[192] -filePath (Join-Path $dir "favicon-dark-192x192.png")
    Save-Png -bitmap $darkBmps[256] -filePath (Join-Path $dir "favicon-dark-256x256.png")
    Save-Png -bitmap $darkBmps[512] -filePath (Join-Path $dir "favicon-dark-512x512.png")
    Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $dir "favicon-dark.png")
    Save-Ico -bitmaps @($darkBmps[16], $darkBmps[32], $darkBmps[48]) -outputPath (Join-Path $dir "favicon-dark.ico")

    # 2. Light favicons in all dimensions
    Save-Png -bitmap $lightBmps[16] -filePath (Join-Path $dir "favicon-light-16x16.png")
    Save-Png -bitmap $lightBmps[32] -filePath (Join-Path $dir "favicon-light-32x32.png")
    Save-Png -bitmap $lightBmps[48] -filePath (Join-Path $dir "favicon-light-48x48.png")
    Save-Png -bitmap $lightBmps[64] -filePath (Join-Path $dir "favicon-light-64x64.png")
    Save-Png -bitmap $lightBmps[128] -filePath (Join-Path $dir "favicon-light-128x128.png")
    Save-Png -bitmap $lightBmps[180] -filePath (Join-Path $dir "favicon-light-180x180.png")
    Save-Png -bitmap $lightBmps[192] -filePath (Join-Path $dir "favicon-light-192x192.png")
    Save-Png -bitmap $lightBmps[256] -filePath (Join-Path $dir "favicon-light-256x256.png")
    Save-Png -bitmap $lightBmps[512] -filePath (Join-Path $dir "favicon-light-512x512.png")
    Save-Png -bitmap $lightBmps[32] -filePath (Join-Path $dir "favicon-light.png")
    Save-Ico -bitmaps @($lightBmps[16], $lightBmps[32], $lightBmps[48]) -outputPath (Join-Path $dir "favicon-light.ico")

    # 3. Default standard fallbacks
    Save-Png -bitmap $darkBmps[16] -filePath (Join-Path $dir "favicon-16x16.png")
    Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $dir "favicon-32x32.png")
    Save-Png -bitmap $darkBmps[48] -filePath (Join-Path $dir "favicon-48x48.png")
    Save-Png -bitmap $darkBmps[180] -filePath (Join-Path $dir "apple-touch-icon.png")
    Save-Png -bitmap $darkBmps[192] -filePath (Join-Path $dir "android-chrome-192x192.png")
    Save-Png -bitmap $darkBmps[512] -filePath (Join-Path $dir "android-chrome-512x512.png")
    Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $dir "favicon.png")
    Save-Ico -bitmaps @($darkBmps[16], $darkBmps[32], $darkBmps[48]) -outputPath (Join-Path $dir "favicon.ico")

    # 4. Brand emblems (dark & light)
    Save-Png -bitmap $darkBmps[16] -filePath (Join-Path $dir "ln-ashlar-emblem-dark-16.png")
    Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $dir "ln-ashlar-emblem-dark-32.png")
    Save-Png -bitmap $darkBmps[64] -filePath (Join-Path $dir "ln-ashlar-emblem-dark-64.png")
    Save-Png -bitmap $darkBmps[128] -filePath (Join-Path $dir "ln-ashlar-emblem-dark-128.png")
    Save-Png -bitmap $darkBmps[256] -filePath (Join-Path $dir "ln-ashlar-emblem-dark-256.png")
    Save-Png -bitmap $darkBmps[256] -filePath (Join-Path $dir "ln-ashlar-emblem-dark.png")

    Save-Png -bitmap $lightBmps[16] -filePath (Join-Path $dir "ln-ashlar-emblem-light-16.png")
    Save-Png -bitmap $lightBmps[32] -filePath (Join-Path $dir "ln-ashlar-emblem-light-32.png")
    Save-Png -bitmap $lightBmps[64] -filePath (Join-Path $dir "ln-ashlar-emblem-light-64.png")
    Save-Png -bitmap $lightBmps[128] -filePath (Join-Path $dir "ln-ashlar-emblem-light-128.png")
    Save-Png -bitmap $lightBmps[256] -filePath (Join-Path $dir "ln-ashlar-emblem-light-256.png")
    Save-Png -bitmap $lightBmps[256] -filePath (Join-Path $dir "ln-ashlar-emblem-light.png")

    # 5. Brand logos (dark & light)
    Save-Png -bitmap $darkBmps[128] -filePath (Join-Path $dir "ln-ashlar-logo-dark-128.png")
    Save-Png -bitmap $darkBmps[256] -filePath (Join-Path $dir "ln-ashlar-logo-dark-256.png")
    Save-Png -bitmap $darkBmps[512] -filePath (Join-Path $dir "ln-ashlar-logo-dark-512.png")
    Save-Png -bitmap $darkBmps[512] -filePath (Join-Path $dir "ln-ashlar-logo-dark.png")

    Save-Png -bitmap $lightBmps[128] -filePath (Join-Path $dir "ln-ashlar-logo-light-128.png")
    Save-Png -bitmap $lightBmps[256] -filePath (Join-Path $dir "ln-ashlar-logo-light-256.png")
    Save-Png -bitmap $lightBmps[512] -filePath (Join-Path $dir "ln-ashlar-logo-light-512.png")
    Save-Png -bitmap $lightBmps[512] -filePath (Join-Path $dir "ln-ashlar-logo-light.png")
}

# Deploy to repo root
Write-Host "Deploying to repository root..."
Save-Png -bitmap $darkBmps[512] -filePath (Join-Path $repoRoot "ln-ashlar-logo-dark.png")
Save-Png -bitmap $lightBmps[512] -filePath (Join-Path $repoRoot "ln-ashlar-logo-light.png")
Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $repoRoot "favicon.png")
Save-Ico -bitmaps @($darkBmps[16], $darkBmps[32], $darkBmps[48]) -outputPath (Join-Path $repoRoot "favicon.ico")

# Deploy to demo root
Write-Host "Deploying to demo root..."
$demoDir = Join-Path $repoRoot "demo"
Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $demoDir "favicon.png")
Save-Ico -bitmaps @($darkBmps[16], $darkBmps[32], $darkBmps[48]) -outputPath (Join-Path $demoDir "favicon.ico")

# Deploy to demo/admin
Write-Host "Deploying to demo/admin..."
$demoAdminDir = Join-Path $repoRoot "demo\admin"
Save-Png -bitmap $darkBmps[32] -filePath (Join-Path $demoAdminDir "favicon.png")
Save-Ico -bitmaps @($darkBmps[16], $darkBmps[32], $darkBmps[48]) -outputPath (Join-Path $demoAdminDir "favicon.ico")
Save-Png -bitmap $darkBmps[256] -filePath (Join-Path $demoAdminDir "ln-ashlar-logo-dark.png")
Save-Png -bitmap $lightBmps[256] -filePath (Join-Path $demoAdminDir "ln-ashlar-logo-light.png")
Save-Png -bitmap $darkBmps[256] -filePath (Join-Path $demoAdminDir "ln-ashlar-logo.png")

# Cleanup bitmaps
foreach ($k in $darkBmps.Keys) {
    $darkBmps[$k].Dispose()
    $lightBmps[$k].Dispose()
}
$darkMaster1024.Dispose()
$lightMaster1024.Dispose()
$darkCroppedBmp.Dispose()
$lightCroppedBmp.Dispose()
$darkRawBmp.Dispose()
$lightRawBmp.Dispose()

Write-Host "All tightly-cropped brand, logo, and favicon assets generated successfully!"
