# Quick Start - Ubuntu Server

Run these commands on your Ubuntu server:

## Option 1: Automated Setup (Recommended)

```bash
cd /home/bilal/recaptcha-solver

# Make setup script executable
chmod +x setup-ubuntu.sh

# Run setup
./setup-ubuntu.sh

# Test
node test-ubuntu.mjs
```

## Option 2: Manual Setup

```bash
cd /home/bilal/recaptcha-solver

# 1. Install ffmpeg
sudo apt-get update
sudo apt-get install -y ffmpeg

# 2. Install dependencies
npm install

# 3. Build project
npm run build

# 4. Install Playwright
npx playwright install chromium
npx playwright install-deps chromium

# 5. Test
node test-ubuntu.mjs
```

## What Was Fixed?

The "no audio device detected" error is now fixed by using `HEADLESS_ARGS`:

```javascript
import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

const browser = await chromium.launch({
    headless: true,
    args: HEADLESS_ARGS  // ← This fixes the audio error!
});
```

## Files Added

- `HEADLESS_ARGS` export in `src/index.ts`
- `example/headless.mjs` - Example for headless servers
- `test-ubuntu.mjs` - Test script with better error messages
- `setup-ubuntu.sh` - Automated setup script
- `UBUNTU_SETUP.md` - Complete documentation
- `HEADLESS_FIX.md` - Technical explanation

## Verify It Works

After setup, you should see:

```
✅ reCAPTCHA solved successfully!
🎉 Test completed successfully!
✅ The headless fix is working correctly on Ubuntu!
```

No more "no audio device detected" errors! 🎉
