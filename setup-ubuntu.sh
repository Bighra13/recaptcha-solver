#!/bin/bash

echo "🚀 Setting up reCAPTCHA Solver on Ubuntu..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${YELLOW}⚠️  Warning: This script is designed for Ubuntu/Linux${NC}"
fi

# Check Node.js
echo "1️⃣  Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "   Install it with:"
    echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "   sudo apt-get install -y nodejs"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION${NC}"
fi

# Check ffmpeg
echo "2️⃣  Checking ffmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  ffmpeg not found. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y ffmpeg
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ffmpeg installed${NC}"
    else
        echo -e "${RED}❌ Failed to install ffmpeg${NC}"
        exit 1
    fi
else
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo -e "${GREEN}✅ ffmpeg installed${NC}"
fi

# Install npm dependencies
echo "3️⃣  Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Build project
echo "4️⃣  Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Project built${NC}"

# Install Playwright browsers
echo "5️⃣  Installing Playwright Chromium..."
npx playwright install chromium
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Playwright install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Chromium installed${NC}"

# Install system dependencies for Playwright
echo "6️⃣  Installing system dependencies..."
npx playwright install-deps chromium
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Some system dependencies may be missing${NC}"
    echo "   You may need to run: sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Run test: node test-ubuntu.mjs"
echo "   2. With verbose output: VERBOSE=1 node test-ubuntu.mjs"
echo ""
echo "📚 Documentation:"
echo "   - UBUNTU_SETUP.md - Complete setup guide"
echo "   - HEADLESS_FIX.md - Fix explanation"
echo "   - README.md - General usage"
