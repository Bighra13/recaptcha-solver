import { chromium } from "playwright-core";
import { existsSync } from "fs";

// Check if lib exists
if (!existsSync("./lib/index.mjs")) {
    console.error("❌ Error: lib/index.mjs not found!");
    console.error("\nPlease build the project first:");
    console.error("  npm install");
    console.error("  npm run build");
    process.exit(1);
}

import { solve, HEADLESS_ARGS } from "./lib/index.mjs";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("Testing headless reCAPTCHA solver...");
console.log("HEADLESS_ARGS:", HEADLESS_ARGS);

main();

async function main() {
    try {
        console.log("\n1. Launching browser with HEADLESS_ARGS...");
        const browser = await chromium.launch({
            headless: false,
            args: HEADLESS_ARGS,
        });

        console.log("2. Opening new page...");
        const page = await browser.newPage();
        
        console.log("3. Navigating to reCAPTCHA demo page...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });

        console.log("4. Attempting to solve reCAPTCHA...");
        console.time("solve reCAPTCHA");
        const solved = await solve(page);
        console.timeEnd("solve reCAPTCHA");
        
        if (solved) {
            console.log("✓ reCAPTCHA solved successfully!");
            
            console.log("5. Clicking submit button...");
            await page.click("#recaptcha-demo-submit");
            await page.waitForTimeout(2000);
            
            console.log("6. Taking screenshot...");
            await page.screenshot({ path: "test-result.png" });
            console.log("   Screenshot saved to test-result.png");
        } else {
            console.log("✓ No challenge required (already verified)");
        }

        await browser.close();
        console.log("\n✓ Test completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n✗ Test failed:");
        console.error(error.message);
        console.error(error.stack);
        process.exit(1);
    }
}
