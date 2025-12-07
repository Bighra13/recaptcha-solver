#!/usr/bin/env node

import { existsSync } from "fs";
import { resolve } from "path";

// Check if lib exists before importing
const libPath = resolve("./lib/index.mjs");
if (!existsSync(libPath)) {
    console.error("❌ Error: lib/index.mjs not found!");
    console.error("\n📦 Please build the project first:");
    console.error("   npm install");
    console.error("   npm run build");
    console.error("\n💡 Then run this test again:");
    console.error("   node test-ubuntu.mjs");
    process.exit(1);
}

// Dynamic import to avoid early evaluation
const { chromium } = await import("playwright-core");
const { solve, HEADLESS_ARGS } = await import("./lib/index.mjs");

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("🧪 Testing headless reCAPTCHA solver on Ubuntu...\n");
console.log("📋 HEADLESS_ARGS:", HEADLESS_ARGS);
console.log("");

async function main() {
    try {
        console.log("1️⃣  Launching Chromium with HEADLESS_ARGS...");
        const browser = await chromium.launch({
            headless: true,
            args: HEADLESS_ARGS,
        });

        console.log("2️⃣  Opening new page...");
        const page = await browser.newPage();
        
        console.log("3️⃣  Navigating to reCAPTCHA demo page...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });

        console.log("4️⃣  Attempting to solve reCAPTCHA...");
        console.time("⏱️  solve reCAPTCHA");
        const solved = await solve(page);
        console.timeEnd("⏱️  solve reCAPTCHA");
        
        if (solved) {
            console.log("✅ reCAPTCHA solved successfully!");
            
            console.log("5️⃣  Clicking submit button...");
            await page.click("#recaptcha-demo-submit");
            await page.waitForTimeout(2000);
            
            console.log("6️⃣  Taking screenshot...");
            await page.screenshot({ path: "test-result.png" });
            console.log("   📸 Screenshot saved to test-result.png");
        } else {
            console.log("✅ No challenge required (already verified)");
        }

        await browser.close();
        console.log("\n🎉 Test completed successfully!");
        console.log("✅ The headless fix is working correctly on Ubuntu!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Test failed:");
        console.error("   Error:", error.message);
        
        if (error.message.includes("Executable doesn't exist")) {
            console.error("\n💡 Playwright browsers not installed. Run:");
            console.error("   npx playwright install chromium");
        } else if (error.message.includes("ffmpeg")) {
            console.error("\n💡 ffmpeg not found. Install it:");
            console.error("   sudo apt-get update");
            console.error("   sudo apt-get install ffmpeg");
        }
        
        console.error("\n📋 Full stack trace:");
        console.error(error.stack);
        process.exit(1);
    }
}

main();
