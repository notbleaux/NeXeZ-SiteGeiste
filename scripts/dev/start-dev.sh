#!/bin/bash

set -e

echo "🚀 Starting NeXeZ SiteGeiste Development Servers"
echo "==============================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Run ./scripts/setup/setup-env.sh first"
    exit 1
fi

# Start all development servers
echo "Starting development servers..."
echo ""
echo "📱 WebApp will be available at: http://localhost:3000"
echo "🔌 API Gateway at: http://localhost:3001"
echo "🌐 Website at: http://localhost:3002"
echo ""

pnpm dev
