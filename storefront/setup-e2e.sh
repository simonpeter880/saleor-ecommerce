#!/bin/bash

# E2E Testing Setup Script
# This script sets up Playwright E2E testing for the storefront

set -e

echo "🎭 Setting up Playwright E2E Testing..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first."
    exit 1
fi

echo "📦 Installing Playwright..."
pnpm add -D @playwright/test

echo ""
echo "🌐 Installing Playwright browsers..."
pnpm exec playwright install

echo ""
echo "🔧 Installing system dependencies..."
pnpm exec playwright install-deps

echo ""
echo "✅ Playwright setup complete!"
echo ""
echo "📝 Available commands:"
echo "  pnpm test:e2e          - Run all E2E tests"
echo "  pnpm test:e2e:ui       - Run tests in UI mode (recommended)"
echo "  pnpm test:e2e:headed   - Run tests with browser visible"
echo "  pnpm test:e2e:debug    - Debug tests"
echo "  pnpm test:e2e:mobile   - Run mobile-specific tests"
echo "  pnpm test:e2e:visual   - Run visual regression tests"
echo "  pnpm test:e2e:report   - View test report"
echo ""
echo "📚 Read E2E_TESTING_GUIDE.md for more information"
echo ""
echo "🚀 To run your first test:"
echo "   1. Start the dev server: pnpm dev"
echo "   2. In another terminal: pnpm test:e2e:ui"
echo ""
