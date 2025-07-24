#!/bin/bash
set -e

echo "🚀 Starting Netlify build for Trip Planner..."

# Set environment variables
export CI=false
export NODE_ENV=production
export GENERATE_SOURCEMAP=false

# Change to trip-planner directory
cd trip-planner

echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

echo "🧹 Cleaning previous builds..."
rm -rf build
rm -rf node_modules/.cache

echo "🔨 Building React application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output directory: $(pwd)/build"
ls -la build/

echo "🎉 Netlify build finished!"