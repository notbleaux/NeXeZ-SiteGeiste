#!/bin/bash
# RAT-OS Submodule Setup Script
# Run this to link the RAT-OS monorepo as a vendored dependency

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITEGEISTE="$REPO_ROOT/02-PRIME-SITEGEISTE/01-NeXeZ-SiteGeiste"
RATOS="$REPO_ROOT/01-PRIME-RAT-OS/01-satorXrotas"

echo "========================================"
echo "  RAT-OS → SiteGeiste Submodule Setup"
echo "========================================"
echo ""

cd "$SITEGEISTE"

# Check if RAT-OS exists
if [ ! -d "$RATOS" ]; then
    echo "ERROR: RAT-OS not found at $RATOS"
    echo "Make sure 01-PRIME-RAT-OS/01-satorXrotas is populated."
    exit 1
fi

echo "RAT-OS found at: $RATOS"
echo ""

# Remove existing vendor link if present
if [ -L "vendor/satorXrotas" ]; then
    echo "Removing existing vendor link..."
    rm vendor/satorXrotas
fi

# Create vendor directory
mkdir -p vendor

# Create symlink (or copy for Windows compatibility)
if command -v ln &> /dev/null; then
    echo "Creating symlink..."
    ln -s "$RATOS" vendor/satorXrotas
else
    echo "Creating directory copy (Windows fallback)..."
    cp -r "$RATOS" vendor/satorXrotas
fi

echo ""
echo "✅ RAT-OS linked to SiteGeiste"
echo ""
echo "Import path: @njz-os"
echo "Physical path: vendor/satorXrotas/packages/@njz-os"
echo ""
echo "Next steps:"
echo "  1. cd $SITEGEISTE"
echo "  2. npm run dev"
echo "  3. Open http://localhost:3000"
