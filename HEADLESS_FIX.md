# Fix for "No Audio Device Detected" on Ubuntu CLI Servers

## Problem
When running `recaptcha-solver` on headless Ubuntu servers or Docker containers, you may encounter:
```
Error: No audio device detected
```

This happens because the browser tries to play the reCAPTCHA audio challenge through system audio hardware, which doesn't exist on headless servers.

## Solution
The library now exports `HEADLESS_ARGS` - a set of browser launch arguments that disable audio output requirements.

### Usage

```javascript
import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

const browser = await chromium.launch({
    headless: true,
    args: HEADLESS_ARGS  // Add this!
});

const page = await browser.newPage();
await page.goto("https://www.google.com/recaptcha/api2/demo");
await solve(page);
```

### What HEADLESS_ARGS includes:
- `--disable-audio-output` - Prevents audio device requirement
- `--mute-audio` - Mutes all audio
- `--no-sandbox` - Required for Docker/containerized environments
- `--disable-setuid-sandbox` - Additional sandbox disabling
- `--disable-dev-shm-usage` - Prevents shared memory issues
- `--disable-gpu` - Disables GPU hardware acceleration
- `--autoplay-policy=no-user-gesture-required` - Allows audio without user interaction

## How It Still Works
The solver doesn't actually *play* the audio - it:
1. Intercepts the MP3 file from the network response
2. Saves it to disk
3. Converts it with ffmpeg
4. Uses Vosk (offline speech recognition) to transcribe it
5. Submits the text answer

The browser launch args simply prevent the browser from trying to initialize audio playback hardware.

## Example
See `example/headless.mjs` for a complete working example.

## Testing
```bash
# On Ubuntu server
node example/headless.mjs
```
