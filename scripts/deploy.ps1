# NeXeZ-SiteGeiste — Local Deploy Script (PowerShell)
# Run this on your Windows machine to deploy to GitHub Pages

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NeXeZ-SiteGeiste — Deploy to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check git remote
$remote = git remote get-url origin 2>$null
if ($remote -match "https://github.com/([^/]+)/([^/]+)\.git") {
    $owner = $Matches[1]
    $repo = $Matches[2]
    Write-Host "Repository: $owner/$repo" -ForegroundColor Green
} else {
    Write-Host "Warning: Could not parse remote URL. Make sure you're authenticated." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 1: Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Deploying to gh-pages branch..." -ForegroundColor Yellow

# Option A: Using gh-pages CLI (requires GITHUB_TOKEN or SSH auth)
# npx gh-pages -d dist

# Option B: Manual git push to gh-pages
$distPath = Join-Path $PSScriptRoot "dist"
$tempDir = [System.IO.Path]::GetTempPath() + [System.Guid]::NewGuid().ToString()

New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Copy-Item -Path "$distPath\*" -Destination $tempDir -Recurse -Force

Push-Location $tempDir
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy SiteGeiste $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git remote add origin $remote
git push -f origin gh-pages
Pop-Location

Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYED SUCCESSFULLY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site will be live at:" -ForegroundColor Cyan
Write-Host "  https://notbleaux.github.io/NeXeZ-SiteGeiste/" -ForegroundColor White
Write-Host ""
Write-Host "(May take 1-2 minutes to propagate)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
[void][System.Console]::ReadKey($true)
