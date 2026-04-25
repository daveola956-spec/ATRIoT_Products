# Image compression script using .NET
Add-Type -AssemblyName System.Drawing

$imageDir = "c:\Users\eniph\ATRIoT_products\assets\images"
$backupDir = Join-Path $imageDir "original-backup"

# Create backup directory
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Output "Created backup directory at $backupDir"
}

# Get all PNG and JPG files
$images = Get-ChildItem -Path $imageDir -Include "*.png", "*.jpg" -File

$totalBefore = 0
$totalAfter = 0

foreach ($image in $images) {
    if ($image.FullName -like "*\original-backup\*") { continue }
    
    $totalBefore += $image.Length
    $backupPath = Join-Path $backupDir $image.Name
    
    # Backup original
    Copy-Item -Path $image.FullName -Destination $backupPath -Force
    
    try {
        # Load image
        [System.Drawing.Bitmap]$bmp = [System.Drawing.Image]::FromFile($image.FullName)
        
        # Calculate new dimensions (max 2048x2048 to prevent oversizing)
        $maxDim = 2048
        $width = $bmp.Width
        $height = $bmp.Height
        
        if ($width -gt $maxDim -or $height -gt $maxDim) {
            if ($width -gt $height) {
                $newWidth = $maxDim
                $newHeight = [math]::Round(($height / $width) * $maxDim)
            } else {
                $newHeight = $maxDim
                $newWidth = [math]::Round(($width / $height) * $maxDim)
            }
            
            $resized = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
            $graphics = [System.Drawing.Graphics]::FromImage($resized)
            $graphics.DrawImage($bmp, 0, 0, $newWidth, $newHeight)
            $graphics.Dispose()
            $bmp.Dispose()
            $bmp = $resized
        }
        
        # Save with compression
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/png" }
        if (-not $encoder -and $image.Extension -eq ".jpg") {
            $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        }
        
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)
        
        if ($encoder) {
            $bmp.Save($image.FullName, $encoder, $encoderParams)
        } else {
            $bmp.Save($image.FullName)
        }
        
        $encoderParams.Dispose()
        $bmp.Dispose()
        
        $compressedSize = (Get-Item $image.FullName).Length
        $totalAfter += $compressedSize
        $reduction = [math]::Round((($image.Length - $compressedSize) / $image.Length) * 100, 1)
        
        $beforeMB = [math]::Round($image.Length/1MB, 2)
        $afterMB = [math]::Round($compressedSize/1MB, 2)
        Write-Output "OK: $($image.Name): $beforeMB MB to $afterMB MB (-$reduction%)"
    }
    catch {
        Write-Output "ERROR: $($image.Name): $_"
    }
}

$totalReduction = [math]::Round((($totalBefore - $totalAfter) / $totalBefore) * 100, 1)
$beforeMB = [math]::Round($totalBefore/1MB, 2)
$afterMB = [math]::Round($totalAfter/1MB, 2)
$savedMB = [math]::Round(($totalBefore - $totalAfter)/1MB, 2)

Write-Output ""
Write-Output "========================================"
Write-Output "Total: $beforeMB MB to $afterMB MB (-$totalReduction%)"
Write-Output "Saved: $savedMB MB"
Write-Output "Originals backed up to: $backupDir"
