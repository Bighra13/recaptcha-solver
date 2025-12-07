# Complete reCAPTCHA Automation Guide

## TL;DR - It's Fully Automatic!

The `solve()` function handles **everything** automatically:

```javascript
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

// Just call solve() - it does everything!
await solve(page);
```

**No manual clicking needed!** The function automatically:
1. ✅ Clicks the "I'm not a robot" checkbox
2. ✅ Switches to audio challenge if needed
3. ✅ Downloads and transcribes the audio
4. ✅ Submits the answer
5. ✅ Retries up to 3 times if it fails

## What You Asked About

> "it is not automatically clicking on recaptcha, we need to simulate this also"

**Good news**: The library already does this! Look at `src/solve.ts` line 87:

```typescript
const label = await box_page.$("#recaptcha-anchor-label");
await label.click();  // ← Automatically clicks the checkbox!
```

The `solve()` function finds the reCAPTCHA checkbox and clicks it automatically. You don't need to add any code for this.

## Complete Integration Example

Here's how to use it in your automation (like your ptv-sports2.sh Node.js code):

```javascript
import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

async function loginWithCaptcha() {
    // Launch browser (headless-friendly for Ubuntu servers)
    const browser = await chromium.launch({
        headless: true,
        args: HEADLESS_ARGS  // Prevents "no audio device" errors
    });
    
    const page = await browser.newPage();
    
    // Navigate to your login page
    await page.goto("https://your-site.com/login");
    
    // Fill in credentials
    await page.type("#username", "your-username");
    await page.type("#password", "your-password");
    
    // Solve reCAPTCHA automatically (clicks checkbox + solves challenge)
    console.log("Solving reCAPTCHA...");
    await solve(page);
    console.log("✓ reCAPTCHA solved!");
    
    // Submit form
    await page.click("#login-button");
    
    // Continue with your automation...
    await page.waitForNavigation();
    
    await browser.close();
}
```

## For Your Starshare Login (from ptv-sports2.sh)

Replace this code in your Node.js section:

```javascript
// OLD CODE (doesn't work):
const captchaIframeSelector = 'iframe[src*="recaptcha/api2/anchor"]';
await page.waitForSelector(captchaIframeSelector, { visible: true, timeout: 5000 });
console.warn("⚠ CAPTCHA detected - skipping login");
throw new Error("CAPTCHA present - skipping Starshare login");
```

With this:

```javascript
// NEW CODE (works automatically):
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

// At browser launch, add HEADLESS_ARGS:
const browser = await chromium.launch({
    headless: true,
    args: HEADLESS_ARGS  // Add this!
});

// In your loginToStarshare function:
await page.type("#username", "Bilal13");
await page.type("#password", "Facebook@#$786");

// Check if CAPTCHA is present
const captchaPresent = await page.$('iframe[src*="recaptcha/api2/anchor"]');

if (captchaPresent) {
    console.log("CAPTCHA detected - solving automatically...");
    await solve(page);  // This handles everything!
    console.log("✓ CAPTCHA solved!");
}

// Continue with login
await page.click("#login_button");
```

## How It Works Internally

When you call `solve(page)`, here's what happens:

### Step 1: Find and Click Checkbox
```typescript
// Finds the reCAPTCHA iframe
const iframe = await page.$('iframe[title="reCAPTCHA"]');
const box_page = await iframe.contentFrame();

// Finds and clicks the checkbox
const label = await box_page.$("#recaptcha-anchor-label");
await label.click();  // ← Automatic click!
```

### Step 2: Detect Challenge Type
```typescript
// Checks if a challenge appeared
const bframe = await page.$('iframe[src*="recaptcha/api2/bframe"]');
const challenge = await bframe.$(CHALLENGE);

// If no challenge needed, returns early
if (!challenge) return false;
```

### Step 3: Switch to Audio
```typescript
// Clicks the audio button
const audio_button = await bframe.$("#recaptcha-audio-button");
await audio_button.click();
```

### Step 4: Solve Audio Challenge
```typescript
// Intercepts the MP3 file from network
page.on("response", async (res) => {
    if (res.headers()["content-type"] === "audio/mp3") {
        // Download MP3
        const audioData = await res.body();
        
        // Convert MP3 → WAV with ffmpeg
        convert(audioData);
        
        // Transcribe with Vosk (offline speech recognition)
        const text = await recognize();
        
        // Type the answer
        await input.type(text);
        
        // Click verify
        await button.click();
    }
});
```

### Step 5: Verify and Retry
```typescript
// Checks if verification passed
page.on("response", async (res) => {
    if (res.url().includes("userverify")) {
        const json = await res.json();
        passed = json[2] === 1;  // 1 = passed, 0 = failed
    }
});

// Retries up to 3 times if failed
while (!passed && tried < 3) {
    // Try again...
}
```

## Ubuntu Server Setup

On your Ubuntu server, make sure you have:

1. **ffmpeg** (required for audio conversion)
   ```bash
   sudo apt-get install ffmpeg
   ```

2. **Build the project**
   ```bash
   npm install
   npm run build
   ```

3. **Use HEADLESS_ARGS** in your code
   ```javascript
   import { HEADLESS_ARGS } from "recaptcha-solver";
   
   const browser = await chromium.launch({
       headless: true,
       args: HEADLESS_ARGS  // Essential for Ubuntu CLI!
   });
   ```

## Testing

Run the test to verify everything works:

```bash
# On Ubuntu server
node test-ubuntu.mjs
```

Expected output:
```
✅ reCAPTCHA solved successfully!
🎉 Test completed successfully!
```

## Common Issues

### "No audio device detected"
**Solution**: Use `HEADLESS_ARGS` when launching the browser.

### "CAPTCHA present - skipping login"
**Solution**: Replace the detection code with `await solve(page)`.

### "Cannot find module './lib/index.mjs'"
**Solution**: Run `npm run build` first.

### "ffmpeg not found"
**Solution**: Install ffmpeg: `sudo apt-get install ffmpeg`

## Summary

You don't need to write any code to click the checkbox - `solve()` already does it! Just call:

```javascript
await solve(page);
```

And it handles everything automatically, including:
- Finding the reCAPTCHA
- Clicking the checkbox
- Solving any challenge
- Retrying if needed

Perfect for automation on Ubuntu servers! 🚀
