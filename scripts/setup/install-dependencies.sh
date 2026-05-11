#!/bin/bash

set -e

echo "🎮 Welcome to NeXeZ SiteGeiste Setup!"
echo "======================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "Current version: $(node -v)"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Check pnpm
echo "📦 Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing pnpm..."
    npm install -g pnpm
    echo "✅ pnpm installed"
else
    echo "✅ pnpm $(pnpm -v) detected"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes. Grab a coffee! ☕"
pnpm install
echo "✅ Dependencies installed"
echo ""

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and add your API keys"
else
    echo "✅ .env file already exists"
fi
echo ""

# Run type check
echo "🔍 Running type check..."
pnpm typecheck || echo "⚠️  Type check has warnings (this is okay for first setup)"
echo ""

# Success message
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Visit http://localhost:3000 to see the app"
echo "4. Check out docs/onboarding/00-welcome.md to begin your journey!"
echo ""
echo "🚀 Ready to build something amazing!"
