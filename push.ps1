Set-Location "C:\Users\sskri\Downloads\Project\SQLMind-AI"
$git = "C:\Program Files\Git\cmd\git.exe"

# Remove temp scripts
Remove-Item -LiteralPath "C:\Users\sskri\Downloads\Project\SQLMind-AI\check_git.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\sskri\Downloads\Project\SQLMind-AI\cleanup_commit.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "C:\Users\sskri\Downloads\Project\SQLMind-AI\deploy.ps1" -Force -ErrorAction SilentlyContinue

# Add all files
& $git add -A 2>&1

# Check what's staged
Write-Output "=== Staged ==="
& $git diff --cached --stat 2>&1

# Commit if there are changes
& $git commit -m "Prepare for Vercel deployment" 2>&1

# Push to GitHub
Write-Output "`n=== Pushing to GitHub ==="
& $git push origin main 2>&1
