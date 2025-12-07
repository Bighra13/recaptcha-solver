import { chromium } from "playwright-core";
import { solve } from "./lib/index.mjs";

// Enable verbose logging
process.env.VERBOSE = "1";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("🐛 DEBUG MODE - Testing reCAPTCHA solver with detailed logging\n");

async function main() {
    try {
        const browser = await chromium.launch({
            headless: false,
            slowMo: 1000,  // Very slow so you can see everything
        });

        const page = await browser.newPage();
        
        console.log("📍 Navigating to:", EXAMPLE_PAGE);
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });
        
        console.log("⏳ Waiting 3 seconds...\n");
        await page.waitForTimeout(3000);

        console.log("🚀 Starting solve() with VERBOSE logging enabled...\n");
        console.log("=" .repeat(60));
        
        const solved = await solve(page);
        
        console.log("=".repeat(60));
        console.log(`\n✅ Result: ${solved}`);
        
        console.log("\n⏳ Keeping browser open for 10 seconds so you can inspect...");
        await page.waitForTimeout(10000);

        await browser.close();
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error:");
        console.error(error.message);
        console.error("\n📋 Stack trace:");
        console.error(error.stack);
        process.exit(1);
    }
}

main();
