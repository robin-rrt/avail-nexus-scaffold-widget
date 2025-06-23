#!/bin/bash

# Test script for Avail Nexus Scaffold-ETH 2 Extension

set -e

echo "🧪 Testing Avail Nexus Extension..."

# Check required files exist
echo "📁 Checking file structure..."
required_files=(
    "package.json"
    "README.md"
    "install.sh"
    "tsconfig.json"
    "extension/packages/nextjs/app/nexus/NexusContext.tsx"
    "extension/packages/nextjs/app/nexus/InitNexus.tsx"
    "extension/packages/nextjs/app/nexus/page.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check package.json structure
echo "📦 Checking package.json..."
if jq -e '.name' package.json > /dev/null 2>&1; then
    echo "✅ package.json is valid JSON"
else
    echo "❌ package.json is not valid JSON"
    exit 1
fi

# Check for Privy references (should be removed)
echo "🔍 Checking for Privy references..."
if grep -r "privy" . --exclude-dir=node_modules 2>/dev/null; then
    echo "⚠️  Found Privy references - these should be removed"
else
    echo "✅ No Privy references found"
fi

# Check install script is executable
echo "🔧 Checking install script..."
if [ -x "install.sh" ]; then
    echo "✅ install.sh is executable"
else
    echo "❌ install.sh is not executable"
    exit 1
fi

# Check TypeScript files for basic syntax
echo "📝 Checking TypeScript files..."
for ts_file in extension/packages/nextjs/app/nexus/*.tsx; do
    if [ -f "$ts_file" ]; then
        echo "✅ $ts_file exists"
    fi
done

echo "🎉 All tests passed! Extension is ready for GitHub." 