#!/bin/bash

# Avail Nexus Scaffold-ETH 2 Extension Installer
# This script installs the extension into a Scaffold-ETH 2 project

set -e

echo "🚀 Installing Avail Nexus Scaffold-ETH 2 Extension..."

# Check if we're in a Scaffold-ETH 2 project
if [ ! -f "package.json" ] || [ ! -d "packages/nextjs" ]; then
    echo "❌ Error: This doesn't appear to be a Scaffold-ETH 2 project."
    echo "Please run this script from the root of your Scaffold-ETH 2 project."
    exit 1
fi

# Create nexus directory
echo "📁 Creating nexus directory..."
mkdir -p packages/nextjs/app/nexus

# Copy extension files
echo "📋 Copying extension files..."
cp -r extension/packages/nextjs/app/nexus/* packages/nextjs/app/nexus/

# Install dependencies
echo "📦 Installing dependencies..."
cd packages/nextjs
yarn add avail-nexus-sdk@0.0.4-dev.1 viem

# Check if NexusProvider is already in the app provider
if ! grep -q "NexusProvider" packages/nextjs/app/providers.tsx; then
    echo "🔧 Adding NexusProvider to app providers..."
    # This is a placeholder - users will need to manually add the provider
    echo "⚠️  Please manually add NexusProvider to your app's provider hierarchy."
    echo "   See the README for instructions."
fi

echo "✅ Installation complete!"
echo ""
echo "📖 Next steps:"
echo "1. Add NexusProvider to your app's provider hierarchy"
echo "2. Add the nexus page to your navigation"
echo "3. Test the extension by visiting /nexus"
echo ""
echo "📚 For detailed instructions, see the README.md file." 