# Ubuntu Server Setup Guide

Complete guide to set up and test the reCAPTCHA solver on Ubuntu CLI servers.

## Prerequisites

### 1. Install Node.js (if not already installed)
```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install ffmpeg (Required)
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg

# Verify installation
ffmpeg -version
```

### 3. Install Playwright dependencies
```bash
# Install system dependencies for Chromium
sudo apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2
```

## Setup Project

### 1. Clone or navigate to project
```bash
cd /home/bilal/recaptcha-solver
```

### 2. Install dependencies
```bash
npm install
```

This will:
- Install all npm packages
- Download the Vosk speech recognition model (40MB)

### 3. Build the project
```bash
npm run build
```

This creates the `lib/` folder with compiled JavaScript.

### 4. Install Playwright browsers
```bash
npx playwright install chromium
```

## Run Test

### Quick test
```bash
node test-ubuntu.mjs
```

### With verbose output
```bash
VERBOSE=1 node test-ubuntu.mjs
```

## Expected Output

```
🧪 Testing headless reCAPTCHA solver on Ubuntu...

📋 HEADLESS_ARGS: [
  '--disable-audio-output',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--mute-audio',
  '--autoplay-policy=no-user-gesture-required'
]

1️⃣  Launching Chromium with HEADLESS_ARGS...
2️⃣  Opening new page...
3️⃣  Navigating to reCAPTCHA demo page...
4️⃣  Attempting to solve reCAPTCHA...
⏱️  solve reCAPTCHA: 3.245s
✅ reCAPTCHA solved successfully!
5️⃣  Clicking submit button...
6️⃣  Taking screenshot...
   📸 Screenshot saved to test-result.png

🎉 Test completed successfully!
✅ The headless fix is working correctly on Ubuntu!
```

## Troubleshooting

### Error: "No audio device detected"
**Solution**: Make sure you're using `HEADLESS_ARGS` when launching the browser:
```javascript
import { HEADLESS_ARGS } from "recaptcha-solver";

const browser = await chromium.launch({
    headless: true,
    args: HEADLESS_ARGS  // This fixes the audio device error
});
```

### Error: "ffmpeg not found"
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

### Error: "Executable doesn't exist" (Playwright)
```bash
npx playwright install chromium
```

### Error: "Cannot find module './lib/index.mjs'"
```bash
npm run build
```

### Permission errors in Docker
Add these to your Dockerfile:
```dockerfile
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1

# Run as non-root user
RUN useradd -m -u 1000 appuser
USER appuser
```

## Docker Example

```dockerfile
FROM node:20-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium

# Copy source code
COPY . .

# Build project
RUN npm run build

# Run test
CMD ["node", "test-ubuntu.mjs"]
```

Build and run:
```bash
docker build -t recaptcha-test .
docker run recaptcha-test
```

## Integration in Your Project

```javascript
import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

async function yourFunction() {
    const browser = await chromium.launch({
        headless: true,
        args: HEADLESS_ARGS  // Essential for Ubuntu servers!
    });
    
    const page = await browser.newPage();
    await page.goto("https://your-site.com");
    
    // Solve reCAPTCHA
    await solve(page);
    
    // Continue with your automation...
    await browser.close();
}
```
