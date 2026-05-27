#!/bin/bash
# NeXeZ-SiteGeiste — Local Deploy Script (Bash)
# Run this on Linux/macOS to deploy to GitHub Pages

set -e

echo "========================================"
echo "  NeXeZ-SiteGeiste — Deploy to GitHub"
echo "========================================"
echo ""

REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
echo "Remote: $REMOTE"
echo ""

echo "Step 1: Building..."
npm run build

echo ""
echo "Step 2: Deploying to gh-pages branch..."

DIST_PATH="$(pwd)/dist"
TEMP_DIR=$(mktemp -d)

cp -r "$DIST_PATH/"* "$TEMP_DIR/"
cd "$TEMP_DIR"
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy SiteGeiste $(date '+%Y-%m-%d %H:%M')"
git remote add origin "$REMOTE"
git push -f origin gh-pages

cd -
rm -rf "$TEMP_DIR"

echo ""
echo "========================================"
echo "  DEPLOYED SUCCESSFULLY"
echo "========================================"
echo ""
echo "Your site will be live at:"
echo "  https://notbleaux.github.io/NeXeZ-SiteGeiste/"
echo ""
echo "(May take 1-2 minutes to propagate)"
