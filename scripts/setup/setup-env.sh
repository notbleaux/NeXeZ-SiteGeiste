#!/bin/bash

set -e

echo "🔧 Environment Setup"
echo "===================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file"
        exit 0
    fi
fi

# Copy template
cp .env.example .env

echo "✅ .env file created"
echo ""
echo "Please configure the following environment variables:"
echo ""
echo "🤖 AI Services (required for full functionality):"
echo "  - OPENAI_API_KEY"
echo "  - ANTHROPIC_API_KEY"
echo ""
echo "💾 Database (optional for local development):"
echo "  - DATABASE_URL (default: postgresql://localhost:5432/nexez_db)"
echo "  - REDIS_URL (default: redis://localhost:6379)"
echo ""
echo "Edit .env file now? (y/N):"
read -p "" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ${EDITOR:-nano} .env
fi

echo ""
echo "✅ Environment setup complete!"
