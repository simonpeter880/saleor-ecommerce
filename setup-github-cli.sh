#!/bin/bash
# GitHub CLI Installation and Repository Setup Script
# Run this with: sudo bash setup-github-cli.sh

set -e  # Exit on error

echo "=================================="
echo "GitHub CLI Installation & Setup"
echo "=================================="
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run with sudo: sudo bash setup-github-cli.sh"
    exit 1
fi

echo "✓ Running with sudo privileges"
echo ""

# Step 1: Install GitHub CLI
echo "📦 Installing GitHub CLI..."
if command -v gh &> /dev/null; then
    echo "✓ GitHub CLI already installed ($(gh --version))"
else
    apt update
    apt install gh -y
    echo "✓ GitHub CLI installed successfully"
fi
echo ""

# Step 2: Show authentication instructions
echo "=================================="
echo "Next Steps (run as regular user):"
echo "=================================="
echo ""
echo "1. Authenticate with GitHub:"
echo "   gh auth login"
echo ""
echo "2. Create repository and push:"
echo "   cd /home/cymo/projects"
echo "   gh repo create saleor-ecommerce --public --source=. --push"
echo ""
echo "   Or for private repository:"
echo "   gh repo create saleor-ecommerce --private --source=. --push"
echo ""
echo "3. Verify the push:"
echo "   git remote -v"
echo "   git log --oneline"
echo ""
echo "=================================="
echo "✅ Installation complete!"
echo "=================================="
